import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(
      async () => {
        const response = await fetch(
          `${process.env.LOCALHOST_URL}/api/v1/status`,
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
      },
      { retries: 100 },
    );
  }
}

export default {
  waitForAllServices,
};
