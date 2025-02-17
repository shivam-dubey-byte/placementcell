const { MongoClient } = require("mongodb");
const connectDB = require("../connectDB");

// Add data to ActiveRequest
const addToActiveRequest = async (email, message, noc = "NUL", lor = "NUL", time) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("ActiveRequest");
    const result = await collection.insertOne({ email, message, noc, lor, time });
    return result;
};

// Fetch data from ActiveRequest with pagination
const fetchFromActiveRequest = async (email, page = 0, limit = 5) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("ActiveRequest");
    const data = await collection.find({ email })
                                 .skip(page * limit)
                                 .limit(limit)
                                 .toArray();
    return data;
};

// Remove data from ActiveRequest based on email and LOR or NOC
const removeFromActiveRequest = async (email, field) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("ActiveRequest");
    const result = await collection.deleteOne({ email, [field]: { $ne: "NUL" } });
    return result;
};

// Add data to History
const addToHistory = async (email, message, noc = "NUL", lor = "NUL", time) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("History");
    const result = await collection.insertOne({ email, message, noc, lor, time });
    return result;
};

// Fetch data from History based on email with pagination
const fetchFromHistory = async (email, page = 0, limit = 5) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("History");
    const data = await collection.find({ email })
                                 .skip(page * limit)
                                 .limit(limit)
                                 .toArray();
    return data;
};

module.exports = {
    addToActiveRequest,
    fetchFromActiveRequest,
    removeFromActiveRequest,
    addToHistory,
    fetchFromHistory
};
