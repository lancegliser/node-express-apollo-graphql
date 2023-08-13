import { print } from "graphql";
import { withRequestContext } from "../../../tests/utilities";
import {
  postAnonymousGraphQLRequest,
  postCredentialedGraphQLRequest,
} from "../../../tests/graphql.utils";
import { expectAuthenticationIdentity } from "./auth.utils.test";
import gql from "graphql-tag";
import { expectGraphQLSuccessResponse } from "../../../tests/expectations/graphql";

describe("auth resolvers", () => {
  describe("self", () => {
    const query = print(gql`
      query Self {
        self {
          __typename
          active
          createdAt
          createdBy
          displayImageUrl
          displayName
          email
          id
          updatedAt
          updatedBy
          timezone
        }
      }
    `);

    it("should get the current user", async () => {
      await withRequestContext(async (context) => {
        const response = await postCredentialedGraphQLRequest(context, query);
        expectGraphQLSuccessResponse(response);
        expectAuthenticationIdentity(response.body.data.self);
      });
    });

    it("should return null for anonymous users", async () => {
      await withRequestContext(async (context) => {
        const response = await postAnonymousGraphQLRequest(context, query);
        expectGraphQLSuccessResponse(response);

        expect(response.body.data.self).toBeFalsy();
      });
    });
  });
});
