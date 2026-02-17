import { runner as migrationRunner } from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
      allowedMethods: ["GET", "POST"],
    });
  }

  const isDryRun = request.method === "GET";
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      dryRun: isDryRun,
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
    });

    if (migrations.length > 0) {
      return response.status(201).json(migrations);
    }

    return response.status(200).json(migrations);
  } catch (exception) {
    console.error("error trying to access database: ", exception);
    throw exception;
  } finally {
    await dbClient.end();
  }
}
