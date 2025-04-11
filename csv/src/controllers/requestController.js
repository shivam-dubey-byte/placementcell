const { Readable } = require("stream");
const csv = require("csv-parser");
const { insertBulkData } = require("../models/requestModel");

const parseCSVBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });

const uploadPlacementCSV = async (req, res) => {
  try {
    const { year } = req.body;
    if (!req.file || !year) {
      return res.status(400).json({ message: "Missing file or year" });
    }

    const data = await parseCSVBuffer(req.file.buffer);
    const result = await insertBulkData("placement", year, data);

    res.json({ message: "Placement data uploaded", inserted: result.insertedCount });
  } catch (err) {
    console.error("Upload Placement Error:", err);
    res.status(500).json({ message: "Failed to upload placement data" });
  }
};

const uploadStudentCSV = async (req, res) => {
  try {
    const { year } = req.body;
    if (!req.file || !year) {
      return res.status(400).json({ message: "Missing file or year" });
    }

    const data = await parseCSVBuffer(req.file.buffer);
    const result = await insertBulkData("student", year, data);

    res.json({ message: "Student data uploaded", inserted: result.insertedCount });
  } catch (err) {
    console.error("Upload Student Error:", err);
    res.status(500).json({ message: "Failed to upload student data" });
  }
};

module.exports = {
  uploadPlacementCSV,
  uploadStudentCSV,
};
