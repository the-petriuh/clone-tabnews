import migrationRunner from "node-pg-migrate";
import path from "node:path";
import database from "infra/database.js";
import { error } from "node:console";

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
      dir: path.join("infra", "migrations"),
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
    throw exception;
  } finally {
    await dbClient.end();
  }
}
