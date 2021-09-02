import { gql } from "apollo-server";
import { print } from "graphql";
import {
  expectGraphQLSuccessResponse,
  ResolverContext,
  withResolverContext,
} from "../../../tests/graphql.utils";
import supertest from "supertest";
import { GRAPHQL_URI } from "../../constants";
import {
  User,
  UsersMutationsSaveUserArgs,
  UsersQueryGetByIdArgs,
} from "../../generated/types";

describe("users", () => {
  it("should return the current user (self) from request context", async () => {
    await withSelfContext(async ({ self }) => {
      expect(self.displayName).toBeTruthy();
    });
  });

  it("should return a user given an id", async () => {
    await withSelfContext(async ({ application, authorization, self }) => {
      if (!self.id) {
        throw new Error("self.id is undefined");
      }

      const queryData: {
        query: string;
        variables: UsersQueryGetByIdArgs;
      } = {
        query: print(gql`
          query User($id: ID!) {
            users {
              getById(id: $id) {
                id
                displayName
              }
            }
          }
        `),
        variables: { id: self.id },
      };

      const response = await supertest(application)
        .post(GRAPHQL_URI)
        .set("authorization", authorization)
        .send(queryData);
      expectGraphQLSuccessResponse(response);

      const user: User = response.body.data.users.getById;
      expect(user.id).toBe(self.id);
    });
  });

  it("should save the user and return the updated user", async () => {
    await withSelfContext(async ({ application, authorization, self }) => {
      if (!self.id) {
        throw new Error("self.id is undefined");
      }

      const newName = new Date().toLocaleString();

      const queryData: {
        query: string;
        variables: UsersMutationsSaveUserArgs;
      } = {
        query: print(gql`
          mutation SaveUser($user: UserInput!) {
            users {
              saveUser(user: $user) {
                id
                displayName
              }
            }
          }
        `),
        variables: {
          user: {
            displayName: newName,
            // email: undefined, // If not provided, the old value is maintained
            id: self.id,
          },
        },
      };

      const response = await supertest(application)
        .post(GRAPHQL_URI)
        .set("authorization", authorization)
        .send(queryData);
      expectGraphQLSuccessResponse(response);

      const user: User = response.body.data.users.saveUser;
      expect(user.id).toBe(self.id);
      expect(user.displayName).toBe(newName);
    });
  });
});

// A helper context function to ensure all tests have access to self
let self: User;
type WithSelfContext = (
  context: ResolverContext & { self: User }
) => Promise<void>;
const withSelfContext = async (fn: WithSelfContext) => {
  await withResolverContext(async (context) => {
    if (!self) {
      const { application, authorization } = context;
      const queryData: {
        query: string;
      } = {
        query: print(gql`
          query Self {
            self {
              id
              displayName
            }
          }
        `),
        // variables: {},
      };

      const response = await supertest(application)
        .post(GRAPHQL_URI)
        .set("authorization", authorization)
        .send(queryData);
      expectGraphQLSuccessResponse(response);

      // Assign the returned any value to an intermediate variable with a strong type.
      // This lets you get autocomplete, sure.
      // More important: Your tests will show the reference when you search for usages.
      const user: User = response.body.data.self;
      // Always throw at least one test when building context functions.
      // This will ensure dependent tests fail fast.
      expect(user.id).toBeTruthy();
      self = user;
    }

    await fn({ ...context, self });
  });
};
