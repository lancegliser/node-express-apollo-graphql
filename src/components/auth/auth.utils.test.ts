import {
  getAuthProviderLoginUrl,
  getAuthProviderLogoutUrl,
  getAuthenticationContext,
} from "./auth.utils";
import { Request } from "express";
import {
  accessTokenCookieName,
  refreshTokenCookieName,
  tokenTypeCookieName,
} from "./auth.constants";
import {
  withRequestContext,
  withSystemContext,
} from "../../../tests/utilities";
import { TokenType } from "../../services/auth-api/generated/types";
import { Maybe } from "../../generated/types";
import { expectStringIfTruthy } from "../../../tests/expectations";
import { getAbsoluteUrl } from "../../utilities/common";
import { expectDisplayName } from "../../../tests/expectations/interfaces";
import { AuthenticationContext } from "../../server/authentication";

describe("auth utils", () => {
  describe("getFusionAuthLoginUrl", () => {
    const protocol = "https";
    const port = 3000;
    const hostname = "127.0.0.1";
    const headers = { host: `${hostname}:${port}` };

    it("should return an absolute url", async () => {
      const url = await getAuthProviderLoginUrl(
        {
          protocol,
          headers,
        } as unknown as Request,
        {
          pkceChallenge: Math.random().toString(),
        },
      );
      expect(getAbsoluteUrl(url)).toBeTruthy();
      const queryString = url.split("?").at(1);
      const urlParams = new URLSearchParams(queryString);
      const redirectUrl = urlParams.get("redirect_uri");
      expect(redirectUrl).toMatch(`${protocol}://${hostname}:${port}`);
    });

    // I'm not sure this is required anymore
    it.skip("should include the AWS lambda execution stage if provided by request context", async () => {
      const invokeRequestContextPath = "/prod";

      const url = await getAuthProviderLoginUrl(
        {
          protocol,
          headers,
          locals: {
            aws: {
              gateway: {
                event: {
                  headers,
                  requestContext: {
                    path: invokeRequestContextPath,
                  },
                },
              },
            },
          },
        } as unknown as Request,
        {
          pkceChallenge: Math.random().toString(),
        },
      );

      const queryString = url.split("?").at(1);
      const urlParams = new URLSearchParams(queryString);
      const redirectUrl = urlParams.get("redirect_uri");
      expect(redirectUrl).toMatch(
        `${protocol}://${hostname}:${port}${invokeRequestContextPath}`,
      );
    });

    it("should contain a return state if supplied", async () => {
      const state = `/route/${Math.random().toString()}?value=${Math.random().toString()}`;

      const url = await getAuthProviderLoginUrl(
        {
          protocol,
          headers,
        } as unknown as Request,
        {
          pkceChallenge: Math.random().toString(),
          state,
        },
      );

      const queryString = url.split("?").at(1);
      const urlParams = new URLSearchParams(queryString);
      const stateParam = urlParams.get("state");
      expect(stateParam).toBe(state);
    });
  });

  describe("getFusionAuthLogoutUrl", () => {
    it("should return an absolute url", async () => {
      const url = await getAuthProviderLogoutUrl();
      expect(getAbsoluteUrl(url)).toBeTruthy();
    });
  });

  describe("getRequestAuthentication", () => {
    it("should return a user and credentials given valid credentials", async () => {
      await withRequestContext(async ({ systemContext, credentials }) => {
        expect(credentials?.accessToken).toBeTruthy();
        // This won't be present for entities through client credentials grant
        expectStringIfTruthy(credentials?.refreshToken);

        const { identity, credentials: returnedCredentials } =
          await getAuthenticationContext(
            getRequestWithCookies({
              [accessTokenCookieName]: credentials?.accessToken,
              [refreshTokenCookieName]: credentials?.refreshToken,
              [tokenTypeCookieName]: credentials?.tokenType,
            }),
            systemContext,
          );

        expectAuthenticationIdentity(identity);
        expectAuthenticationCredentials(returnedCredentials);
      });
    });

    it("should return a user and new access token if the current is invalid while the refresh token is valid", async () => {
      await withRequestContext(async ({ systemContext, credentials }) => {
        if (!credentials?.refreshToken) {
          // We're probably using a test entity. If we're not, there is a huge problem.
          if (!(process.env.TEST_ENTITY_ID && process.env.TEST_ENTITY_SECRET)) {
            throw new Error(
              "credentials?.refreshToken is undefined and test entity credentials are not in defined",
            );
          }

          expect(credentials?.refreshToken).toBeFalsy();
          return;
        }

        const { identity, credentials: returnedCredentials } =
          await getAuthenticationContext(
            getRequestWithCookies({
              [accessTokenCookieName]: "", // Mangle the access token to test refresh
              [refreshTokenCookieName]: credentials?.refreshToken,
              [tokenTypeCookieName]: credentials?.tokenType,
            }),
            systemContext,
          );

        expectAuthenticationIdentity(identity);
        expectAuthenticationCredentials(returnedCredentials);
      });
    });

    it("should return undefined if credentials are invalid", async () => {
      await withSystemContext(async (context) => {
        const { identity, credentials } = await getAuthenticationContext(
          getRequestWithCookies({
            [accessTokenCookieName]: undefined, // Mangle the access token
            [refreshTokenCookieName]: undefined, // Mangle the refresh token
            [tokenTypeCookieName]: undefined,
          }),
          context,
        );

        expect(identity).toBeFalsy();
        expect(credentials?.accessToken).toBeFalsy();
        expect(credentials?.refreshToken).toBeFalsy();
      });
    });
  });

  const getRequestWithCookies = (cookies: unknown): Request =>
    ({ cookies }) as Request;
});

export const expectAuthenticationIdentity = (
  identity?: Maybe<AuthenticationContext["identity"]>,
) => {
  if (!identity) {
    throw new Error("identity is undefined");
  }

  expect(identity).toBeTruthy();
  expectDisplayName(identity);
  expect(identity.id).toMatch(/.+:.+/);
  expectStringIfTruthy(identity.timezone);
};

export const expectAuthenticationCredentials = (
  credentials?: Maybe<AuthenticationContext["credentials"]>,
) => {
  if (!credentials) {
    throw new Error("credentials is undefined");
  }

  expect(credentials.accessToken).toBeTruthy();
  expectStringIfTruthy(credentials.refreshToken);
  expect(credentials?.accessToken).not.toBe(credentials.refreshToken);
  if (credentials.tokenType) {
    expect([TokenType.Mac, TokenType.Bearer]).toContain(credentials.tokenType);
  }
};
