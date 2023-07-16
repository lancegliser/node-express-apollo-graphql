import {
  QueryResolvers,
  Resolvers,
  SystemResolvers,
} from "../../generated/types";
import { getAuthLoginUrl, getAuthLogoutUrl } from "../auth/auth.utils";

export const addSystemResolvers = (resolvers: Resolvers): Resolvers => {
  resolvers.Query = { ...resolvers.Query, ...query };
  resolvers.System = system;
  return resolvers;
};

//@ts-expect-error shush
const query: QueryResolvers = { system: () => ({}) };

const system: SystemResolvers = {
  environment: () => ({
    // Custom variables
    AUTHENTICATION_SERVICE_URL: process.env.AUTHENTICATION_SERVICE_URL,
    OAUTH_APPLICATION_ID: process.env.OAUTH_APPLICATION_ID,
    // OAUTH_APPLICATION_SECRET: process.env.OAUTH_APPLICATION_SECRET // Never expose this
    CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
    UI_BASE_URL: process.env.UI_BASE_URL,
  }),
  config: (_, args, context) => {
    return {
      timestamp: new Date().toISOString(),
      loginUrl: getAuthLoginUrl(context.req),
      logoutUrl: getAuthLogoutUrl(context.req),
      sampleGroupPk: "",
    };
  },
};
