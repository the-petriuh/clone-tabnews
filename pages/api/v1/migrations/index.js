import migrationRunner from "node-pg-migrate";
import path from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).end();
  }

  const isDryRun = request.method === "GET";

  console.log("database url", process.env.DATABASE_URL);

  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dir: path.join("infra", "migrations"),
    dryRun: isDryRun,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const migrations = await migrationRunner({
    ...defaultMigrationOptions,
  });

  await dbClient.end();

  if (migrations.length > 0) {
    return response.status(201).json(migrations);
  }

  return response.status(200).json(migrations);
}
