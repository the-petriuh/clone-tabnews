import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("PATCH api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Should return 405 ", async () => {
      // first request
      const response = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/migrations`,
        {
          method: "PATCH",
        },
      );
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action: "Verifique o método correto para este endpoint.",
        status_code: 405,
      });
    });
  });
});
