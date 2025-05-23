const express = require('express');
const bodyParser = require('body-parser')
const connectDB = require('./connectDB');
const cors = require('cors');
//require('dotenv').config();

const userRoutes = require('./routes/userRoutes.js');

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", // Allow all origins, or specify your frontend's URL: 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
//app.use(cors());
let items = [
  { id: 1, name: 'Users' },
  { id: 2, name: 'user' },
];
app.use('/auth', userRoutes);

app.get('/', (req, res) => {
  res.json(items);
  //res.send('Hello, World!');
});



connectDB();
//app.connectDB();
//connectToDatabase();
module.exports = app;
//srd191104
//ECWKUWWYT2QHPWR1
//sQWpdHYV38rvG8uG
