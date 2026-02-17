import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("DELETE api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Should return 405", async () => {
      // first request
      const response1 = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/migrations`,
        {
          method: "DELETE",
        },
      );
      expect(response1.status).toBe(405);
    });
  });
});
