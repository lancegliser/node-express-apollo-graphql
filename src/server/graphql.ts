import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { GraphQLError } from "graphql";

export const handleSerializationErrors = (
  error: GraphQLError
): GraphQLError => {
  // Prevent circle serialization references
  // https://dev.azure.com/TorchResearchLLC/Overwatch/_workitems/edit/1892/
  // @ts-expect-error originalError isn't exposed in types
  if (error?.originalError?.response) {
    // @ts-expect-error originalError isn't exposed in types
    delete error.originalError.response;
  }

  if (error.extensions?.exception.response) {
    delete error.extensions?.exception.response;
  }
  return error;
};

export const LoggingPlugin: ApolloServerPlugin = {
  // Fires when the server prepares to start
  serverWillStart: async (service) => {
    service.logger.debug("Starting GraphQL server");
  },
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart: async (requestContext) => {
    // Avoid logging introspection queries
    if (!isIntrospectionQuery(requestContext.request.query)) {
      requestContext.logger.debug("GraphQL:\n" + requestContext.request.query);
    }

    return {
      didEncounterErrors: async (requestContext) => {
        // Authentication errors are already excluded from these errors
        requestContext.logger.error(requestContext.errors);
      },
    };
  },
};

export const isIntrospectionQuery = (query: string | undefined): boolean =>
  !!query?.match("query IntrospectionQuery");
