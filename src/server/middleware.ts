import { Application, NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
// @ts-expect-error It doesn't publish its types
import expressHealthCheck from "express-healthcheck";
import parser from "body-parser";
import expressWinston from "express-winston";
import logger from "./logger";
import {
  graphqlUri,
  healthCheckUri,
  isLoadingPageEnabled,
  isProduction,
  isTest,
} from "../constants";
import { LoggingPlugin } from "./graphql";
import { json } from "body-parser";
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import { WithRequired } from "@apollo/utils.withrequired";
import {
  expressMiddleware,
  ExpressMiddlewareOptions,
} from "@apollo/server/express4";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";

export const useCors = (app: Application) => {
  logger.debug("Registered cors(*)");
  const corsOptions = getCorsOptions();
  app.use(cors(corsOptions));
  app.options("*", cors);
};

const getCorsOptions = (): CorsOptions | undefined => {
  const allowedOrigins = [
    // Fill the array with a deduplicated set of values
    ...new Set([
      // Split and trim the comma separated allowed origins
      ...(process.env.CORS_ALLOWED_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim()),
      // Include the declared UI's base url
      process.env.UI_BASE_URL || "",
    ]),
  ].filter(Boolean);

  return {
    origin: allowedOrigins,
    credentials: true,
  };
};

export const useOptionsMethodInterceptor = (app: Application) => {
  app.use((req, res, next) => {
    // Intercepts OPTIONS method so it never reaches the rest of the API
    if ("OPTIONS" === req.method) {
      res.send(204);
      return;
    }

    next();
  });
};

export const use404Handler = (app: Application) => {
  logger.debug("Registered 404 handler");
  app.use((req, res) => {
    res.status(404);
    res.append("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: "404 Not Found",
      }),
    );
    res.end();
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
  options: IUseRequestLoggingOptions = useRequestLoggingOptionsDefaults,
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

        if (req.path === healthCheckUri) {
          return true;
        }

        if (req.path === "/favicon.ico") {
          return true;
        }

        return options.ignorePaths.indexOf(req.path) >= 0;
      },
    }),
  );
};

export const useExpressErrorLogging = (app: Application) => {
  logger.debug("Registered error logger");
  app.use(
    expressWinston.errorLogger({
      winstonInstance: logger,
    }),
  );
};

export const useBodyRequestParsing = (app: Application) => {
  logger.debug("Registered url and body json parser");

  app.use(parser.urlencoded({ extended: true }));
  app.use(parser.json({ limit: "3mb" }));
};

export const useHealthCheck = (app: Application) => {
  logger.debug(`Registered health check at ${healthCheckUri}`);
  app.use(healthCheckUri, expressHealthCheck());
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
    if (!isProduction) {
      response.stack = err.stack;
    }
    res.status(500).json(response);
  });
};

export const useGraphQL = async <TContext extends BaseContext>(
  app: Application,
  config: ApolloServerOptions<TContext>,
  path: string = graphqlUri,
  middlewareOptions: WithRequired<
    Omit<ExpressMiddlewareOptions<TContext>, "path">,
    "context"
  >,
) => {
  const plugins: ApolloServerOptions<TContext>["plugins"] = [
    isLoadingPageEnabled
      ? ApolloServerPluginLandingPageLocalDefault()
      : ApolloServerPluginLandingPageProductionDefault(),
    ...(config.plugins || []),
  ];
  if (!isTest) {
    plugins.push(LoggingPlugin());
  }

  const server = new ApolloServer({
    plugins,
    csrfPrevention: true,
    cache: "bounded",
    introspection: true,
    logger: logger,
    ...config,
  });

  // app.use(graphqlUploadExpress()); // If you need to upload
  await server.start();
  app.use(path, json(), expressMiddleware<TContext>(server, middlewareOptions));
};
