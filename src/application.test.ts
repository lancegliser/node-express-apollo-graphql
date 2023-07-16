import { withRequestContext } from "../tests/utilities";

describe("application", () => {
  it("should return resolver context for testing", async () => {
    await withRequestContext(async (context) => {
      expect(context.systemContext).toBeTruthy();
      expect(context.application).toBeTruthy();
      expect(context.credentials).toBeTruthy();
    });
  });
});
