const connectDB = require("../connectDB");

const insertOrUpdateBulkData = async (dbName, collectionName, data) => {
  const client = await connectDB();
  const db = client.db(dbName); // ✅ NOW get the actual database
  const collection = db.collection(collectionName);

  const bulkOps = data.map((doc) => {
    const normalizedDoc = {};
    for (const key in doc) {
      // Normalize key to lowercase and trim key & value
      normalizedDoc[key.trim().toLowerCase()] = doc[key]?.trim?.();
    }

    return {
      updateOne: {
        filter: { registration: normalizedDoc.registration },
        update: { $set: normalizedDoc },
        upsert: true,
      },
    };
  }); 

  const result = await collection.bulkWrite(bulkOps);
  return result;
};


module.exports = {
  insertOrUpdateBulkData,
};
