import GraphQLJSON from "graphql-type-json";
import { DocumentNode, GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addResolvers as addUserResolvers } from "./users/users.resolvers";
import { graphQLAuthDirective } from "./auth/auth.utils";
import { IResolvers } from "@graphql-tools/utils";
import { addAuthRoutes } from "./auth/auth.routes";
import { Express } from "express";
import { addSystemResolvers } from "./system/system.resolvers";
import { addAuthResolvers } from "./auth/auth.resolvers";

const { authDirectiveTransformer } = graphQLAuthDirective("auth");

export const getResolvers = async (
  typeDefs: DocumentNode,
): Promise<GraphQLSchema> => {
  // Stub the resolvers, including any special scalar types required by plugins
  const resolvers: IResolvers = {
    Query: {},
    Mutation: {},
    JSON: GraphQLJSON,
  };

  // Add any component resolvers you require
  addSystemResolvers(resolvers);
  addAuthResolvers(resolvers);
  addUserResolvers(resolvers);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  return authDirectiveTransformer(schema);
};

export const addRoutes = (app: Express): void => {
  addAuthRoutes(app);
};
