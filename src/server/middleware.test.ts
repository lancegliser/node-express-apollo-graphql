import supertest from "supertest";
import { healthCheckUri, rootUri } from "../constants";
import { withRequestContext } from "../../tests/utilities";

describe("middleware", () => {
  it("should provide access-control-allow-origin * header", async () => {
    await withRequestContext(async ({ application }) => {
      const res = await supertest(application).get(rootUri);
      expect(res.header["access-control-allow-origin"]).toBe("*");
    });
  });

  it("should respond to health check with uptime", async () => {
    await withRequestContext(async ({ application }) => {
      const res = await supertest(application).get(healthCheckUri);
      expect(res.status).toBe(200);
      expect(res.body.uptime).toBeGreaterThan(0);
    });
  });

  // it("should parse body json", async () => {
  //   await withRequestContext(async ({ application }) => {
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
    //   await withRequestContext(async ({ application }) => {
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
    //   await withRequestContext(async ({ application }) => {
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
});
