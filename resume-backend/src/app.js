const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./connectDB");
const path = require("path");

const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api", resumeRoutes);

connectDB();
//https://docs.google.com/forms/d/e/1FAIpQLSdfkgQU261P8_KezoMyQw_xBctCQfr5sp4S-TmPB26eBK99CQ/
module.exports = app;
