const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL;
// process.env.DB_LOCAL_URL

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Mongo DB connected')
    })
    .catch((err) => {
        console.log(`Error of ${err}`)
    });

console.log(dbUrl);
module.exports = { mongoose, dbUrl };