import {
  defaultAuthenticationRequiredMessage,
  defaultForbiddenMessage,
} from "../server/authentication";
import { GraphQLResponse } from "graphql-request/src/types";
import { AuthenticationError, ForbiddenError } from "./graphqlErrors";

export const getApolloAuthenticationRequiredError = (
  message = defaultAuthenticationRequiredMessage,
): AuthenticationError => new AuthenticationError(message);

export const getApolloForbiddenError = (
  message = defaultForbiddenMessage,
): ForbiddenError => new ForbiddenError(message);

export const isResponseErrorUnauthenticated = (
  response: GraphQLResponse,
): boolean => response.errors?.at(0)?.extensions.code === "UNAUTHENTICATED";
