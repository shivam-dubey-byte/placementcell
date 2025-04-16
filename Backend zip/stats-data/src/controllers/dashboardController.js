const connectDB = require("../connectDB");


// New: Student Filter Detail View
const getStudentFilter = async (req, res) => {
  const { year, working } = req.body;

  if (!year || !working) {
    return res.status(400).json({ message: "Year and working status are required" });
  }

  // Normalize working input: make "placed" -> "Placed", "not placed" -> "Not Placed"
  const normalizeWorking = (status) => {
    return status
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const normalizedWorking = normalizeWorking(working); // e.g., "placed" → "Placed"

  try {
    const db = await connectDB("student");
    const collection = db.collection(`${year}`);
    const students = await collection.find({ working: normalizedWorking }).toArray();
    res.json({ students });
  } catch (err) {
    console.error("Student Filter Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔍 Offer Filter (for OfferDetailsPage)
const getOfferFilter = async (req, res) => {
  const { year, offer } = req.body;

  if (!year || !offer) {
    return res.status(400).json({ message: "Year and offer type are required" });
  }

  // Capitalize first letter of offer and preserve "+P" if present
  const normalizeOffer = (offer) => {
    if (typeof offer !== "string") return offer;

    return offer
      .split("+")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("+");
  };

  const normalizedOffer = normalizeOffer(offer);  // e.g. "i+p" → "I+P"

  try {
    const db = await connectDB("placement");
    const collection = db.collection(`${year}`);
    const results = await collection.find({ offer: normalizedOffer }).toArray();
    res.json({ results });
  } catch (err) {
    console.error("Offer Filter Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔍 Placement Filter (used for recruiter, company, trend pages)
const getPlacementFilter = async (req, res) => {
  const { year, filter } = req.body;

  if (!year || typeof filter !== "object") {
    return res.status(400).json({ message: "Year and filter are required." });
  }

  try {
    const db = await connectDB("placement");
    const collection = db.collection(`${year}`);
    const results = await collection.find(filter).toArray();
    res.json({ results });
  } catch (err) {
    console.error("Placement Filter Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPlacementTrendFilter = async (req, res) => {
  const { year, offer } = req.body;

  if (!year || !offer) {
    return res.status(400).json({ message: "Year and offer condition required" });
  }

  try {
    const db = await connectDB("placement");
    const collection = db.collection(`${year}`);
    const students = await collection.find({ offer }).toArray();
    res.json({ students });
  } catch (err) {
    console.error("Placement Trend Filter Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔍 Company-wise student count for a given year
const getCompaniesFilter = async (req, res) => {
  const { year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Year is required." });
  }

  try {
    const db = await connectDB("placement");
    const collection = db.collection(`${year}`);

    const aggregation = await collection.aggregate([
      { $match: { company: { $exists: true, $ne: "" } } },
      { $group: { _id: "$company", students: { $sum: 1 } } },
      { $sort: { students: -1 } }
    ]).toArray();

    const results = aggregation.map(entry => ({
      company: entry._id,
      students: entry.students
    }));

    res.json({ results });
  } catch (err) {
    console.error("Company Filter Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Export all
module.exports = {
  getStudentFilter,
  getOfferFilter,
  getPlacementFilter,
  getPlacementTrendFilter,
  getCompaniesFilter
};
