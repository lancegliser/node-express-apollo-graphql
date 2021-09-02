import { withResolverContext } from "../tests/graphql.utils";

describe("application", () => {
  it("should return resolver context for testing", async () => {
    await withResolverContext(async (context) => {
      expect(context.authorization).toBeTruthy();
      expect(context.application).toBeTruthy();
      expect(context.context).toBeTruthy();
    });
  });
});
