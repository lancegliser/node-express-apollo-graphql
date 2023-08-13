import { config } from "dotenv";
config({ path: "./.env.local" });
config({ path: "./.env.development" });
config({ path: "./.env" });

import { port } from "./constants";
import { getApplication } from "./application";
import { onAppListening } from "./server/events";

getApplication().then((app) => {
  const server = app.listen(port, () => {
    onAppListening(app, server);
  });
});
