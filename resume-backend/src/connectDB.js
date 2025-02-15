const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://mujtcp:ww9G5509iOrd5FWm@cluster0.zwbz3.mongodb.net/user";//"mongodb+srv://s1r9d11:iP6QSedJjLkmqT9y@edtech.kzpkk.mongodb.net/user?retryWrites=true&w=majority&appName=EdTech&tls=true";

const connectDB = async () => {
  try { //process.env.MONGO_URI
    const client = new MongoClient(uri,{
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
              //{ useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db("user");  // Return the database instance
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the application if connection fails
  }
};


module.exports = connectDB;
/*
const connectDB = async () => {
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

};*/
//connectDB();
