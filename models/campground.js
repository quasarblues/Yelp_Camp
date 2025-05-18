const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dlvbewmvi/image/upload/v1745974594/YelpCamp/objcfcc1n4fe2wtqzspb.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Campground', CampgroundSchema);