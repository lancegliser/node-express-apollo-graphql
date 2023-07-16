import { withRequestContext } from "../../../tests/utilities";

import { print } from "graphql/index";
import gql from "graphql-tag";
import {
  postAnonymousGraphQLRequest,
  expectUnauthenticatedGraphQLResponse,
  postCredentialedGraphQLRequest,
} from "../../../tests/graphql.utils";
import { SystemConfig } from "../../generated/types";
import {
  expectDateISOString,
  expectStringArray,
} from "../../../tests/expectations";
import { expectGraphQLSuccessResponse } from "../../../tests/expectations/graphql";

describe("system", () => {
  describe("config", () => {
    it("should return configurations for the environment agnostic of the user", async () => {
      await withRequestContext(async (context) => {
        const response = await postAnonymousGraphQLRequest(
          context,
          print(gql`
            query SystemEnvironment {
              system {
                config {
                  loginUrl
                  logoutUrl
                  timestamp
                }
              }
            }
          `),
        );

        expectGraphQLSuccessResponse(response);
        const config: SystemConfig = response.body.data.system.config;
        expectDateISOString(config.timestamp);
        expect(config.loginUrl).toBeTruthy();
        expect(config.logoutUrl).toBeTruthy();
      });
    });
  });

  it("should return environment variables", async () => {
    await withRequestContext(async (context) => {
      const response = await postCredentialedGraphQLRequest(
        context,
        print(gql`
          query SystemEnvironment {
            system {
              environment
            }
          }
        `),
      );

      expectGraphQLSuccessResponse(response);
      const environment: Record<string, unknown> =
        response.body.data.system.environment;
      expect(environment).toBeTruthy();
      expect(environment.AUTHENTICATION_SERVICE_URL).toBeTruthy();
      expect(environment.OAUTH_APPLICATION_ID).toBeTruthy();
      expect(environment.OAUTH_APPLICATION_SECRET).toBeFalsy();
      if (environment.CORS_ALLOWED_ORIGINS) {
        expectStringArray(environment.CORS_ALLOWED_ORIGINS as string[], 1);
      }
    });
  });

  it("should require authentication", async () => {
    await withRequestContext(async (context) => {
      const response = await postAnonymousGraphQLRequest(
        context,
        print(gql`
          query SystemEnvironment {
            system {
              environment
            }
          }
        `),
      );

      expectUnauthenticatedGraphQLResponse(response);
    });
  });
});
