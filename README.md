# Apollo server Express GraphQL API example

> Provides a working API to expand from for initial development

## GraphQL Playground

Once server is running (`npm run-script dev:watch`)
You may load and interact with data through the
[playground](http://localhost:5000/api/graphql).

## Testing

Integration tests are run using [Jest](https://jestjs.io/) to create an
instance of the API on a random port using Node. Testing supplies
its own user context.

Jest can use a local `.env` file for process environment variables.
