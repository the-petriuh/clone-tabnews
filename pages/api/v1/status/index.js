import database from "/infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1;");
  console.log(result);
  response.status(200).send("testando API no next JS");
}

export default status;
