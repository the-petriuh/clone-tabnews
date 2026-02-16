import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to api/v1/status should return 200", async () => {
  const response = await fetch(`${process.env.LOCALHOST_URL}/api/v1/status`);
  expect(response.status).toBe(200);
  const responseBody = await response.json();
  console.log(responseBody);

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toBeDefined();

  const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBe(parsedUpdateAt);

  expect(responseBody.dependencies.database.version).toEqual("17.3");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
