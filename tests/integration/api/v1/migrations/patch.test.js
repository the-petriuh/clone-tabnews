import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

describe("PATCH api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Should return 405 ", async () => {
      // first request
      const response1 = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/migrations`,
        {
          method: "PATCH",
        },
      );
      expect(response1.status).toBe(405);
    });
  });
});
