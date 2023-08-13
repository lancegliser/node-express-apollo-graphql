// noinspection JSUnusedGlobalSymbols

import { SystemContext } from "../middleware/systemContext";
import { AuthenticationContext } from "../middleware/authentication";

declare global {
  namespace Express {
    export interface Request {
      locals?: {
        authentication?: AuthenticationContext;
        system?: SystemContext;
      } & Record<string, unknown>;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    /** Using during authentication to provide PCKE challenge workflows */
    pckeVerifier?: string;
  }
}
