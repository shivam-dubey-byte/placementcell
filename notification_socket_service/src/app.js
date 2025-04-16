const express = require("express");
const connectDB = require("./connectDB");
const cors = require("cors");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

module.exports = app;
