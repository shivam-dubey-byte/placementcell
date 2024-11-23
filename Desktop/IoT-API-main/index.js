const { timeStamp } = require('console');
const express = require('express');
const { Timestamp } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/',()=>{
    res.send('Working');
});

app.post('/api/data',(req,res)=>{
    const data = {
        message: "Hello from the API!",
        timeStamp: new Date().toISOString()
    };
    res.json(data);
});
app.post('api/gps',(req,res)=>{
    const { longitude, latitude } = req.body; // Destructure data from req.body
    console.log(`Longitude: ${longitude}, Latitude: ${latitude}`);
    res.send({ status: 'Success', received: { longitude, latitude } });
});
app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});

module.exports = app;
