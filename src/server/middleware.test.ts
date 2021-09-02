import supertest from "supertest";
import { HEALTH_CHECK_URL, ROOT_URI } from "../constants";
import { withResolverContext } from "../../tests/graphql.utils";

describe("middleware", () => {
  it("should provide access-control-allow-origin * header", async () => {
    await withResolverContext(async ({ application }) => {
      const res = await supertest(application).get(ROOT_URI);
      expect(res.header["access-control-allow-origin"]).toBe("*");
    });
  });

  it("should respond to health check with uptime", async () => {
    await withResolverContext(async ({ application }) => {
      const res = await supertest(application).get(HEALTH_CHECK_URL);
      expect(res.status).toBe(200);
      expect(res.body.uptime).toBeGreaterThan(0);
    });
  });

  // it("should parse body json", async () => {
  //   await withResolverContext(async ({ application }) => {
  //     const value = Math.random();
  //     const res = await supertest(application)
  //       .post(ROOT_URI + requestInfoUri)
  //       .send({ value });
  //     expect(res.status).toBe(200);
  //     expect(res.body.method).toBe("POST");
  //     expect(res.body.uri).toBe(requestInfoUri);
  //     expect(res.body.headers).toBeTruthy();
  //     expect(res.body.body.value).toBe(value);
  //   });
  // });

  describe("error handling", () => {
    // it("should include status, message, and stack for client errors", async () => {
    //   await withResolverContext(async ({ application }) => {
    //     const res = await supertest(application).get(ROOT_URI + clientErrorUri);
    //     expect(res.status).toBe(406);
    //     expect(res.error).toBeTruthy();
    //     if (res.error) {
    //       expect(res.error.message).toBeTruthy();
    //     }
    //     expect(res.body.error).toMatch(/Client error/i);
    //     expect(res.body.stack).toBeTruthy();
    //   });
    // });
    // it("should include status, message, and stack for server errors", async () => {
    //   await withResolverContext(async ({ application }) => {
    //     const res = await supertest(application).get(ROOT_URI + serverErrorUri);
    //     expect(res.status).toBe(502);
    //     expect(res.error).toBeTruthy();
    //     if (res.error) {
    //       expect(res.error.message).toBeTruthy();
    //     }
    //     expect(res.body.error).toMatch(/Server error/i);
    //     expect(res.body.stack).toBeTruthy();
    //   });
    // });
  });

  describe("transactionId", () => {
    // it("should generate a new transactionId if required", async () => {
    //   await withResolverContext(async ({ application }) => {
    //     const res = await supertest(application)
    //       .post(ROOT_URI + requestInfoUri)
    //       .send();
    //     expect(res.body.transactionId).toBeTruthy();
    //   });
    // });
    // it("should reuse the transactionId if present", async () => {
    //   await withResolverContext(async ({ application }) => {
    //     const transactionId = v4();
    //     const res = await supertest(application)
    //       .post(ROOT_URI + requestInfoUri)
    //       .set(transactionIdHeader, transactionId)
    //       .send();
    //     expect(res.body.transactionId).toBe(transactionId);
    //   });
    // });
  });
});
