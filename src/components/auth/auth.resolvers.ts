import { QueryResolvers, Resolvers } from "../../generated/types";

export const addAuthResolvers = (resolvers: Resolvers): Resolvers => {
  resolvers.Query = { ...resolvers.Query, ...query };
  return resolvers;
};

const query: QueryResolvers = {
  self: (_, __, { authentication }) => authentication?.identity || null,
};
