import winston, { Logger } from "winston";
import { Request, Response } from "express";

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
    req?: Request;
    res?: Response;
    // @see https://www.elastic.co/guide/en/ecs/1.7/ecs-base.html
    labels?: {
      transactionId?: string;
    } & Record<string, any>;
    // @see https://www.elastic.co/guide/en/ecs/current/ecs-user.html
    user: {
      id?: string;
      email?: string;
      fullName?: string;
    };
  }
): Logger => logger.child(context);
