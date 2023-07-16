import {
  AuthenticationContextQuery,
  AuthenticationContextQueryVariables,
  AuthenticationCredentials,
  AuthenticationLoginUrlQuery,
  AuthenticationLoginUrlQueryVariables,
  AuthenticationLogoutUrlQuery,
  AuthenticationLogoutUrlQueryVariables,
  getSdk,
  Sdk,
} from "../generated/types";
import { GraphQLClient } from "graphql-request";
import { RequestOptions } from "graphql-request/src/types";
import { GraphQLClientRequestHeaders } from "graphql-request/build/cjs/types";

if (!process.env.AUTHENTICATION_SERVICE_URL) {
  throw new Error(`process.env.AUTHENTICATION_SERVICE_URL is undefined`);
}

export const authenticationServiceUrl = process.env.AUTHENTICATION_SERVICE_URL;

export const getAuthenticationSDK = (): Sdk => {
  const client = new GraphQLClient(authenticationServiceUrl);
  const sdk = getSdk(client);
  // We'll use a stub for this repo's example
  sdk.AuthenticationLoginUrl = async (
    variables: AuthenticationLoginUrlQueryVariables,
    requestHeaders?: GraphQLClientRequestHeaders,
  ): Promise<AuthenticationLoginUrlQuery> => ({
    __typename: "Query",
    authentication: {
      __typename: "Authentication",
      loginUrl: "http://5001/login",
    },
  });
  sdk.AuthenticationLogoutUrl = async (
    variables: AuthenticationLogoutUrlQueryVariables,
    requestHeaders?: GraphQLClientRequestHeaders,
  ): Promise<AuthenticationLogoutUrlQuery> => ({
    __typename: "Query",
    authentication: {
      __typename: "Authentication",
      logoutUrl: "http://5001/logut",
    },
  });
  sdk.AuthenticationContext = async (
    variables: AuthenticationContextQueryVariables,
    requestHeaders?: GraphQLClientRequestHeaders,
  ): Promise<AuthenticationContextQuery> => {
    return {
      __typename: "Query",
      authentication: {
        __typename: "Authentication",
        context: {
          __typename: "AuthenticationContext",
          credentials: undefined,
          identity: undefined,
        },
      },
    };
  };
  return sdk;
};

export const getAuthenticationSDKRequestHeaders = (
  credentials?: AuthenticationCredentials | null,
): RequestOptions["requestHeaders"] => {
  const headers: ReturnType<typeof getAuthenticationSDKRequestHeaders> = {};
  const { accessToken, tokenType } = credentials || {};

  if (accessToken) {
    if (!tokenType) {
      throw new Error("tokenType is undefined");
    }
    headers.Authorization = [tokenType, accessToken].filter(Boolean).join(" ");
  }

  headers["User-Agent"] = "SDK";

  return headers;
};
