import { RequestContext } from "./utilities";
import supertest, { Test } from "supertest";
import {
  accessTokenCookieName,
  refreshTokenCookieName,
  tokenTypeCookieName,
} from "../src/components/auth/auth.constants";

export const getSuperTestGetRequest = (
  context: RequestContext,
  url: string
): Test =>
  supertest(context.application).get(url).set("User-Agent", "Supertest");

export const getSuperTestPostRequest = (
  context: RequestContext,
  url: string
): Test =>
  supertest(context.application).post(url).set("User-Agent", "Supertest");

/**
 * Returns a supertest GET request object preloaded based on RequestContext.
 * const response = await getSuperTestGetRequest(context, '/path').send({});
 */
export const getCredentialedSuperTestGetRequest = (
  context: RequestContext,
  url: string
): Test =>
  getSuperTestGetRequest(context, url).set("Cookie", [
    `${accessTokenCookieName}=${context.credentials?.accessToken}`,
    `${refreshTokenCookieName}=${context.credentials?.refreshToken}`,
    `${tokenTypeCookieName}=${context.credentials?.tokenType}`,
  ]);

/**
 * Returns a supertest POST request object preloaded with cookie credentials based on RequestContext.
 * const response = await getSuperTestGetRequest(context, '/path').send({});
 */
export const getCredentialedSuperTestPostRequest = (
  context: RequestContext,
  url: string
): Test =>
  getSuperTestPostRequest(context, url).set("Cookie", [
    `${accessTokenCookieName}=${context.credentials?.accessToken}`,
    `${refreshTokenCookieName}=${context.credentials?.refreshToken}`,
    `${tokenTypeCookieName}=${context.credentials?.tokenType}`,
  ]);

/**
 * Returns a supertest POST request object preloaded with authorization header based on RequestContext.
 * const response = await getSuperTestGetRequest(context, '/path').send({});
 */
export const getAuthorizedSuperTestPostRequest = (
  context: RequestContext,
  url: string
): Test =>
  getSuperTestPostRequest(context, url).set(
    "Authorization",
    [context.credentials?.tokenType, context.credentials?.accessToken]
      .filter(Boolean)
      .join(" ")
  );
