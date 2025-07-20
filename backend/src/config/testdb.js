
const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const app = express();

module.exports = async function testDbConnection() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('Error: MONGO_URI environment variable not set');
        process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            app.listen(3000, () => console.log('Mongoose run successfully'));
        })
        .catch(err => {
            console.error('Mongoose connection error:', err);
        });
}


