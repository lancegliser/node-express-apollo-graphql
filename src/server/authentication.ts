import { Application } from "express";
import { anonymousAuthURIs } from "../components/auth/auth.constants";
import { getAuthenticationContext } from "../components/auth/auth.utils";
import { setAuthenticationCookies } from "../components/auth/auth.routes";
import { Sdk } from "../services/auth-api/generated/types";
import { HTTP401Error } from "../utilities/httpErrors";

const anonymousPaths = [...anonymousAuthURIs, "/favicon.ico"];

export type AuthenticationContext = Awaited<
  ReturnType<Sdk["AuthenticationContext"]>
>["authentication"]["context"];

export const useAuthentication = (app: Application): void => {
  app.use(async (req, res, next) => {
    req.locals ||= {};
    if (!req.locals.system) {
      return next(new Error("req.locals.system is undefined"));
    }

    req.locals.authentication = await getAuthenticationContext(
      req,
      req.locals.system,
    );
    // Ensure the response provides any updated credentials that may have been generated from the refresh token.
    setAuthenticationCookies(res, {
      accessToken:
        req.locals.authentication.credentials?.accessToken || undefined,
      refreshToken:
        req.locals.authentication.credentials?.refreshToken || undefined,
      tokenType: req.locals.authentication.credentials?.tokenType,
    });

    const isRequestForAnonymousUrl = !anonymousPaths.includes(req.path);
    if (!isRequestForAnonymousUrl && !req.locals.authentication) {
      return next(getUnauthorizedError());
    }
    next();
  });
};

export const getUnauthorizedError = (
  message = defaultAuthenticationRequiredMessage,
): Error => new HTTP401Error(message);

export const defaultAuthenticationRequiredMessage =
  "Authentication is required";
export const defaultForbiddenMessage = "Forbidden";
