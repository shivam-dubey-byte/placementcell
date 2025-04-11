const connectDB = require("../connectDB");

const insertBulkData = async (dbName, collectionName, data) => {
  const client = await connectDB();
  const db = client.db(dbName); // ✅ NOW get the actual database
  const collection = db.collection(collectionName);

  const result = await collection.insertMany(data);
  return result;
};


module.exports = {
  insertBulkData,
};
