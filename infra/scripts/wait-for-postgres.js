import { exec } from "node:child_process";

let count = 0;
const clock = [
  "🕛",
  "🕐",
  "🕑",
  "🕓",
  "🕔",
  "🕕",
  "🕖",
  "🕗",
  "🕘",
  "🕙",
  "🕚",
];

function chechPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", (error) => {
    if (error) {
      process.stdout.write(
        `\r${clock[count % clock.length]} Aguardando o postgres aceitar conexões`,
      );

      count++;
      setTimeout(chechPostgres, 250);
      return;
    }

    process.stdout.write("\r🟢 Postgres está pronto e aceitando conexões");
  });
}

chechPostgres();
