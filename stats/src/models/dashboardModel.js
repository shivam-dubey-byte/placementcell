const connectDB = require("../connectDB");

const getPlacedStudentCount = async (year) => {
  const db = await connectDB("placement");
  const collection = db.collection(String(year));
  return await collection.countDocuments({ offer: { $in: ["I+P", "P"] } });
};

const getCompanyCount = async (year) => {
  const db = await connectDB("placement");
  const collection = db.collection(String(year));
  const companies = await collection.distinct("company");
  return companies.length;
};

const getOfferStats = async (year) => {
  const db = await connectDB("placement");
  const collection = db.collection(String(year));
  return await collection.aggregate([
    { $group: { _id: "$offer", count: { $sum: 1 } } }
  ]).toArray();
};

const getStudentWorkingStats = async (year) => {
  const db = await connectDB("student");
  const collection = db.collection(String(year));
  return await collection.aggregate([
    { $group: { _id: "$working", count: { $sum: 1 } } }
  ]).toArray();
};

const getTopRecruiters = async (year, limit = 6) => {
  const db = await connectDB("placement");
  const collection = db.collection(String(year));
  return await collection.aggregate([
    { $group: { _id: "$company", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]).toArray();
};

module.exports = {
  getPlacedStudentCount,
  getCompanyCount,
  getOfferStats,
  getStudentWorkingStats,
  getTopRecruiters
};
