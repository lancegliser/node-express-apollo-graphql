import { Application } from "express";
import { Response } from "supertest";
import { getSystemContext, SystemContext } from "../src/components/context";
import { getApp } from "./application";
// import { v4 } from "uuid";

type TWithSystemContext = (context: SystemContext) => Promise<void>;
/** Supports internal testing, such as repos */
export const withSystemContext = async (
  fn: TWithSystemContext
): Promise<void> => {
  const systemContext = await getSystemContext();
  await fn(systemContext);
};

// type TWithGraphQLContext = (context: GraphQLContext) => Promise<void>;
/**
 * Provides the system context with a test users, and an active auth token.
 * If you don't need users, use withSystemContext() for better performance.
 *
 * Typically this would be used when testing utility functions that require
 * resolver context as an argument.
 **/
// export const withGraphQLContext = async (
//   fn: TWithGraphQLContext
// ): Promise<void> => {
//   await withSystemContext(async (systemContext) => {
//     const authorization = await getAuthorization();
//     await fn({
//       ...systemContext,
//       users: {
//         _id: `${UsersSchema.users.name}/tests`,
//         _key: "tests",
//         displayName: "Test users",
//       },
//       authorization,
//       logger: logger,
//       transactionId: v4(),
//     });
//   });
// };
// const tokenService = new TokenService({
//   clientId: process.env.TEST_TOKEN_CLIENT_ID,
//   clientSecret: process.env.TEST_TOKEN_CLIENT_SECRET,
//   tokenEndpoint: process.env.TEST_TOKEN_ENDPOINT,
// });

/** Defines the shape of data available from outside the application to make requests */
export interface ResolverContext {
  context: SystemContext;
  application: Application;
  authorization: string;
}
type TWithResolverContext = (context: ResolverContext) => Promise<void>;
let application: Application;
let context: SystemContext;
/**
 * Provides a bootstrapped application context and an active auth token for making requests.
 * Includes SystemContext for in case you need to setup or tear down data in your tests.
 **/
export const withResolverContext = async (
  fn: TWithResolverContext
): Promise<void> => {
  if (!application) {
    application = await getApp();
  }
  if (!context) {
    context = await getSystemContext();
  }
  const authorization = await getAuthorization();

  await fn({
    context,
    application,
    authorization,
  });
};

let authorization: string;
export const getAuthorization = async (): Promise<string> => {
  if (!authorization) {
    // const token = await tokenService.getAccessCredentials();
    // authorization = `${token.token_type} ${token.access_token}`;
    authorization = `Bearer `;
  }

  return authorization;
};

export const expectGraphQLSuccessResponse = (response: Response): void => {
  if (response.body.error) {
    throw new Error(response.body.error);
  }
  if (response.body.errors?.length > 0) {
    const error = response.body.errors.slice(0, 1).shift();
    const message = [
      ...(error.path || []),
      error.extensions?.exception?.stacktrace?.join("\r\n") ?? error.message,
    ]
      .filter(Boolean)
      .join(" - ");
    throw new Error(message);
  }
  expect(response.status).toBe(200);
};
