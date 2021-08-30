import { gql } from "apollo-server";
import { print } from "graphql";
import {
  expectGraphQLSuccessResponse,
  withResolverContext,
} from "../../../tests/graphql.utils";
import supertest from "supertest";
import { GRAPHQL_URI } from "../../constants";
import { User } from "../../generated/types";

describe("users", () => {
  it("should return the users from request context", async (done) => {
    await withResolverContext(async ({ application, authorization }) => {
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

      const user: User = response.body.data.self;
      expect(user.id).toBeTruthy();

      done();
    });
  });
});
