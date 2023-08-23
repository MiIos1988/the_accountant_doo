require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const domain = process.env.ACTUAL_DOMAIN;
const portNumber = process.env.PORT;
const app = express();


mongoose.connect(process.env.MONGO_DB_URL)
    .then((data) => {
        console.log('Mongo DB is connected...')
    })
    .catch((err) => {
        console.log(err);
        console.log('Error while connecting to Mongo DB...')
    });

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);




app.listen(portNumber, (err) => {
    err
        ? console.log("Error on server start...")
        : console.log(`Server is running on port ${portNumber}...`)
});


