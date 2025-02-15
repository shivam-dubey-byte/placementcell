const { MongoClient } = require("mongodb");
const connectDB = require("../connectDB");

// Upload Resume Data
const uploadResumeData = async (email, resume) => {
  const db = await connectDB("userdata");
  const collection = db.collection("resume");
  const add = { email, resume };
  const result = await collection.insertOne(add);
  return result;
};

// Find User's Resume
const findUserResume = async (email) => {
  const db = await connectDB("userdata");
  const collection = db.collection("resume");
  const user = await collection.findOne({ email });
  return user;
};

// Update Resume
const updateResume = async (email, resume) => {
  const db = await connectDB("userdata");
  const collection = db.collection("resume");
  const result = await collection.updateOne({ email }, { $set: { resume } });
  return result;
};

module.exports = { uploadResumeData, findUserResume, updateResume };