const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, title: 'Campgrounds' });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!foundCampground) {
        req.flash('error', 'Sorry, that campground could not be found.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { foundCampground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash('error', 'Sorry, that campground could not be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCampground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    req.flash('success', 'Campground successfully updated.');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log(`Deleted ${deletedCampground.title} : ${deletedCampground.location}`)
    req.flash('deleted', 'A campground was deleted.');
    res.redirect('/campgrounds');
}));

module.exports = router;