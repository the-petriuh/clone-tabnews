import retry from "async-retry";

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
        throw error;
      }
    }
  }
}

export default {
  waitForAllServices,
};
