const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://tpcmuj:2tL4m1gjQ8qcBRre@mujtcpusers.ir4p3.mongodb.net/";
//"mongodb+srv://mujtcp:ww9G5509iOrd5FWm@cluster0.zwbz3.mongodb.net/"
//mongodb+srv://tpcmuj:2tL4m1gjQ8qcBRre@mujtcpusers.ir4p3.mongodb.net/?retryWrites=true&w=majority&appName=MUJTCPUSERS

let client;
const connectDB = async (dbName) => {
  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      await client.connect();
      console.log("Connected to MongoDB Atlas");
    }
    return client; // Only return client, not db yet
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the application if connection fails
  }
};

module.exports = connectDB;
