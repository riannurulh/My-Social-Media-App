const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const { hashSync } = require("bcryptjs");
const usersJson = require("./users.json");
const postsJson = require("./posts.json");
const uri = process.env.DATABASE_URL;
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

async function run() {
  try {
    const usersCollection = db.collection("User");
    // - delete all user
    await usersCollection.deleteMany({});
    // - hash password
    const userHashPass = usersJson.map((el) => {
      el.password = hashSync(el.password);
      return el;
    });
    // - insert many
    const users = await usersCollection.insertMany(userHashPass);

    // Seeding posts
    const postsCollection = db.collection("Posts");
    // - delete all post
    await postsCollection.deleteMany({});
    // - assign authorId from the first inserted user id
    const postsWithAuthorId = postsJson.map((el) => {
      el.authorId = new ObjectId(users.insertedIds[0]);
      el.createdAt = el.updatedAt = new Date();
      el.comments.map((el) => {
        el.createdAt = el.updatedAt = new Date();
        return el;
      });
      return el;
    });
    await postsCollection.insertMany(postsWithAuthorId);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
