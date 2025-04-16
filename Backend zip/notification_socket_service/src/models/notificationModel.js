const connectDB = require("../connectDB");

const getCollection = async (collectionName) => {
  const db = await connectDB("notification");
  return db.collection(collectionName);
};

module.exports = {
  async getAllNotifications(email, collectionName) {
    const collection = await getCollection(collectionName);
    return collection.find({ email,isRead:false }).sort({ createdAt: -1 }).toArray();
  },

  async markNotificationRead(filter, collectionName) {
    console.log(filter);
    console.log(collectionName);
    const collection = await getCollection(collectionName);
    const result = collection.updateMany(
      {email:filter.email},
      { $set: { isRead: true } }
    );
    return result;
  },

  async createNotification(data, collectionName) {
    const collection = await getCollection(collectionName);
    const notification = { ...data, isRead: false, createdAt: new Date() };
    await collection.insertOne(notification);
    return notification;
  }
};
