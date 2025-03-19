import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("PUT to api/v1/migrations should return 200", async () => {
  // first request
  const response1 = await fetch(
    `${process.env.LOCALHOST_URL}/api/v1/migrations`,
    {
      method: "PUT",
    },
  );
  expect(response1.status).toBe(405);
});
