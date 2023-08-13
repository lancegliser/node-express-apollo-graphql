import express, { Express, Response } from "express";
import { CookieOptions, RequestHandler } from "express-serve-static-core";
import pkceChallenge from "pkce-challenge";
import {
  authECSEventEndFields,
  authECSEventFields,
  authECSEventStartFields,
  getAuthProviderLoginUrl,
  getAuthProviderLogoutUrl,
  getOauthRedirectUrl,
  exchangeOAuthCodeForCredentialsUsingPKCE,
} from "./auth.utils";
import {
  accessTokenCookieName,
  baseAuthUri,
  loginUri,
  logoutUri,
  oAuthRedirectUri,
  refreshTokenCookieName,
  tokenTypeCookieName,
} from "./auth.constants";
import { isProduction, rootUri, uiBaseUrl } from "../../constants";
import { AuthenticationCredentials } from "../../services/auth-api/generated/types";

export const addAuthRoutes = (app: Express): void => {
  const router = express.Router();
  // "/auth" or "/api/auth"
  const rootAndAuthBaseUri =
    "/" +
    [rootUri.replace(/^\//, "").replace(/\/$/, ""), baseAuthUri]
      .filter(Boolean)
      .join("/");
  app.use(rootAndAuthBaseUri, router);
  router.get("/" + loginUri, handleLogin);
  router.get("/" + logoutUri, handleLogout);
  router.get("/" + oAuthRedirectUri, handleOauthRedirect);
};

const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const logger = req.locals?.system?.logger;
    if (!logger) {
      throw new Error("req.locals?.system?.logger is undefined");
    }

    // Store the PKCE verifier in session to validate we issued this login.
    const { code_verifier, code_challenge } = pkceChallenge();
    req.session.pckeVerifier = code_verifier;

    const { state } = req.query;
    if (state && typeof state !== "string") {
      throw new Error(`req.query.state is invalid ${state}`);
    }

    const url = await getAuthProviderLoginUrl(req, {
      pkceChallenge: code_challenge,
      state,
    });

    logger.debug(`Login redirecting user to: ${url}`, {
      ...authECSEventStartFields,
      "event.extras": {
        sessionId: req.sessionID,
        code_verifier,
        code_challenge,
        state,
      },
    });

    res.redirect(url);
  } catch (reason) {
    return next(reason);
  }
};

const handleLogout: RequestHandler = async (req, res, next) => {
  try {
    const logger = req.locals?.system?.logger;
    if (!logger) {
      throw new Error("req.locals?.system?.logger is undefined");
    }

    const url = await getAuthProviderLogoutUrl();
    logger.debug(`Logout redirecting user to: ${url}`, {
      ...authECSEventStartFields,
      "event.extras": { sessionId: req.sessionID },
    });

    clearAuthenticationCookies(res);
    res.redirect(url);
  } catch (reason) {
    return next(reason);
  }
};

const handleOauthRedirect: RequestHandler = async (req, res, next) => {
  try {
    const logger = req.locals?.system?.logger;
    if (!logger) {
      throw new Error("req.locals?.system?.logger is undefined");
    }

    const code = req.query.code;
    if (typeof code !== "string" || !code) {
      const errorMessage = `Oauth redirect response code was invalid: '${code}'`;
      logger.error(errorMessage, {
        ...authECSEventFields,
        "event.type": ["denied", "end", "user"],
        "event.extras": { sessionId: req.sessionID, code },
      });
      return res.status(400).send({ error: errorMessage });
    }

    // Get the current verifier
    const pckeVerifier = req.session.pckeVerifier;
    // Clear it from session to avoid its reuse
    req.session.pckeVerifier = "";
    if (!pckeVerifier) {
      const errorMessage = `Session PCKE challenge verifier is undefined`;
      logger.warn(errorMessage, {
        ...authECSEventFields,
        "event.type": ["denied", "end", "user"],
        "event.extras": { sessionId: req.sessionID, code, pckeVerifier },
      });
      return res.status(412).send({
        error: errorMessage,
      });
    }

    const credentials = await exchangeOAuthCodeForCredentialsUsingPKCE(
      code,
      pckeVerifier,
      getOauthRedirectUrl(req),
    );

    const accessToken = credentials.accessToken;
    if (!accessToken) {
      const errorMessage = `Failed to exchange Oauth code for access token`;
      logger.error(errorMessage, {
        ...authECSEventFields,
        "event.type": ["error", "end", "user"],
        "event.extras": { sessionId: req.sessionID, code, pckeVerifier },
      });
      return res.status(500).send({
        error: errorMessage,
      });
    }

    setAuthenticationCookies(res, credentials);
    const url = [uiBaseUrl, req.query.state].filter(Boolean).join("");

    logger.debug(`OauthRedirect successful redirecting user to ${url}`, {
      ...authECSEventEndFields,
      "event.extras": { sessionId: req.sessionID, code, pckeVerifier },
    });

    res.redirect(302, url);
  } catch (reason) {
    return next(reason);
  }
};

export const setAuthenticationCookies = (
  res: Response,
  { accessToken, refreshToken, tokenType }: Partial<AuthenticationCredentials>,
) => {
  const options: CookieOptions = {
    httpOnly: true,
    secure: isProduction ? true : undefined,
  };
  if (accessToken) {
    res.cookie(accessTokenCookieName, accessToken, options);
  }
  if (refreshToken) {
    res.cookie(refreshTokenCookieName, refreshToken, options);
  }
  if (tokenType) {
    res.cookie(tokenTypeCookieName, tokenType || "Unknown", options);
  }
};

export const clearAuthenticationCookies = (res: Response) => {
  res.clearCookie(accessTokenCookieName);
  res.clearCookie(refreshTokenCookieName);
  res.clearCookie(tokenTypeCookieName);
};
