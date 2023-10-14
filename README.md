# Netflix Apollo Server

> Provides a GraphQL interface for shallow content suggestions with details on demand.

## Upstream

```bash
git remote add upstream git@github.com:lancegliser/node-express-apollo-graphql.git
```

## GraphQL Playground

Once server is running (`npm run-script dev:watch`)
You may load and interact with data through the
[playground](http://localhost:5000/api/graphql).

## Code generation and work flow

This API works from a GraphQL first approach.
Each component you wish to write starts with a `.graphql` file.
The types in it will cause typescript code to be generated
by running the following command:

```
npm run graphql-codegen
```

The generated classes are created at:

```
src/generated/types.ts
```

You can import those types in your own resolver,
providing you strong contracts and stub implementations.

## Testing

Integration tests are run using [Jest](https://jestjs.io/) to create an
instance of the API on a random port using Node. Testing supplies
its own user context.

Jest can use a local `.env` file for process environment variables.
