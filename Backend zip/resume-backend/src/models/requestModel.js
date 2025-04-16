const { MongoClient } = require("mongodb");
const connectDB = require("../connectDB");




//Find UserResume By Email
const findUserResumeByEmail = async (email) => {
    const db = await connectDB("user");
    const collection = db.collection("resume");
    const user = await collection.findOne({email});
    return user ? user.resume || null : null; // Return null if user doesn't exist or has no resume
};

//Update + Add UserResume By Email
const updateUserResume = async (email, fileUrl) => {
    const db = await connectDB("user");
    const collection = db.collection("resume");

    const result = await collection.updateOne(
        { email },
        { $set: { resume: fileUrl } }, // Update resume field
        { upsert: true } // Insert new record if email not found
    );

    return result;
};


module.exports = {
    findUserResumeByEmail,
    updateUserResume
};
