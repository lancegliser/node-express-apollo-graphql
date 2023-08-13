import express, { Express } from "express";
import { getGraphQLContextAdditions } from "./components/context";
import { graphqlUri } from "./constants";
import { GraphQLSchema } from "graphql";
import logger from "./server/logger";
import {
  use404Handler,
  useBodyRequestParsing,
  useCors,
  useErrorHandling,
  useExpressErrorLogging,
  useGraphQL,
  useHealthCheck,
  useOptionsMethodInterceptor,
  useRequestLogging,
} from "./server/middleware";
import { addRoutes, getResolvers } from "./components";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { useSystemContext } from "./server/systemContext";
import { useAuthentication } from "./server/authentication";

// Node can use file watchers.
// If a new graphql file is created, be sure to update the index imports.
const typeDefsArray = loadFilesSync(["src/components/**/*.graphql"]);
const typeDefs = mergeTypeDefs(typeDefsArray);

export const getApplication = async (): Promise<express.Application> => {
  logger.debug("Configuring application");
  const app = express();
  // const systemContext = await getSystemContext();
  const schema: GraphQLSchema = await getResolvers(typeDefs);

  useExpressErrorLogging(app);
  // await applySchemas(arangoDb);
  useCors(app);
  useOptionsMethodInterceptor(app);
  useHealthCheck(app);
  useSystemContext(app);
  useAuthentication(app);
  useRequestLogging(app, { ignorePaths: [graphqlUri] });
  useBodyRequestParsing(app);
  // await applyMessageQueue(systemContext);
  useRoutes(app);
  // GraphQL will catch all non-declared routes
  await applyGraphQL(app, schema);
  useErrorHandling(app);
  use404Handler(app);

  return app;
};

const useRoutes = (app: Express): void => {
  // Standard routes which must be applied first to take priority over GraphQL's root behaviors
  addRoutes(app);
};

// A hook to apply database schemas based on your implementation of a schema manager
// const applySchemas = async (database: Database): Promise<void> => {
// const dependencies = { database, logger };
// const schemaManager = await useSchemaManager(dependencies);
// const schemas = [
//   new UsersSchema(dependencies),
//   new DataSetsSchema(dependencies),
//   new SagasSchema(dependencies),
//   new KnowledgeBaseSchema(dependencies),
// ];
// await schemaManager.install(schemas);
// const moduleNames = schemas.map((schema) => schema.module);
// logger.debug(`Schemas applied: ${moduleNames.join(", ")}`);
// };

const applyGraphQL = async (
  app: express.Application,
  schema: GraphQLSchema,
) => {
  await useGraphQL(
    app,
    {
      schema,
    },
    graphqlUri,
    {
      context: getGraphQLContextAdditions,
    },
  );
};

// A hook for apply RabbitMQ if desired
// const applyMessageQueue = async (systemContext: SystemContext) => {
//   logger.debug("Applying message queue");
//
//   // Standard rabbit handling
//   rabbitMQConnection.initialized
//     .then(async () => {
//       await sagasQueue.bind(rabbitMQDefaultExchange);
//       await sagasQueue.activateConsumer((message) =>
//         sagaConsumer(systemContext, message)
//       );
//       await addDataSetRabbitMQConnections(systemContext);
//
//       await rabbitMQConnection.completeConfiguration();
//     })
//     .catch((err) => {
//       logger.error(`RabbitMQ connection error: ${err.message}`, { err });
//       throw err;
//     });
// };
