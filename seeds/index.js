const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { adjectives, names } = require('./campSeed');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Mongo DB connected')
    })
    .catch((err) => {
        console.log(`Error of ${err}`)
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) + 10;
        const camp = new Campground({
            author: '67f51ea23c5e06c829fc3db6',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(adjectives)} ${sample(names)}`,
            image: 'https://picsum.photos/400',
            description: 'Spare ribs veniam dolore pariatur nostrud laborum nulla andouille et t-bone ex ullamco. Cupim veniam velit pork loin biltong sirloin. Shank ut tenderloin velit, culpa pastrami ipsum. Occaecat velit drumstick tempor cupim strip steak.',
            price
        })
        await camp.save();
    }
}

seedDB();
