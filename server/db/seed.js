const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://riannurul57:z7pZpD3LXHWl3Vym@rian.jgwik.mongodb.net/?retryWrites=true&w=majority&appName=Rian";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
