const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const requestRoutes = require("./routes/requestRoutes");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Mail Server Backend Working');
});
app.use("/api", requestRoutes);

module.exports = app;
