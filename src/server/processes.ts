import logger from "./logger";

export const onProcessUncaughtException = (...args: unknown[]) => {
  logger.error("onProcessUncaughtException:", args);
  process.exit(1);
};

export const onProcessUnhandledRejection = (...args: unknown[]) => {
  logger.error(`onProcessUnhandledRejection:`, args);
  process.exit(1);
};

export const onProcessExit = (code: number) => {
  logger.info(`Exiting with code: ${code}`);
};
