import { GraphQLClient } from "graphql-request";
import { GraphQLClientRequestHeaders } from "graphql-request/build/cjs/types";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSON: { input: any; output: any };
};

export type Authentication = {
  __typename?: "Authentication";
  /** Returns the AuthContext specific to the application provided for the Authorization access token */
  context: AuthenticationContext;
  /** Returns a URL standardized for the OAuth provider. The user should be redirected to this URL directly. */
  loginUrl: Scalars["String"]["output"];
  /** Returns a URL standardized for the OAuth provider. The user should be redirected to this URL after clearing internal data. */
  logoutUrl: Scalars["String"]["output"];
};

export type AuthenticationContextArgs = {
  application?: InputMaybe<AuthenticationApplicationInput>;
};

export type AuthenticationLoginUrlArgs = {
  application: AuthenticationApplicationInput;
  pkceChallenge: Scalars["String"]["input"];
  pkceChallengeMethod?: InputMaybe<Scalars["String"]["input"]>;
  redirectUrl: Scalars["String"]["input"];
  scopes?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
};

export type AuthenticationLogoutUrlArgs = {
  application: AuthenticationApplicationInput;
};

export type AuthenticationApplicationInput = {
  /** The client application id registered in the OAuth provider */
  clientId: Scalars["String"]["input"];
  /** The client application secret registered in the OAuth provider */
  clientSecret: Scalars["String"]["input"];
  /** An alternative id for an Entity representing the resource as a Entity, often used in client credentials grants. */
  entityId?: InputMaybe<Scalars["String"]["input"]>;
};

export type AuthenticationContext = {
  __typename?: "AuthenticationContext";
  credentials?: Maybe<AuthenticationCredentials>;
  /** Service account associated data. */
  entity?: Maybe<AuthenticationContextEntity>;
  /** Generic identity properties. Could be a user or entity. Combined common properties exist, but are empty depending on type. */
  identity?: Maybe<AuthenticationIdentity>;
};

