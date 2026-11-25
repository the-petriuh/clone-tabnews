import path from "node:path";
import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors";
import password from 'models/password';

async function findOneByUsername(username) {
  const user = await runSelectQuery(username);

  return user;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O username encontrado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }

    return result.rows[0];
  }
}

async function create(userInputData) {
  await validateUsername(userInputData.username);
  await validateUserEmail(userInputData.email);
  await hashPasswordInObject(userInputData);

  return await runInsertQuery(userInputData);

  async function validateUsername(username) {
    const result = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          username = $1
        ;`,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O nome de usuário informado já existe.",
        action: "informe um nome de usuário diferente e tente novamente.",
      });
    }
  }

  async function validateUserEmail(email) {
    const result = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O email informada já existe.",
        action: "informe um email diferente e tente novamente.",
      });
    }
  }

  async function hashPasswordInObject(userInputData) {
    const hashedPassword = await password.hash(userInputData.password);
    userInputData.password = hashedPassword;
  }

  async function runInsertQuery(userInputData) {
    const result = await database.query({
      text: `
        INSERT INTO
          users (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [
        userInputData.username,
        userInputData.email,
        userInputData.password,
      ],
    });

    return result.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
