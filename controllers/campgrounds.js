const Campground = require('../models/campground');

const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, title: 'Campgrounds' });
}

const renderNewform = (req, res) => {
    res.render('campgrounds/new');
}

const createNewCampground = async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

const show = async (req, res) => {
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
}

const renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash('error', 'Sorry, that campground could not be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCampground });
}

const updateCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    req.flash('success', 'Campground successfully updated.');
    res.redirect(`/campgrounds/${id}`);
}

const deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log(`Deleted ${deletedCampground.title} : ${deletedCampground.location}`)
    req.flash('deleted', 'A campground was deleted.');
    res.redirect('/campgrounds');
}

module.exports = { index, renderNewform, createNewCampground, show, renderEditForm, updateCampground, deleteCampground };