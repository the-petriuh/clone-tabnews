import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;

  const postgresVersionResult = await database.query("SHOW server_version;");
  const postgresVersion = postgresVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsResult.rows[0].max_connections;

  const usedConnectionsQuery = {
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  };
  const usedConnectionsResult = await database.query(usedConnectionsQuery);
  const usedConnections = usedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: usedConnections,
      },
    },
  });
}

export default status;
