const Redis = require('ioredis')
require("dotenv").config()

const redis = new Redis({
    port: 14503, // Redis port
    host: process.env.REDIS_URL, // Redis host
    username: "default", // needs Redis >= 6
    password: "CRikzpDkrFgrqbUZkqO6mn0jHmG1iCYx",
    db: 0, // Defaults to 0
  });
  module.exports = redis

