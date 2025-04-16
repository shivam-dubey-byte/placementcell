const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://mujtcp:ww9G5509iOrd5FWm@cluster0.zwbz3.mongodb.net/"; // <-- Replace with actual MongoDB URI

let client;
let isConnected = false;

const connectDB = async (dbName) => {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
  }

  return client.db(dbName);
};

module.exports = connectDB;
