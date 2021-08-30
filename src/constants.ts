const envPort = process.env.API_PORT;
export const PORT: number = envPort ? parseInt(envPort) : 5000;
export const ROOT_URI = "/";
export const GRAPHQL_URI = `${ROOT_URI}graphql`;
export const HEALTH_CHECK_URL = `${ROOT_URI}health-check`;

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_TEST = process.env.NODE_ENV === "test";
