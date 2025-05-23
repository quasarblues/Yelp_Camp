const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
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
    await Review.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) + 10;
        const camp = new Campground({
            author: '67f51ea23c5e06c829fc3db6',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(adjectives)} ${sample(names)}`,
            description: 'Spare ribs veniam dolore pariatur nostrud laborum nulla andouille et t-bone ex ullamco. Cupim veniam velit pork loin biltong sirloin. Shank ut tenderloin velit, culpa pastrami ipsum. Occaecat velit drumstick tempor cupim strip steak.',
            price,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dlvbewmvi/image/upload/v1747578568/obnoxiuslongname_sracb4.jpg',
                    filename: 'YelpCamp/obnoxiuslongname_sracb4'
                },
                {
                    url: 'https://res.cloudinary.com/dlvbewmvi/image/upload/v1747578551/pic3_kpfqts.jpg',
                    filename: 'YelpCamp/v1747578551/pic3_kpfqts'
                },
                {
                    url: 'https://res.cloudinary.com/dlvbewmvi/image/upload/v1747578444/desertcamp_afkbwx.jpg',
                    filename: 'YelpCamp/v1747578444/desertcamp_afkbwx'
                }
            ]
        })
        await camp.save();
    }
}

seedDB();
