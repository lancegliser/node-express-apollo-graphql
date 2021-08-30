import { ExpressContext } from "apollo-server-express/src/ApolloServer";
import { Logger } from "winston";
import logger, { getECSContextualLogger } from "../server/logger";
import { User } from "../generated/types";

/** Defines the internal repos and library instances that are required during bootstrap */
export interface SystemContext {
  // usersRepo: UsersRepo;
}

/** Provides the internal repos and library instances that are required during bootstrap */
export const getSystemContext = async (): Promise<SystemContext> => {
  // const db = await getDb();
  return {
    // usersRepo: new UsersRepo(db),
  };
};

/** Defines the shape the users will take within each request for reuse */
export interface UserContext {
  user: User;
  authorization?: string;
}
/** Defines the shape the of GraphQL context provided to resolvers */
export interface GraphQLContext extends UserContext, SystemContext {
  /** A sub-instance of the standard logger with users and request details added to every usage */
  logger: Logger;
  /** The unique id associated with this request, or passed along from the if found on the incoming request */
  transactionId: string;
}

export type TGetGraphQLContextAdditions = (
  context: ExpressContext
) => Promise<GraphQLContext>;
/** Adds any context additions required by resolvers based on the incoming request */
export const getGraphQLContextAdditions: TGetGraphQLContextAdditions = async (
  context
) => {
  const systemContext = await getSystemContext();
  // const users = await getUserFromRequest(systemContext.usersRepo, context);
  const user: User = {
    id: "0",
    displayName: "Guest",
  };
  return {
    ...systemContext,
    user,
    authorization: context.req.headers.authorization,
    transactionId: context.res.locals.transactionId,
    logger: getECSContextualLogger(logger, {
      req: context.req,
      res: context.res,
      labels: {
        transactionId: context.res.locals.transactionId,
      },
      user: {
        fullName: user.displayName || undefined,
        email: user.email || undefined,
      },
    }),
  };
};
