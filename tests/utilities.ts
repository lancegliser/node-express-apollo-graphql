// Supports external testing, such as resolvers
import { GraphQLContext } from "../src/components/context";
import { Application } from "express";
import {
  getAuthenticationSDK,
  getAuthenticationSDKRequestHeaders,
} from "../src/services/auth-api/src/utils";
import {getSystemContext, SystemContext} from "../src/server/systemContext";
import logger from "../src/server/logger";
import {ExpressContext} from "apollo-server-express/src/ApolloServer";
import {AuthenticationContext} from "../src/server/authentication";
import {getApplication} from "../src/application";

// Supports internal testing, such as repos
type TWithSystemContext = (context: SystemContext) => Promise<void>;
let systemContext: SystemContext;
export const withSystemContext = async (
  fn: TWithSystemContext
): Promise<void> => {
  if (!systemContext) {
    systemContext = await getSystemContext();
  }
  await fn(systemContext);
};

type TWithGraphQLContext = (context: GraphQLContext) => Promise<void>;
/**
 * Provides the system context with a test user, and an active auth token.
 * If you don't need user, use withSystemContext() for better performance.
 **/
export const withGraphQLContext = async (
  fn: TWithGraphQLContext
): Promise<void> => {
  await withSystemContext(async (systemContext) => {
    await fn({
      ...systemContext,
      authentication: {
        credentials: {
          accessToken: "",
          refreshToken: "",
          tokenType: undefined,
        },
        identity: {
          active: true,
          displayName: "Tester Bennington",
          id: "user/code/awesome",
          email: "tester.bennington@park.edu",
        },
      },
      logger: logger,
      req: {} as ExpressContext["req"],
      res: {} as ExpressContext["res"],
    });
  });
};

export interface RequestContext {
  systemContext: SystemContext;
  application: Application;
  credentials: AuthenticationContext["credentials"];
}
type TWithRequestContext = (context: RequestContext) => Promise<void>;
let application: Application;
let credentials: RequestContext["credentials"];
/**
 * Provides a bootstrapped application context and an active auth token for making requests.
 * Includes SystemContext for in case you need to setup or tear down data in your tests.
 **/
export const withRequestContext = async (
  fn: TWithRequestContext
): Promise<void> => {
  await withSystemContext(async (systemContext) => {
    if (!application) {
      application = await getApplication();
    }
    if (!credentials) {
      credentials = await getCredentials();
    }

    await fn({
      systemContext,
      application,
      credentials,
    });
  });
};

export const getCredentials = async (): Promise<
  AuthenticationContext["credentials"]
> => {
  if (
    !credentials &&
    process.env.TEST_ENTITY_ID &&
    process.env.TEST_ENTITY_SECRET
  ) {
    credentials = await getCredentialsByCredentialsGrant(
      process.env.TEST_ENTITY_ID,
      process.env.TEST_ENTITY_SECRET,
      `target-entity:some-user-id`
    );
  }

  if (!credentials) {
    throw new Error("Credentials could not be established");
  }

  return credentials;
};

const getCredentialsByCredentialsGrant = async (
  entityId: string,
  entitySecret: string,
  scope?: string
): Promise<AuthenticationContext["credentials"]> => {
  const sdk = getAuthenticationSDK();

  try {
    const response = await sdk.AuthenticationClientCredentialsGrant(
      {
        entityId,
        entitySecret,
        scope,
      },
      getAuthenticationSDKRequestHeaders()
    );
    return response.authentication.clientCredentialsGrant;
  } catch (reason) {
    throw new Error(
      `Credentials grant could not obtain accessToken: ${reason}`
    );
  }
};
