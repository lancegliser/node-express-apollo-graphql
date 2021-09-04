import { Application } from "express";
import { Server } from "http";
import logger from "./logger";

// This comment should stay in the code
export const onAppListening = (app: Application, server: Server) => {
  const address = server.address();
  if (!address) {
    throw new Error(`No server address has been registered`);
  }

  const port = typeof address === "string" ? address : address.port;
  logger.debug(`API listening at http://localhost:${port}`);
};
