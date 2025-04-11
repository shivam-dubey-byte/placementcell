const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./connectDB");

const requestRoutes = require("./routes/requestRoutes");
const path = require("path");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get('/', (req, res) => {
  //res.json(items);
  res.send('Request Backend Working');
});
app.use("/api", requestRoutes);

connectDB();
//https://docs.google.com/forms/d/e/1FAIpQLSdfkgQU261P8_KezoMyQw_xBctCQfr5sp4S-TmPB26eBK99CQ/
module.exports = app;
