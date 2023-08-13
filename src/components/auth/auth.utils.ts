import {
  accessTokenCookieName,
  baseAuthUri,
  loginUri,
  logoutUri,
  oAuthRedirectUri,
  refreshTokenCookieName,
  tokenTypeCookieName,
} from "./auth.constants";
import { Request } from "express";
import {
  getAuthenticationSDK,
  getAuthenticationSDKRequestHeaders,
} from "../../services/auth-api/src/utils";
import { GraphQLContext } from "../context";
import { AuthenticationRole } from "../../generated/types";
import { defaultFieldResolver } from "graphql/execution";
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { GraphQLSchema } from "graphql";
import { AuthenticationCredentials } from "../../services/auth-api/generated/types";
import { GraphQLResponse } from "graphql-request/src/types";
import {
  oAuthApplicationId,
  oAuthApplicationSecret,
  rootUri,
} from "../../constants";
import { SystemContext } from "../../server/systemContext";
import {
  getApolloAuthenticationRequiredError,
  getApolloForbiddenError,
  isResponseErrorUnauthenticated,
} from "../../utilities/graphql";
import { AuthenticationContext } from "../../server/authentication";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";

export const getOauthRedirectUrl = (
  req: ExpressContextFunctionArgument["req"],
) => {
  const authBaseUrl = getAuthBaseUrl(req);
  return [authBaseUrl, oAuthRedirectUri].filter(Boolean).join("/");
};

export const getAuthLoginUrl = (req: ExpressContextFunctionArgument["req"]) =>
  [getAuthBaseUrl(req), loginUri].join("/");

export const getAuthLogoutUrl = (req: ExpressContextFunctionArgument["req"]) =>
  [getAuthBaseUrl(req), logoutUri].join("/");

