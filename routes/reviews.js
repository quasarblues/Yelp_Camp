const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

router.post('/', validateReview, catchAsync(async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    foundCampground.reviews.push(newReview);
    await newReview.save();
    await foundCampground.save();
    req.flash('success', 'Created new review.')
    res.redirect(`/campgrounds/${foundCampground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('deleted', 'A comment was deleted');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router