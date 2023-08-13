import gql from "graphql-tag";
import { print } from "graphql";
import {
  User,
  UsersMutationsSaveUserArgs,
  UsersQueryGetByIdArgs,
  UsersQuerySearchArgs,
  UsersSearchPagedResponse,
} from "../../generated/types";
import { expectGraphQLSuccessResponse } from "../../../tests/expectations/graphql";
import { RequestContext, withRequestContext } from "../../../tests/utilities";
import { postCredentialedGraphQLRequest } from "../../../tests/graphql.utils";
import { expectUser, UserFields } from "./users.test";

describe("user resolvers", () => {
  describe("search", () => {
    it("should return a set of users with default offset 0 and limit 10", async () => {
      await withUsersSearchPageContext(async ({ usersSearchPage }) => {
        expectUserSearchPage(usersSearchPage);
        expect(usersSearchPage.limit).toBe(10);
        expect(usersSearchPage.offset).toBe(0);
        expect(usersSearchPage.items.length).toBeGreaterThan(0);
      });
    });

    it("should return a set of users with offset 2 and limit 2", async () => {
      await withUsersSearchPageContext(async (context) => {
        const limit = 2;
        const offset = 2;
        const usersSearchPage = await resolverGetUserSearchPage(context, {
          limit,
          offset,
        });
        expectUserSearchPage(usersSearchPage);
        expect(usersSearchPage.limit).toBe(limit);
        expect(usersSearchPage.offset).toBe(offset);
        expect(usersSearchPage.items).toStrictEqual(
          context.usersSearchPage.items.slice(offset, limit + offset),
        );
      });
    });
  });

  describe("getById", () => {
    it("should return a user given an id", async () => {
      await withUsersSearchPageContext(
        async ({ usersSearchPage, ...context }) => {
          const firstUser = usersSearchPage.items.at(0);
          if (!firstUser) {
            throw new Error("firstUser is undefined");
          }

          const response = await postCredentialedGraphQLRequest(
            context,
            print(gql`
              query User($id: ID!) {
                users {
                  getById(id: $id) {
                    ...UserFields
                  }
                }
              }
              ${UserFields}
            `),
            { id: firstUser.id } satisfies UsersQueryGetByIdArgs,
          );
          expectGraphQLSuccessResponse(response);

          const user: User = response.body.data.users.getById;
          expectUser(user);
          expect(user).toStrictEqual(firstUser);
        },
      );
    });
  });

  describe("saveUser", () => {
    it("should save the user and return the updated user", async () => {
      await withUsersSearchPageContext(
        async ({ usersSearchPage, ...context }) => {
          const firstUser = usersSearchPage.items.at(0);
          if (!firstUser) {
            throw new Error("firstUser is undefined");
          }

          const newName = new Date().toLocaleString();
          const response = await postCredentialedGraphQLRequest(
            context,
            print(gql`
              mutation SaveUser($user: UserInput!) {
                users {
                  saveUser(user: $user) {
                    ...UserFields
                  }
                }
              }
              ${UserFields}
            `),
            {
              user: {
                displayName: newName,
                // email: undefined, // If not provided, the old value is maintained
                id: firstUser.id,
              },
            } satisfies UsersMutationsSaveUserArgs,
          );
          expectGraphQLSuccessResponse(response);

          const user: User = response.body.data.users.saveUser;
          expectUser(user);
          expect(user.displayName).toBe(newName);
        },
      );
    });
  });
});

// A helper context function to ensure all tests have users list
let usersSearchPage: UsersSearchPagedResponse;
type WithUsersSearchPageContext = (
  context: RequestContext & { usersSearchPage: UsersSearchPagedResponse },
) => Promise<void>;
const withUsersSearchPageContext = async (fn: WithUsersSearchPageContext) => {
  await withRequestContext(async (context) => {
    if (!usersSearchPage) {
      usersSearchPage = await resolverGetUserSearchPage(context, {});
    }

    await fn({ ...context, usersSearchPage });
  });
};

const resolverGetUserSearchPage = async (
  context: RequestContext,
  args: UsersQuerySearchArgs,
): Promise<UsersSearchPagedResponse> => {
  const response = await postCredentialedGraphQLRequest(
    context,
    print(gql`
      query UsersSearch(
        $limit: Int
        $offset: Int
        $orderMethod: UsersSearchOrderMethod
        $orderDirection: SortDirection
      ) {
        users {
          search(
            limit: $limit
            offset: $offset
            order: { method: $orderMethod, direction: $orderDirection }
          ) {
            limit
            offset
            total
            items {
              ...UserFields
            }
          }
        }
      }
      ${UserFields}
    `),
    args,
  );
  expectGraphQLSuccessResponse(response);

  // Assign the returned any value to an intermediate variable with a strong type.
  // This lets you get autocomplete, sure.
  // More important: Your tests will show the reference when you search for usages.
  return response.body.data.users.search as UsersSearchPagedResponse;
};

const expectUserSearchPage = (page: UsersSearchPagedResponse): void => {
  expect(page.limit).toBeGreaterThanOrEqual(0);
  expect(page.offset).toBeGreaterThanOrEqual(0);
  expect(page.items.length).toBeLessThanOrEqual(page.limit);
  usersSearchPage.items.forEach(expectUser);
};
