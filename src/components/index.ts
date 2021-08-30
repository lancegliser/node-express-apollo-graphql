import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import GraphQLJSON from "graphql-type-json";
import { IResolvers } from "@graphql-tools/utils/Interfaces";
import { GraphQLSchema } from "graphql";
import { addResolversToSchema } from "@graphql-tools/schema";
import { GraphQLUpload } from "graphql-upload";
import { addResolvers as addUserResolvers } from "./users/users.resolvers";

export const getSchemaWithResolvers = async (): Promise<GraphQLSchema> => {
  // Create the schema based on any found .graphql files
  const schema = await loadSchema("./src/**/*.graphql", {
    // load from multiple files using glob
    loaders: [new GraphQLFileLoader()],
  });
  // Stub the resolvers, including any special scalar types required by plugins
  const resolvers: IResolvers = {
    Query: {},
    // Mutation: {}, // Enable if you have any
    JSON: GraphQLJSON,
    Upload: GraphQLUpload!,
  };

  // Add any component resolvers you require
  addUserResolvers(resolvers);
  return addResolversToSchema({
    schema,
    resolvers,
  });
};
