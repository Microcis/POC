const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();
const redisClient = redis.createClient();
redisClient.on("error", (err) => new Error("Redis Client Error"));
redisClient.connect();

module.exports = {
  redisClient,
};
