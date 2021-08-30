import express from "express";
import { getApplication } from "../src/application";
import { getGraphQLContextAdditions } from "../src/components/context";

let app: express.Application;
export const getApp = async (): Promise<express.Application> => {
  if (app) {
    return app;
  }

  app = await getApplication({
    getGraphQLContextAdditions,
  });
  return app;
};
