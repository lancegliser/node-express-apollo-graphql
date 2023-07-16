import { Application } from "express";
import { Logger } from "winston";
import logger from "./logger";

/** Defines the internal repos and library instances that are required during bootstrap */
export interface SystemContext {
  logger: Logger;
  // usersRepo: UsersRepo;
}

export const useSystemContext = (app: Application): void => {
  app.use((req, res, next) => {
    req.locals ||= {};
    req.locals.system = getSystemContext();
    next();
  });
};

/** Provides the internal repos and library instances that are required during bootstrap */
export const getSystemContext = async (): Promise<SystemContext> => {
  // const db = await getDb();
  return {
    logger,
    // usersRepo: new UsersRepo(db),
  };
};
