// Register process handling immediately so they can handle any bootstrap issues
import {
  onProcessExit,
  onProcessUncaughtException,
  onProcessUnhandledRejection,
} from "./server/processes";
process.on("uncaughtException", onProcessUncaughtException);
process.on("unhandledRejection", onProcessUnhandledRejection);
process.on("exit", onProcessExit);

// Now import and bootstrap
import { PORT } from "./constants";
import { getApplication } from "./application";
import { getGraphQLContextAdditions } from "./components/context";
import { onAppListening } from "./server/events";

getApplication({
  getGraphQLContextAdditions,
}).then((app) => {
  const server = app.listen(PORT, () => {
    onAppListening(app, server);
  });
});
