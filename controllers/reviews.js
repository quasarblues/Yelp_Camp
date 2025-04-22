const Review = require('../models/review');
const Campground = require('../models/campground');

const createReview = async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    foundCampground.reviews.push(newReview);
    await newReview.save();
    await foundCampground.save();
    req.flash('success', 'Created new review.')
    res.redirect(`/campgrounds/${foundCampground._id}`);
}

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('deleted', 'A comment was deleted');
    res.redirect(`/campgrounds/${id}`);
}

module.exports = { createReview, deleteReview };