const { MongoClient } = require("mongodb");
const connectDB = require("../connectDB");




//Find UserResume By Email
const findUserResumeByEmail = async (email) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("UserResume");
    const user = await collection.findOne({email});
    return user ? user.resume || null : null; // Return null if user doesn't exist or has no resume
};


const updateUserResume = async (email, fileUrl) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("UserResume");

    const result = await collection.updateOne(
        { email },
        { $set: { resume: fileUrl } }, // Update resume field
        { upsert: true } // Insert new record if email not found
    );

    return result;
};

// Add data to ActiveRequest
const addToActiveRequest = async (email, message, noc = "0", lor = "0", fileUrl) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("Activerequest");
    const result = await collection.insertOne({ email, message, noc, lor, fileUrl });
    return result;
};

// Fetch data from ActiveRequest with pagination
const fetchFromActiveRequest = async (email, page = 0, limit = 5) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("Activerequest");
    const data = await collection.find({ email })
                                 .skip(page * limit)
                                 .limit(limit)
                                 .toArray();
    return data;
};

// Remove data from ActiveRequest based on email and LOR or NOC
const removeFromActiveRequest = async (email, field) => {
    const db = await connectDB("RequestData");
    const collection = db.collection("Activerequest");
    const result = await collection.deleteOne({ email, [field]: { $ne: "NUL" } });
    return result;
};

// Add data to History
const addToHistory = async (email, message, noc = "NULL", lor = "NULL", time) => {
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
    fetchFromHistory,
    findUserResumeByEmail,
    updateUserResume
};
