import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
      onRetry: (error, attempt) => {
        console.log(
          `Attempt ${attempt} - Failed to fetch status page: ${error.message}`,
        );
      },
    });

    async function fetchStatusPage() {
      try {
        const response = await fetch(
          `${process.env.LOCALHOST_URL}/api/v1/status`,
        );
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }
      } catch (error) {
        console.log("error trying to fetch: ", error);
        throw error;
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

export default {
  waitForAllServices,
  clearDatabase,
};
