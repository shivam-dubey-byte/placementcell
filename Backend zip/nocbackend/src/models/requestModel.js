const connectDB = require("../connectDB");
const { ObjectId } = require('mongodb');

// Add to ActiveRequest
const addToActiveRequest = async (name, email, message, fileUrl, dateTime) => {
    const db = await connectDB("nocdata");
    const collection = db.collection("activerequest");
    return await collection.insertOne({ name, email, message, fileUrl, dateTime });
};

// Add to History
const addToHistory = async (name, email, message, fileUrl, dateTime) => {
    const db = await connectDB("nocdata");
    const collection = db.collection("history");
    return await collection.insertOne({ name, email, message, fileUrl, dateTime });
};

// Fetch Active Requests (paginated)
const fetchFromActiveRequest = async (page = 0, limit = 5) => {
    const db = await connectDB("nocdata");
    const collection = db.collection("activerequest");
    return await collection.find({})
        .skip(page * limit)
        .limit(limit)
        .toArray();
};

// Remove from ActiveRequest by email + dateTime
const removeFromActiveRequest = async (email, dateTime) => {
    const db = await connectDB("nocdata");
    const collection = db.collection("activerequest");
    return await collection.deleteOne({ email, dateTime });
};

// Update history entry with action and timestamp
const actionHistory = async (email, dateTime, action, actionDateTime) => {
    const db = await connectDB("nocdata");
    const collection = db.collection("history");
    return await collection.updateOne(
        { email, dateTime },
        { $set: { action, actionDateTime } }
    );
};

// Fetch History (paginated)
const fetchFromHistory = async (email, page = 0, limit = 5) => {
    const db = await connectDB("nocdata");
    const collection = db.collection("history");
    return await collection.find({ email })
        .skip(page * limit)
        .limit(limit)
        .toArray();
};

// Request Counters
const increaseRequestData = async () => {
    const db = await connectDB("nocdata");
    const collection = db.collection("requestdata");
    await collection.updateOne({}, { $setOnInsert: { ActiveRequest: 0, History: 0 } }, { upsert: true });
    await collection.updateMany({}, { $inc: { ActiveRequest: 1, History: 1 } });
};

const decreaseActiveRequest = async () => {
    const db = await connectDB("nocdata");
    const collection = db.collection("requestdata");
    await collection.updateMany({}, { $inc: { ActiveRequest: -1 } });
};

module.exports = {
    addToActiveRequest,
    fetchFromActiveRequest,
    removeFromActiveRequest,
    addToHistory,
    fetchFromHistory,
    increaseRequestData,
    decreaseActiveRequest,
    actionHistory
};
