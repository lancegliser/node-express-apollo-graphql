import winston, { Logger } from "winston";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";

const logger = winston.createLogger({
  exitOnError: false,
  level: process.env.LOG_LEVEL || "debug",
  transports: [new winston.transports.Console()],
});
export default logger;

/** Returns a logger with default meta data overridden to enrich the ECS format */
export const getECSContextualLogger = (
  logger: Logger,
  context: {
    req?: ExpressContextFunctionArgument["req"];
    res?: ExpressContextFunctionArgument["res"];
  } & Record<string, unknown>,
): Logger => logger.child(context);
