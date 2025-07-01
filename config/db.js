const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Mongo DB connected')
    })
    .catch((err) => {
        console.log(`Error of ${err}`)
    });

module.exports = { mongoose, dbUrl };