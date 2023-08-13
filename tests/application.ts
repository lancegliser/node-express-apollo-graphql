import express from "express";
import { getApplication } from "../src/application";

let app: express.Application;
export const getApp = async (): Promise<express.Application> => {
  if (app) {
    return app;
  }

  app = await getApplication();
  return app;
};
