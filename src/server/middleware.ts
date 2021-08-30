import { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
// @ts-expect-error It doesn't publish its types
import expressHealthCheck from "express-healthcheck";
import parser from "body-parser";
import { v4 } from "uuid";
import expressWinston from "express-winston";
import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import logger from "./logger";
import { GRAPHQL_URI, HEALTH_CHECK_URL, IS_PRODUCTION } from "../constants";
import { graphqlUploadExpress } from "graphql-upload";
import { handleSerializationErrors, LoggingPlugin } from "./graphql";

export const useCors = (app: Application) => {
  logger.debug("Registered cors(*)");
  app.use(cors(/*{ credentials: true, origin: true }*/));
  app.options("*", cors);
};

export const use404Handler = (app: Application) => {
  logger.debug("Registered 404 handler");
  app.use((req, res) => {
    res.status(404);
    res.append("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: "404 Not Found",
      })
    );
    res.end();
  });
};

export const transactionIdHeader = "Transaction-Id";
export const useRequestTransactionId = (app: Application) => {
  app.use((req, res, next) => {
    res.locals = res.locals || {};
    const transactionIdHeaderValue = req.header(transactionIdHeader);
    res.locals.transactionId = transactionIdHeaderValue || v4();
    next();
  });
};

interface IUseRequestLoggingOptions {
  ignorePaths: string[];
}
const useRequestLoggingOptionsDefaults: IUseRequestLoggingOptions = {
  ignorePaths: [],
};
export const useRequestLogging = (
  app: Application,
  options: IUseRequestLoggingOptions = useRequestLoggingOptionsDefaults
) => {
  logger.debug("Registered request logger");
  app.use(
    expressWinston.logger({
      expressFormat: true,
      dynamicMeta: (req, res, err) => ({ req, res, err }),
      level: "info",
      msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
      winstonInstance: logger,
      skip: (req) => {
        if (req.body && req.body.operationName === "IntrospectionQuery") {
          return true;
        }

        if (req.path === HEALTH_CHECK_URL) {
          return true;
        }

        if (req.path === "/favicon.ico") {
          return true;
        }

        return options.ignorePaths.indexOf(req.path) >= 0;
      },
    })
  );
};

export const useExpressErrorLogging = (app: Application) => {
  logger.debug("Registered error logger");
  app.use(
    expressWinston.errorLogger({
      winstonInstance: logger,
    })
  );
};

export const useBodyRequestParsing = (app: Application) => {
  logger.debug("Registered url and body json parser");

  app.use(parser.urlencoded({ extended: true }));
  app.use(parser.json({ limit: "3mb" }));
};

export const useHealthCheck = (app: Application) => {
  logger.debug(`Registered health check at ${HEALTH_CHECK_URL}`);
  app.use(HEALTH_CHECK_URL, expressHealthCheck());
};

export const useErrorHandling = (app: Application) => {
  logger.debug("Registered application error handlers");
  handleCustomErrors(app);
};

interface IErrorResponse {
  error: string;
  stack?: string;
}
const handleCustomErrors = (app: Application) => {
  // While we do not *use* the next function intentionally, we must take the parameter
  // in order to avoid calling it thus causing our desired json output. *blink*... *blink* *blink* What?
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, req, res });
    const response: IErrorResponse = { error: err.message };
    if (!IS_PRODUCTION) {
      response.stack = err.stack;
    }
    res.status(500).json(response);
  });
};

export const useGraphQL = async (
  app: Application,
  config: ApolloServerExpressConfig,
  path: string = GRAPHQL_URI
) => {
  const apolloServer = new ApolloServer({
    debug: !IS_PRODUCTION,
    plugins: [
      LoggingPlugin,
      // Playground
      // process.env.NODE_ENV === "production"
      //   ? ApolloServerPluginLandingPageDisabled()
      //   : ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    formatError: (error) => handleSerializationErrors(error),
    ...config,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path });
  // TODO restore for upload once it works
  // app.use(
  //   path,
  //   graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 10 }),
  //   apolloServer.getMiddleware
  // );
};
