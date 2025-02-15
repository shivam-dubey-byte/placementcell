const express = require('express');
const bodyParser = require('body-parser')

const cors = require("cors");
const connectDB = require("./connectDB");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(bodyParser.json());

app.use(express.json());
app.use(cors({
  origin: "*", // Allow all origins, or specify your frontend's URL: 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 


let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

connectDB();

app.get('/', (req, res) => {
  res.json(items); // Return the list of items
});





// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/resume", resumeRoutes);


module.exports = app;
