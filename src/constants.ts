const envPort = process.env.API_PORT;
export const port: number = envPort ? parseInt(envPort) : 5000;
export const rootUri = "/";
export const graphqlUri = rootUri;
export const healthCheckUri = `${rootUri}health-check`;
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

// if(!process.env.OAUTH_APPLICATION_ID){
//     throw new Error("process.env.OAUTH_APPLICATION_ID is undefined");
// }
export const oAuthApplicationId = process.env.OAUTH_APPLICATION_ID || "";
// if(!process.env.OAUTH_APPLICATION_SECRET){
//     throw new Error("process.env.OAUTH_APPLICATION_SECRET is undefined");
// }
export const oAuthApplicationSecret =
  process.env.OAUTH_APPLICATION_SECRET || "";

if (!process.env.UI_BASE_URL) {
  throw new Error("process.env.UI_BASE_URL is undefined");
}
export const uiBaseUrl = process.env.UI_BASE_URL;

export const isLoadingPageEnabled =
  process.env.IS_LANDING_PAGE_ENABLED === "true";
