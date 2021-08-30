import { QueryResolvers, Resolvers } from "../../generated/types";

export const addResolvers = (resolvers: Resolvers): Resolvers => {
  resolvers.Query = { ...resolvers.Query, ...query };
  return resolvers;
};

const query: QueryResolvers = {
  self: (parent, args, context) => context.user,
};
