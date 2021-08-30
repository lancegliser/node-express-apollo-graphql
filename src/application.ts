import express from "express";
// import { useGraphQL } from "@torch-ai-internal/express-graphql";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
// import { getSchemaWithResolvers } from "./components";
import { GraphQLContext } from "./components/context";
import { GRAPHQL_URI } from "./constants";
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
  useRequestLogging,
  useRequestTransactionId,
} from "./server/middleware";
import { getSchemaWithResolvers } from "./components";

interface IApplicationSettings {
  getGraphQLContextAdditions: (
    context: ExpressContext
  ) => Promise<Omit<GraphQLContext, "_extensionStack">>;
}
export const getApplication = async (
  settings: IApplicationSettings
): Promise<express.Application> => {
  logger.debug("Configuring application");
  const app = express();
  // const systemContext = await getSystemContext();
  const schema: GraphQLSchema = await getSchemaWithResolvers();

  useExpressErrorLogging(app);
  useRequestTransactionId(app);
  // await applySchemas(arangoDb);
  useRequestLogging(app, {
    ignorePaths: [GRAPHQL_URI],
  });
  useCors(app);
  useHealthCheck(app);
  useBodyRequestParsing(app);
  // await applyMessageQueue(systemContext);
  await applyGraphQL(app, settings, schema);
  useErrorHandling(app);
  use404Handler(app);

  return app;
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
  settings: IApplicationSettings,
  schema: GraphQLSchema
) => {
  const context = settings.getGraphQLContextAdditions;
  await useGraphQL(
    app,
    {
      schema,
      context,
      logger,
      introspection: true,
      debug: true,
    },
    GRAPHQL_URI
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
