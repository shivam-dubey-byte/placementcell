const connectDB = require("../connectDB");

const startYear = 2020;
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

const getPlacementTrends = async (req, res) => {
  try {
    const trends = [];

    for (const year of YEARS) {
      const studentDB = await connectDB("student");
      const placementDB = await connectDB("placement");

      const studentCollection = studentDB.collection(String(year));
      const placementCollection = placementDB.collection(String(year));

      // Count only students who participated in placement (exclude NA and Higher Studies)
      const eligibleStudents = await studentCollection.countDocuments({
        working: { $nin: ["NA", "", "Higher Studies"] }
      });

      const totalPlaced = await placementCollection.countDocuments({
        offer: { $in: ["I+P", "P"] }
      });

      const totalCompanies = await placementCollection.distinct("company");

      const percentagePlaced = eligibleStudents === 0
        ? 0
        : Math.round((totalPlaced / eligibleStudents) * 100);

      trends.push({
        year,
        percentagePlaced,
        companiesVisited: totalCompanies.length
      });
    }

    res.json({ trends });
  } catch (err) {
    console.error("Error in getPlacementTrends:", err);
    res.status(500).json({ message: "Error fetching placement trends" });
  }
};

const getCurrentYearStats = async (req, res) => {
  const year = req.query.year;

  if (!year) {
    return res.status(400).json({ message: "Missing 'year' query parameter" });
  }

  try {
    const studentDB = await connectDB("student");
    const placementDB = await connectDB("placement");

    const studentCollection = studentDB.collection(year);
    const placementCollection = placementDB.collection(year);

    const studentDistribution = await studentCollection.aggregate([
      { $group: { _id: "$working", count: { $sum: 1 } } }
    ]).toArray();

    const offerTypes = await placementCollection.aggregate([
      { $group: { _id: "$offer", count: { $sum: 1 } } }
    ]).toArray();

    const topRecruiters = await placementCollection.aggregate([
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]).toArray();

    res.json({
      studentDistribution,
      offerTypes,
      topRecruiters
    });
  } catch (err) {
    console.error("Error in getCurrentYearStats:", err);
    res.status(500).json({ message: "Error fetching current year stats" });
  }
};

const getOffersVsPlacements = async (req, res) => {
  try {
    const data = [];

    for (const year of YEARS) {
      const placementDB = await connectDB("placement");
      const placementCollection = placementDB.collection(String(year));

      const totalOffers = await placementCollection.countDocuments();
      const totalPlaced = await placementCollection.countDocuments({
        offer: { $in: ["P", "I+P"] }
      });

      data.push({
        year,
        offers: totalOffers,
        placed: totalPlaced
      });
    }

    res.json({ stats: data });
  } catch (err) {
    console.error("Error in getOffersVsPlacements:", err);
    res.status(500).json({ message: "Error fetching offers vs placements" });
  }
};


module.exports = {
  getPlacementTrends,
  getCurrentYearStats,
  getOffersVsPlacements
};
