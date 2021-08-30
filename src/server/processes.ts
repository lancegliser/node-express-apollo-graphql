import logger from "./logger";

export const onProcessUncaughtException = (err: Error) => {
  logger.error("onProcessUncaughtException:", { err });
  process.exit(1);
};

export const onProcessUnhandledRejection = (reason: Error | any) => {
  logger.error(`onProcessUnhandledRejection:`, reason);
  process.exit(1);
};

export const onProcessExit = (code: number) => {
  logger.info(`Exiting with code: ${code}`);
};
