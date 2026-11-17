import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";
import { text } from "node:stream/consumers";
import { version as uuidVersion } from "uuid";
import { exportPages } from "next/dist/export/worker";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {

      // first request
      const response = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "daniel.petriu",
            email: "daniel.petriu@gmail.com",
            password: "senha123"
          })
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "daniel.petriu",
        email: "daniel.petriu@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated email", async () => {

      // first request
      const response1 = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "email.duplicado",
            email: "duplicado@email.com",
            password: "senha123"
          })
        },
      );

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "email.duplicado1",
            email: "Duplicado@email.com",
            password: "senha123"
          })
        },
      );

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email informada já existe.",
        action: "informe um email diferente e tente novamente.",
        status_code: 400,
      });
    });

    test("With duplicated username", async () => {

      // first request
      const response1 = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "username.duplicado",
            email: "username1@email.com",
            password: "senha123"
          })
        },
      );

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        `${process.env.LOCALHOST_URL}/api/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "username.duplicado",
            email: "username2@email.com",
            password: "senha123"
          })
        },
      );

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O nome de usuário informado já existe.",
        action: "informe um nome de usuário diferente e tente novamente.",
        status_code: 400,
      });
    });
  });
});
