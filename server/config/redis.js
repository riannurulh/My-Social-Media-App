const Redis = require('ioredis')

const redis = new Redis({
    port: 14503, // Redis port
    host: "redis-14503.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com", // Redis host
    username: "default", // needs Redis >= 6
    password: "CRikzpDkrFgrqbUZkqO6mn0jHmG1iCYx",
    db: 0, // Defaults to 0
  });
  module.exports = redis

