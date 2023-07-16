// noinspection JSUnusedGlobalSymbols

import { SystemContext } from "../middleware/systemContext";
import { APIGatewayProxyEventBase } from "aws-lambda/trigger/api-gateway-proxy";
import { AuthenticationContext } from "../middleware/authentication";

declare global {
  namespace Express {
    export interface Request {
      locals?: {
        authentication?: AuthenticationContext;
        system?: SystemContext;
        aws?: {
          gateway?: {
            event: APIGatewayProxyEventBase<Record<string, unknown>>;
          };
        };
      } & Record<string, unknown>;
    }
  }
}

// To be used if using an API Gateway
// declare module "express-session" {
//   interface SessionData {
//     /** Using during authentication to provide PCKE challenge workflows */
//     pckeVerifier?: string;
//   }
// }