const getAuthBaseUrl = (req: ExpressContextFunctionArgument["req"]) => {
  // The headers version is the only host name that includes the port
  const xForwardedForProtocol = req.header
    ? req.header("x-forwarded-proto")
    : undefined;
  const { protocol: requestProtocol } = req;
  const protocol = xForwardedForProtocol || requestProtocol;
  const host = (req.headers.host || "").replace(/\/$/, "");
  return [
    protocol && host ? `${protocol}://${host}` : undefined,
    rootUri.replace(/^\//, "").replace(/\/$/, ""),
    baseAuthUri,
  ]
    .filter(Boolean)
    .join("/");
};

export const getAuthProviderLoginUrl = async (
  req: Request,
  options: {
    /** State supplied from the application to resume activity on return */
    state?: string;
    pkceChallenge: string;
  },
): Promise<string> => {
  const sdk = getAuthenticationSDK();
  const response = await sdk.AuthenticationLoginUrl(
    {
      application: {
        clientId: oAuthApplicationId,
        clientSecret: oAuthApplicationSecret,
      },
      pkceChallenge: options.pkceChallenge,
      redirectUrl: getOauthRedirectUrl(req),
      state: options.state || "",
    },
    getAuthenticationSDKRequestHeaders(),
  );

  // TODO determine if we have URLSearchParams still
  return response.authentication.loginUrl;

  // return [
  //   `${fusionAuthBaseUrl}/oauth2/authorize/`,
  //   new URLSearchParams({
  //     ...fusionAuthPublicClientParameters,
  //     response_type: "code",
  //
  //     state: options.state || "",
  //     scope: fusionAuthOauthTokenScope,
  //     code_challenge: options.pkceChallenge,
  //     code_challenge_method: "S256",
  //   }).toString(),
  // ].join("?");
};

export const getAuthProviderLogoutUrl = async (): Promise<string> => {
  const sdk = getAuthenticationSDK();
  const response = await sdk.AuthenticationLogoutUrl(
    {
      application: {
        clientId: oAuthApplicationId,
        clientSecret: oAuthApplicationSecret,
      },
    },
    getAuthenticationSDKRequestHeaders(),
  );

  return response.authentication.logoutUrl;
};

export const exchangeOAuthCodeForCredentialsUsingPKCE = async (
  code: string,
  pckeVerifier: string,
  redirectUrl: string,
): Promise<AuthenticationCredentials> => {
  const sdk = getAuthenticationSDK();
  const response = await sdk.ExchangeOAuthCodeForAccessTokenUsingPKCE(
    {
      application: {
        clientId: oAuthApplicationId,
        clientSecret: oAuthApplicationSecret,
      },
      code,
      pckeVerifier,
      redirectUrl,
    },
    getAuthenticationSDKRequestHeaders(),
  );

  return response.authentication.exchangeOAuthCodeForAccessTokenUsingPKCE;
};

export const getAuthenticationContext = async (
  req: ExpressContextFunctionArgument["req"],
  { logger }: Pick<SystemContext, "logger">,
): Promise<AuthenticationContext> => {
  const headers = req.headers || {};
  const [authorizationType, authorizationToken] = (
    headers.authorization || ""
  ).split(" ");
  const cookies = req.cookies || {};
  const accessToken =
    authorizationType.toLowerCase() === "bearer" && authorizationToken
      ? authorizationToken
      : cookies[accessTokenCookieName];
  const refreshToken = cookies[refreshTokenCookieName];

  const tokenType = authorizationType || cookies[tokenTypeCookieName];

  // Generally, we wouldn't bother sending anonymous requests to the Auth service.
  // Recent changes now provide feature that emulates a stub user, regardless of credentials.
  // Testing sending along the anonymous credentials by commenting this out.
  // TODO decide if this needs rolled into the upstream for all services to inherit.
  // if (!accessToken && !refreshToken) {
  //   return {};
  // }

  const initialContext = await getAuthenticationContextFromAccessToken(
    { tokenType, accessToken },
    { logger },
  );
  if (initialContext) {
    return initialContext;
  }

  // Access token failed, let's try to refresh.
  if (!refreshToken) {
    return {};
  }
  const newCredentials = await getCredentialsFromRefreshToken(refreshToken, {
    logger,
  });
  if (!newCredentials) {
    return {};
  }

  const subsequentContext = await getAuthenticationContextFromAccessToken(
    newCredentials,
    { logger },
  );
  return subsequentContext || {};
};

const getAuthenticationContextFromAccessToken = async (
  {
    accessToken,
    tokenType,
  }: Pick<AuthenticationCredentials, "accessToken" | "tokenType">,
  { logger }: Pick<SystemContext, "logger">,
): Promise<ReturnType<typeof getAuthenticationContext> | undefined> => {
  const sdk = getAuthenticationSDK();

  try {
    const initialAuthenticationResponse = await sdk.AuthenticationContext(
      {
        application: {
          clientId: oAuthApplicationId,
          clientSecret: oAuthApplicationSecret,
        },
      },
      getAuthenticationSDKRequestHeaders({ tokenType, accessToken }),
    );
    if (initialAuthenticationResponse.authentication.context.identity) {
      return initialAuthenticationResponse.authentication.context;
    }
  } catch (reason) {
    let isLoggingRequired = true;
    if (reason && typeof reason === "object") {
      const object = reason as Record<string | number, unknown>;
      if (
        object.request &&
        object.response &&
        isResponseErrorUnauthenticated(object.response as GraphQLResponse)
      ) {
        isLoggingRequired = false;
      }
    }

    if (isLoggingRequired) {
      logger.error(`sdk.AuthenticationContext error: ${reason}`, {
        ...authECSEventFields,
        "event.type": ["user"],
        "event.extras": {
          tokenType,
          accessToken,
        },
      });
    }
  }

  return undefined;
};

const getCredentialsFromRefreshToken = async (
  refreshToken: string,
  { logger }: Pick<SystemContext, "logger">,
): Promise<AuthenticationCredentials | undefined> => {
  const sdk = getAuthenticationSDK();

  try {
    const response = await sdk.AuthenticationExchangeRefreshTokenForAccessToken(
      {
        application: {
          clientId: oAuthApplicationId,
          clientSecret: oAuthApplicationSecret,
        },
        refreshToken,
      },
      getAuthenticationSDKRequestHeaders(),
    );
    return response.authentication.exchangeRefreshTokenForAccessToken;
  } catch (reason) {
    logger.error(
      `sdk.AuthenticationExchangeRefreshTokenForAccessToken error: ${reason}`,
      {
        ...authECSEventFields,
        "event.type": ["user"],
        "event.extras": {
          refreshToken,
        },
      },
    );
    return undefined;
  }
};

export const graphQLAuthDirective = (directiveName: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(schema, type, directiveName)?.[0];
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];
          if (authDirective) {
            const { requires } = authDirective;
            if (requires) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = function (
                source,
                args,
                context: GraphQLContext,
                info,
              ) {
                const userRoles = getAuthenticationRoles(context);
                // Is there a problem?
                if (!userRoles.includes(requires)) {
                  // Maybe they just need to log in
                  if (userRoles.includes(AuthenticationRole.Anonymous)) {
                    throw getApolloAuthenticationRequiredError();
                  }
                  // Otherwise they simply aren't allowed
                  throw getApolloForbiddenError();
                }

                // Provide the information
                return resolve(source, args, context, info);
              };
              return fieldConfig;
            }
          }
          return undefined;
        },
      }),
  };
};

const getAuthenticationRoles = (
  context: GraphQLContext,
): AuthenticationRole[] =>
  context.authentication?.identity
    ? [AuthenticationRole.Authenticated]
    : [AuthenticationRole.Anonymous];

export const authECSEventFields = {
  "event.kind": "event",
  "event.category": ["authentication", "network", "session", "web"],
};

export const authECSEventStartFields = {
  ...authECSEventFields,
  "event.type": ["allowed", "start", "user"],
};

export const authECSEventEndFields = {
  ...authECSEventFields,
  "event.type": ["allowed", "end", "user"],
};
