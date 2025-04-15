const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://tpcmuj:2tL4m1gjQ8qcBRre@mujtcpusers.ir4p3.mongodb.net/"; // <-- Replace with actual MongoDB URI

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
