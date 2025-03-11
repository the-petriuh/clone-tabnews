import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("DELETE to api/v1/migrations should return 200", async () => {
  // first request
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  expect(response1.status).toBe(405);
});
