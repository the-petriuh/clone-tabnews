import path from "node:path";
import database from "infra/database.js";
import { ValidationError } from "infra/errors";

async function create(userInputData) {
  await validateUsername(userInputData.username);
  await validateUserEmail(userInputData.email);

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
  };

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
  };

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
      values: [userInputData.username, userInputData.email, userInputData.password],
    });
    
    return result.rows[0];
  }
}

const user = {
  create,
}

export default user;
