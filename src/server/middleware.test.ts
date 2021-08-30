import supertest from "supertest";
import { HEALTH_CHECK_URL, ROOT_URI } from "../constants";
import { v4 } from "uuid";
import { transactionIdHeader } from "./middleware";
import { withResolverContext } from "../../tests/graphql.utils";

describe("middleware", () => {
  it("should provide access-control-allow-origin * header", async (done) => {
    await withResolverContext(async ({ application }) => {
      const res = await supertest(application).get(ROOT_URI);
      expect(res.header["access-control-allow-origin"]).toBe("*");
      done();
    });
  });

  it("should respond to health check with uptime", async (done) => {
    await withResolverContext(async ({ application }) => {
      const res = await supertest(application).get(HEALTH_CHECK_URL);
      expect(res.status).toBe(200);
      expect(res.body.uptime).toBeGreaterThan(0);
      done();
    });
  });

  it("should parse body json", async (done) => {
    await withResolverContext(async ({ application }) => {
      const value = Math.random();
      const res = await supertest(application)
        .post(ROOT_URI + requestInfoUri)
        .send({ value });
      expect(res.status).toBe(200);
      expect(res.body.method).toBe("POST");
      expect(res.body.uri).toBe(requestInfoUri);
      expect(res.body.headers).toBeTruthy();
      expect(res.body.body.value).toBe(value);
      done();
    });
  });

  describe("error handling", () => {
    it("should include status, message, and stack for client errors", async (done) => {
      await withResolverContext(async ({ application }) => {
        const res = await supertest(application).get(ROOT_URI + clientErrorUri);
        expect(res.status).toBe(406);
        expect(res.error).toBeTruthy();
        if (res.error) {
          expect(res.error.message).toBeTruthy();
        }
        expect(res.body.error).toMatch(/Client error/i);
        expect(res.body.stack).toBeTruthy();
        done();
      });
    });

    it("should include status, message, and stack for server errors", async (done) => {
      await withResolverContext(async ({ application }) => {
        const res = await supertest(application).get(ROOT_URI + serverErrorUri);
        expect(res.status).toBe(502);
        expect(res.error).toBeTruthy();
        if (res.error) {
          expect(res.error.message).toBeTruthy();
        }
        expect(res.body.error).toMatch(/Server error/i);
        expect(res.body.stack).toBeTruthy();
        done();
      });
    });
  });

  describe("transactionId", () => {
    it("should generate a new transactionId if required", async (done) => {
      await withResolverContext(async ({ application }) => {
        const res = await supertest(application)
          .post(ROOT_URI + requestInfoUri)
          .send();
        expect(res.body.transactionId).toBeTruthy();
        done();
      });
    });

    it("should reuse the transactionId if present", async (done) => {
      await withResolverContext(async ({ application }) => {
        const transactionId = v4();
        const res = await supertest(application)
          .post(ROOT_URI + requestInfoUri)
          .set(transactionIdHeader, transactionId)
          .send();
        expect(res.body.transactionId).toBe(transactionId);
        done();
      });
    });
  });
});
