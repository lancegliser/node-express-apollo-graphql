import { gql } from "apollo-server";
import { print } from "graphql";
import {
  User,
  UsersMutationsSaveUserArgs,
  UsersQueryGetByIdArgs,
} from "../../generated/types";
import { expectGraphQLSuccessResponse } from "../../../tests/expectations/graphql";
import { RequestContext, withRequestContext } from "../../../tests/utilities";
import { postCredentialedGraphQLRequest } from "../../../tests/graphql.utils";

describe("users", () => {
  it("should return a user given an id", async () => {
    await withSelfContext(async ({ self, ...context }) => {
      if (!self.id) {
        throw new Error("self.id is undefined");
      }

      const response = await postCredentialedGraphQLRequest(
        context,
        print(gql`
          query User($id: ID!) {
            users {
              getById(id: $id) {
                id
                displayName
              }
            }
          }
        `),
        { id: self.id } satisfies UsersQueryGetByIdArgs,
      );
      expectGraphQLSuccessResponse(response);

      const user: User = response.body.data.users.getById;
      expect(user.id).toBe(self.id);
    });
  });

  it("should save the user and return the updated user", async () => {
    await withSelfContext(async ({ self, ...context }) => {
      if (!self.id) {
        throw new Error("self.id is undefined");
      }

      const newName = new Date().toLocaleString();
      const response = await postCredentialedGraphQLRequest(
        context,
        print(gql`
          mutation SaveUser($user: UserInput!) {
            users {
              saveUser(user: $user) {
                id
                displayName
              }
            }
          }
        `),
        {
          user: {
            displayName: newName,
            // email: undefined, // If not provided, the old value is maintained
            id: self.id,
          },
        } satisfies UsersMutationsSaveUserArgs,
      );
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
  context: RequestContext & { self: User },
) => Promise<void>;
const withSelfContext = async (fn: WithSelfContext) => {
  await withRequestContext(async (context) => {
    if (!self) {
      const response = await postCredentialedGraphQLRequest(
        context,
        print(gql`
          query Self {
            self {
              id
              displayName
            }
          }
        `),
      );
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
