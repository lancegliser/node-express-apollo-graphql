// noinspection JSUnusedGlobalSymbols

import truncate from "lodash.truncate";
import { ApolloServerPlugin } from "@apollo/server";
import { Logger as WinstonLogger } from "winston";
import { getDurationTimer } from "../utilities/timers";

export const LoggingPlugin = <
  // The Apollo Logger doesn't take second functions, so it is a putz.
  // We'll have to send in our own type, the same way we send the logger itself
  Logger extends WinstonLogger,
>(): ApolloServerPlugin => ({
  // Fires when the server prepares to start
  // async serverWillStart(service): Promise<void> {
  //   service.logger.debug("Starting GraphQL server");
  // },
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart({ request, operationName, ...requestContext }) {
    const logger = requestContext.logger as Logger;

    const getDuration = getDurationTimer();
    const action = "Apollo.requestDidStart";
    const querySample = truncate([operationName, request.query].join(":"), {
      length: 50,
    });
    const requestHeaders: Record<string, string | number> = {};
    request.http?.headers.forEach((value, key) => {
      // If it exists, remove 'Authorization'
      if (key.toLowerCase() === "authorization") {
        return;
      }

      requestHeaders[key] = value;
    });

    const extras = {
      request: {
        operationName,
        query: request.query,
        variables: request.variables
          ? Object.keys(request.variables)
          : undefined,
        headers: requestHeaders,
      },
    };
    logger.info(`${action}: ${querySample}`, {
      "event.kind": "event",
      "event.category": ["network", "web"],
      "event.type": ["start", "allowed", "info"],
      "event.reason": action,
      "event.extras": extras,
    });

    return {
      didEncounterErrors: async ({ errors }) => {
        const action = "Apollo.didEncounterErrors";

        try {
          const firstError = errors.slice(0, 1).shift();
          logger.error(`${action}: ${querySample}`, {
            "event.kind": "event",
            "event.category": ["network", "web"],
            "error.type": "GraphQLError",
            "error.message": firstError?.message || "First error unavailable",
            "error.stack_trace": firstError?.stack,
            "event.type": ["end", "allowed", "error"],
            "event.reason": action,
            "event.extras": { ...extras, response: { errors } },
            "event.duration": getDuration(),
          });
        } catch (reason) {
          logger.warn(
            `${action} didEncounterErrors error: ${reason} ${querySample}`,
            {
              "event.kind": "event",
              "event.category": ["network", "web"],
              "event.type": ["end", "allowed", "info"],
              "event.extras": extras,
              "event.reason": action,
              "event.duration": getDuration(),
            },
          );
        }
      },
      willSendResponse: async ({ response }) => {
        const action = "Apollo.willSendResponse";

        try {
          let data: Record<string, unknown> = {};
          if (
            response.body.kind === "single" &&
            "data" in response.body.singleResult &&
            response.body.singleResult.data
          ) {
            data = response.body.singleResult.data;
          }
          if (
            response.body.kind === "incremental" &&
            "data" in response.body.initialResult &&
            response.body.initialResult.data
          ) {
            data = response.body.initialResult.data;
          }

          const sampleData = Object.entries(data || {}).reduce(
            (sampleData, [key, value], currentIndex) => {
              // Per https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch_limits_cwl.html
              // events (log entry) length limit is 256 KB (maximum). This quota can't be changed.
              // Given that limit, let's ensure we can never get close.
              if (currentIndex <= 50) {
                sampleData[key] = truncate(JSON.stringify(value), {
                  length: 2048,
                });
              }

              return sampleData;
            },
            {} as Record<string, string>,
          );

          logger.info(`${action}: ${querySample}`, {
            "event.kind": "event",
            "event.category": ["network", "web"],
            "event.type": ["end", "allowed", "info"],
            "event.extras": { ...extras, response: { data: sampleData } },
            "event.reason": action,
            "event.duration": getDuration(),
          });
        } catch (reason) {
          logger.warn(
            `${action} willSendResponse error: ${reason} ${querySample}`,
            {
              "event.kind": "event",
              "event.category": ["network", "web"],
              "event.type": ["end", "allowed", "info"],
              "event.extras": extras,
              "event.reason": action,
              "event.duration": getDuration(),
            },
          );
        }
      },
    };
  },
});
