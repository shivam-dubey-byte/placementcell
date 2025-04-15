const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//const requestRoutes = require("./routes/requestRoutes");
const mailRoutes = require("./routes/mailRoutes");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Mail Server Backend Working');
});

//app.use("/api", requestRoutes);
app.use("/api", mailRoutes);

module.exports = app;
