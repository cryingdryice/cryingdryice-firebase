const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");

exports.githubApi = onRequest(
  { cors: true }, // CORS 설정을 true로 하거나 제거 가능
  async (request, response) => {
    try {
      const { endpoint, method, tokenType } = request.body;
      logger.info("Received request:", { endpoint, method, tokenType });

      const token = tokenType === "write"
        ? process.env.GITHUB_WRITE_TOKEN
        : process.env.GITHUB_READ_TOKEN;

      if (!token) {
        throw new Error("Token not found");
      }

      const githubApiUrl = `https://api.github.com/repos/cryingdryice/cryingdryice.github.io${endpoint}`;
      logger.info("Calling GitHub API at:", githubApiUrl);

      const result = await axios({
        url: githubApiUrl,
        method: method,
        headers: {
          Authorization: `token ${token}`,
        },
      });

      response.json(result.data);
    } catch (error) {
      logger.error("Error calling GitHub API:", error.message);
      response.status(500).send("Failed to fetch data from GitHub");
    }
  }
);
