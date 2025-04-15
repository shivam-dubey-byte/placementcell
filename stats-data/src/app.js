const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", dashboardRoutes);

module.exports = app;