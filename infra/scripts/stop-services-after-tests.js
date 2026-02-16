const { execSync } = require("child_process");

try {
  console.log("🚀 Iniciando script de testes...");
  execSync("npm run test:run", { stdio: "inherit" });
} catch (error) {
  console.error("❌ O script principal falhou. ", error);
  process.exitCode = 1;
} finally {
  console.log("🧹 Executando tarefa obrigatória (Post)...");
  execSync("npm run services:stop", { stdio: "inherit" });
}
