const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;
const localDbUrl = process.env.DB_LOCAL_URL;

mongoose.connect(localDbUrl)
    .then(() => {
        console.log('Mongo DB connected')
    })
    .catch((err) => {
        console.log(`Error of ${err}`)
    });

module.exports = { mongoose, dbUrl, localDbUrl };