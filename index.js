const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/kisiiuniversecity')
    .then(() => console.log("Connected to the MongoDB"))
    .catch(err => console.error('Connection to the MongoDB falied', err));

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));