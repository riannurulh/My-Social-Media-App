const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()

const uri = process.env.DATABASE_URL
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = "Line";
const db = client.db(dbName);

module.exports = {
    db
}