const { exec } = require("node:child_process");

function chechPostgres() {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (error, stdout) => {
      if (error) {
        process.stdout.write(".");
        return setTimeout(chechPostgres, 1000);
      }

      console.log("\n🟢 Postgres está pronto\n");
    },
  );
}

process.stdout.write("\n\n🔴 Aguardando o postgres aceitar conexões");
chechPostgres();
