import { Response } from "supertest";
import { RequestContext } from "./utilities";
import {
  getAuthorizedSuperTestPostRequest,
  getCredentialedSuperTestPostRequest,
} from "./supertest.utils";
import {rootUri} from "../src/constants";

export const postCredentialedGraphQLRequest = async (
    context: RequestContext,
    query: string,
    variables?: Record<string, unknown>
): Promise<Response> =>
    getCredentialedSuperTestPostRequest(context, rootUri).send({
      query,
      variables,
    });

export const postAuthorizedGraphQLRequest = async (
    context: RequestContext,
    query: string,
    variables?: Record<string, unknown>
): Promise<Response> =>
    getAuthorizedSuperTestPostRequest(context, rootUri).send({
      query,
      variables,
    });

export const postAnonymousGraphQLRequest = async (
    context: RequestContext,
    query: string,
    variables?: Record<string, unknown>
): Promise<Response> =>
    postCredentialedGraphQLRequest(
        {
          ...context,
          credentials: {
            accessToken: "",
            refreshToken: "",
            tokenType: undefined,
          },
        },
        query,
        variables
    );

export const expectUnauthenticatedGraphQLResponse = (response: Response) => {
  expect(response.body.errors.at(0).extensions.code).toBe("UNAUTHENTICATED");
};
