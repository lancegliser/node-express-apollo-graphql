import { rootUri } from "../../constants";

export const accessTokenCookieName = "access_token";
export const refreshTokenCookieName = "refresh_token";
export const tokenTypeCookieName = "token_type";

export const baseAuthUri = "auth";
export const loginUri = `login`;
export const logoutUri = `logout`;
export const oAuthRedirectUri = `oauth-redirect`;

export const anonymousAuthURIs = [
  "",
  loginUri,
  logoutUri,
  oAuthRedirectUri,
].map((uri) =>
  [rootUri.replace(/\/$/, ""), baseAuthUri, uri].filter(Boolean).join("/"),
);
