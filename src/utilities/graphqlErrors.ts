import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLErrorExtensions } from "graphql/error/GraphQLError";

export enum GraphQLErrorCode {
  FORBIDDEN = "FORBIDDEN",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}

export class ForbiddenError extends GraphQLError {
  declare extensions: {
    code: GraphQLErrorCode.FORBIDDEN;
  } & GraphQLErrorExtensions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, ...args: any[]) {
    super(message, args);
    this.message = message || "Forbidden";
    this.extensions.code = GraphQLErrorCode.FORBIDDEN;
  }
}

export class AuthenticationError extends GraphQLError {
  declare extensions: {
    code: GraphQLErrorCode.UNAUTHENTICATED;
  } & GraphQLErrorExtensions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, ...args: any[]) {
    super(message, args);
    this.message = message || "Unauthenticated";
    this.extensions.code = GraphQLErrorCode.UNAUTHENTICATED;
  }
}

export class ValidationError extends GraphQLError {
  declare extensions: {
    code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED;
  } & GraphQLErrorExtensions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, ...args: any[]) {
    super(message, args);
    this.message = message || "Validation error";
    this.extensions.code = ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED;
  }
}

export class UserInputError extends GraphQLError {
  declare extensions: {
    code: ApolloServerErrorCode.BAD_USER_INPUT;
  } & GraphQLErrorExtensions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, ...args: any[]) {
    super(message, args);
    this.message = message || "User input error";
    this.extensions.code = ApolloServerErrorCode.BAD_USER_INPUT;
  }
}
