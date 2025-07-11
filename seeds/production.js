// Set environment variables in dev mode
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities');
const { adjectives, names } = require('./campSeed');

mongoose.connect(process.env.DB_URL)
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
    for (let i = 0; i < 100; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) + 10;
        const camp = new Campground({
            author: '686789fac777512b735d47e0',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(adjectives)} ${sample(names)}`,
            description: 'Spare ribs veniam dolore pariatur nostrud laborum nulla andouille et t-bone ex ullamco. Cupim veniam velit pork loin biltong sirloin. Shank ut tenderloin velit, culpa pastrami ipsum. Occaecat velit drumstick tempor cupim strip steak.',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
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
