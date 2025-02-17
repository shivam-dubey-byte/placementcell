const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./connectDB");

const resumeRoutes = require("./routes/routes");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];
app.get('/', (req, res) => {
  //res.json(items);
  res.send('Request Backend Working');
});
//app.use("/api", routes);

//connectDB();
//https://docs.google.com/forms/d/e/1FAIpQLSdfkgQU261P8_KezoMyQw_xBctCQfr5sp4S-TmPB26eBK99CQ/
module.exports = app;