export type AuthenticationContextEntity = {
  __typename?: "AuthenticationContextEntity";
  /** Permissions specific to the target entity if defined */
  permissions?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type AuthenticationCredentials = {
  __typename?: "AuthenticationCredentials";
  accessToken: Scalars["String"]["output"];
  /** Refresh tokens are typically supplied only for users with offline access grants */
  refreshToken?: Maybe<Scalars["String"]["output"]>;
  /** The type of token to be included in request Authorization headers '{Type} {Token}'. */
  tokenType?: Maybe<TokenType>;
};

/** A base definition authentication actors */
export type AuthenticationIdentity = ICreated &
  IDisplayImage &
  IDisplayName &
  IId &
  IUpdated & {
    __typename?: "AuthenticationIdentity";
    /**
     * True if the Identity is active. False if the User has been deactivated.
     * Deactivated Users will not be able to login. Entities will always be active.
     */
    active: Scalars["Boolean"]["output"];
    /** ISO date time string for the time this resource was created */
    createdAt?: Maybe<Scalars["String"]["output"]>;
    /** Unique identifier for users that created this resource */
    createdBy?: Maybe<Scalars["String"]["output"]>;
    /** A public url name safe to display in any HTML context */
    displayImageUrl?: Maybe<Scalars["String"]["output"]>;
    /** A preformatted name safe to display in any HTML context */
    displayName: Scalars["String"]["output"];
    /** Email address. Users will have emails, entities will not. */
    email?: Maybe<Scalars["String"]["output"]>;
    /** The primary id for this type. Typically a namespaced chain of methods, providers, and unique ids. */
    id: Scalars["ID"]["output"];
    /** The string will be in an IANA time zone format. https://www.iana.org/time-zones */
    timezone?: Maybe<Scalars["String"]["output"]>;
    /** ISO date time string for the time this resource was created */
    updatedAt?: Maybe<Scalars["String"]["output"]>;
    /** Unique identifier for users that created this resource */
    updatedBy?: Maybe<Scalars["String"]["output"]>;
    /** If the account's email has been verified. Entities will always be active. */
    verified: Scalars["Boolean"]["output"];
  };

export type AuthenticationMutations = {
  __typename?: "AuthenticationMutations";
  /** Grants credentials for accessing one entity from another. */
  clientCredentialsGrant: AuthenticationCredentials;
  /** Exchanges an OAuth code for access credentials. Refresh tokens may be issued based on provider configuration. */
  exchangeOAuthCodeForAccessTokenUsingPKCE: AuthenticationCredentials;
  /** Exchanges a refresh token for a new set of credentials. Refresh tokens may be updated or reused based on provider configuration. */
  exchangeRefreshTokenForAccessToken: AuthenticationCredentials;
};

export type AuthenticationMutationsClientCredentialsGrantArgs = {
  entityId: Scalars["String"]["input"];
  entitySecret: Scalars["String"]["input"];
  scope?: InputMaybe<Scalars["String"]["input"]>;
};

export type AuthenticationMutationsExchangeOAuthCodeForAccessTokenUsingPkceArgs =
  {
    application: AuthenticationApplicationInput;
    code: Scalars["String"]["input"];
    pckeVerifier: Scalars["String"]["input"];
    redirectUrl: Scalars["String"]["input"];
  };

export type AuthenticationMutationsExchangeRefreshTokenForAccessTokenArgs = {
  application: AuthenticationApplicationInput;
  refreshToken: Scalars["String"]["input"];
};

export enum AuthenticationRole {
  Anonymous = "Anonymous",
  Authenticated = "Authenticated",
}

export type ICreated = {
  /** ISO date time string for the time this resource was created */
  createdAt?: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for users that created this resource */
  createdBy?: Maybe<Scalars["String"]["output"]>;
};

export type IDisplayImage = {
  /** A public url name safe to display in any HTML context */
  displayImageUrl?: Maybe<Scalars["String"]["output"]>;
};

export type IDisplayName = {
  /** A preformatted display name safe to display in HTML context */
  displayName?: Maybe<Scalars["String"]["output"]>;
};

export type IId = {
  /** The primary id for this type. Typically a UUID. */
  id?: Maybe<Scalars["ID"]["output"]>;
};

export type IUpdated = {
  /** ISO date time string for the time this resource was created */
  updatedAt?: Maybe<Scalars["String"]["output"]>;
  /** Unique identifier for users that created this resource */
  updatedBy?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  authentication: AuthenticationMutations;
};

export type Query = {
  __typename?: "Query";
  authentication: Authentication;
  self?: Maybe<AuthenticationIdentity>;
  system: System;
};

export type System = {
  __typename?: "System";
  /** Returns configurations applicable to the application for the current environment */
  config: SystemConfig;
  /** Provides a list of environmental variables */
  environment: Scalars["JSON"]["output"];
};

/** Provides environment user agnostic system configurations */
export type SystemConfig = {
  __typename?: "SystemConfig";
  /** The current time. A mock field likely to be replaced in application specific implementations. */
  timestamp: Scalars["String"]["output"];
};

/**
 * Bearer Token type as defined by https://tools.ietf.org/html/rfc6750.
 * MAC Token type as referenced by https://tools.ietf.org/html/rfc6749.
 */
export enum TokenType {
  Bearer = "Bearer",
  Mac = "MAC",
}

export type AuthenticationLoginUrlQueryVariables = Exact<{
  application: AuthenticationApplicationInput;
  redirectUrl: Scalars["String"]["input"];
  pkceChallenge: Scalars["String"]["input"];
  pkceChallengeMethod?: InputMaybe<Scalars["String"]["input"]>;
  scopes?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type AuthenticationLoginUrlQuery = {
  __typename?: "Query";
  authentication: { __typename?: "Authentication"; loginUrl: string };
};

export type AuthenticationLogoutUrlQueryVariables = Exact<{
  application: AuthenticationApplicationInput;
}>;

export type AuthenticationLogoutUrlQuery = {
  __typename?: "Query";
  authentication: { __typename?: "Authentication"; logoutUrl: string };
};

export type AuthenticationContextQueryVariables = Exact<{
  application: AuthenticationApplicationInput;
}>;

export type AuthenticationContextQuery = {
  __typename?: "Query";
  authentication: {
    __typename?: "Authentication";
    context: {
      __typename?: "AuthenticationContext";
      credentials?: {
        __typename?: "AuthenticationCredentials";
        accessToken: string;
        refreshToken?: string | null;
        tokenType?: TokenType | null;
      } | null;
      identity?: {
        __typename?: "AuthenticationIdentity";
        displayImageUrl?: string | null;
        displayName: string;
        id: string;
        email?: string | null;
        active: boolean;
        timezone?: string | null;
      } | null;
    };
  };
};

export type ExchangeOAuthCodeForAccessTokenUsingPkceMutationVariables = Exact<{
  application: AuthenticationApplicationInput;
  code: Scalars["String"]["input"];
  redirectUrl: Scalars["String"]["input"];
  pckeVerifier: Scalars["String"]["input"];
}>;

export type ExchangeOAuthCodeForAccessTokenUsingPkceMutation = {
  __typename?: "Mutation";
  authentication: {
    __typename?: "AuthenticationMutations";
    exchangeOAuthCodeForAccessTokenUsingPKCE: {
      __typename?: "AuthenticationCredentials";
      accessToken: string;
      refreshToken?: string | null;
      tokenType?: TokenType | null;
    };
  };
};

export type AuthenticationExchangeRefreshTokenForAccessTokenMutationVariables =
  Exact<{
    application: AuthenticationApplicationInput;
    refreshToken: Scalars["String"]["input"];
  }>;

export type AuthenticationExchangeRefreshTokenForAccessTokenMutation = {
  __typename?: "Mutation";
  authentication: {
    __typename?: "AuthenticationMutations";
    exchangeRefreshTokenForAccessToken: {
      __typename?: "AuthenticationCredentials";
      accessToken: string;
      refreshToken?: string | null;
      tokenType?: TokenType | null;
    };
  };
};

export type AuthenticationClientCredentialsGrantMutationVariables = Exact<{
  entityId: Scalars["String"]["input"];
  entitySecret: Scalars["String"]["input"];
  scope?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type AuthenticationClientCredentialsGrantMutation = {
  __typename?: "Mutation";
  authentication: {
    __typename?: "AuthenticationMutations";
    clientCredentialsGrant: {
      __typename?: "AuthenticationCredentials";
      accessToken: string;
      refreshToken?: string | null;
      tokenType?: TokenType | null;
    };
  };
};

export type AuthenticationCredentialsFieldsFragment = {
  __typename?: "AuthenticationCredentials";
  accessToken: string;
  refreshToken?: string | null;
  tokenType?: TokenType | null;
};

export const AuthenticationCredentialsFieldsFragmentDoc = gql`
  fragment AuthenticationCredentialsFields on AuthenticationCredentials {
    accessToken
    refreshToken
    tokenType
  }
`;
export const AuthenticationLoginUrlDocument = gql`
  query AuthenticationLoginUrl(
    $application: AuthenticationApplicationInput!
    $redirectUrl: String!
    $pkceChallenge: String!
    $pkceChallengeMethod: String
    $scopes: String
    $state: String
  ) {
    authentication {
      loginUrl(
        application: $application
        redirectUrl: $redirectUrl
        pkceChallenge: $pkceChallenge
        pkceChallengeMethod: $pkceChallengeMethod
        scopes: $scopes
        state: $state
      )
    }
  }
`;
export const AuthenticationLogoutUrlDocument = gql`
  query AuthenticationLogoutUrl($application: AuthenticationApplicationInput!) {
    authentication {
      logoutUrl(application: $application)
    }
  }
`;
export const AuthenticationContextDocument = gql`
  query AuthenticationContext($application: AuthenticationApplicationInput!) {
    authentication {
      context(application: $application) {
        credentials {
          ...AuthenticationCredentialsFields
        }
        identity {
          displayImageUrl
          displayName
          id
          email
          active
          timezone
        }
      }
    }
  }
  ${AuthenticationCredentialsFieldsFragmentDoc}
`;
export const ExchangeOAuthCodeForAccessTokenUsingPkceDocument = gql`
  mutation ExchangeOAuthCodeForAccessTokenUsingPKCE(
    $application: AuthenticationApplicationInput!
    $code: String!
    $redirectUrl: String!
    $pckeVerifier: String!
  ) {
    authentication {
      exchangeOAuthCodeForAccessTokenUsingPKCE(
        application: $application
        code: $code
        redirectUrl: $redirectUrl
        pckeVerifier: $pckeVerifier
      ) {
        ...AuthenticationCredentialsFields
      }
    }
  }
  ${AuthenticationCredentialsFieldsFragmentDoc}
`;
export const AuthenticationExchangeRefreshTokenForAccessTokenDocument = gql`
  mutation AuthenticationExchangeRefreshTokenForAccessToken(
    $application: AuthenticationApplicationInput!
    $refreshToken: String!
  ) {
    authentication {
      exchangeRefreshTokenForAccessToken(
        application: $application
        refreshToken: $refreshToken
      ) {
        ...AuthenticationCredentialsFields
      }
    }
  }
  ${AuthenticationCredentialsFieldsFragmentDoc}
`;
export const AuthenticationClientCredentialsGrantDocument = gql`
  mutation AuthenticationClientCredentialsGrant(
    $entityId: String!
    $entitySecret: String!
    $scope: String
  ) {
    authentication {
      clientCredentialsGrant(
        entityId: $entityId
        entitySecret: $entitySecret
        scope: $scope
      ) {
        ...AuthenticationCredentialsFields
      }
    }
  }
  ${AuthenticationCredentialsFieldsFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    AuthenticationLoginUrl(
      variables: AuthenticationLoginUrlQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AuthenticationLoginUrlQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AuthenticationLoginUrlQuery>(
            AuthenticationLoginUrlDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "AuthenticationLoginUrl",
        "query",
      );
    },
    AuthenticationLogoutUrl(
      variables: AuthenticationLogoutUrlQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AuthenticationLogoutUrlQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AuthenticationLogoutUrlQuery>(
            AuthenticationLogoutUrlDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "AuthenticationLogoutUrl",
        "query",
      );
    },
    AuthenticationContext(
      variables: AuthenticationContextQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AuthenticationContextQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AuthenticationContextQuery>(
            AuthenticationContextDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "AuthenticationContext",
        "query",
      );
    },
    ExchangeOAuthCodeForAccessTokenUsingPKCE(
      variables: ExchangeOAuthCodeForAccessTokenUsingPkceMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ExchangeOAuthCodeForAccessTokenUsingPkceMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ExchangeOAuthCodeForAccessTokenUsingPkceMutation>(
            ExchangeOAuthCodeForAccessTokenUsingPkceDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "ExchangeOAuthCodeForAccessTokenUsingPKCE",
        "mutation",
      );
    },
    AuthenticationExchangeRefreshTokenForAccessToken(
      variables: AuthenticationExchangeRefreshTokenForAccessTokenMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AuthenticationExchangeRefreshTokenForAccessTokenMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AuthenticationExchangeRefreshTokenForAccessTokenMutation>(
            AuthenticationExchangeRefreshTokenForAccessTokenDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "AuthenticationExchangeRefreshTokenForAccessToken",
        "mutation",
      );
    },
    AuthenticationClientCredentialsGrant(
      variables: AuthenticationClientCredentialsGrantMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AuthenticationClientCredentialsGrantMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AuthenticationClientCredentialsGrantMutation>(
            AuthenticationClientCredentialsGrantDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "AuthenticationClientCredentialsGrant",
        "mutation",
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
