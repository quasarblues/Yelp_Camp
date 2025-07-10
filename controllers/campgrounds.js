const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinaryConfig');
const campground = require('../models/campground');
// Maptiler variables
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',
        {
            campgrounds,
            title: 'All Campgrounds',
            siteTitle: 'All Campgrounds',
            siteDesc: 'Campgrounds submitted by users around the world.',
            siteImg: campgrounds[0].images[0].url,
            siteUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
        })
}

const renderNewform = (req, res) => {
    res.render('campgrounds/new',
        {
            title: 'Add a Campground',
            siteTitle: 'Add a Campground',
            siteDesc: 'Submit a new campground.',
            siteUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`

        });
}

const createNewCampground = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.features[0].geometry;
    newCampground.images = req.files.map(f => {
        return {
            url: f.path,
            filename: f.filename
        };
    });
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
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
    res.render('campgrounds/show',
        {
            foundCampground,
            title: foundCampground.title,
            siteTitle: foundCampground.title,
            siteDesc: foundCampground.description,
            siteImg: foundCampground.images[0].url,
            siteUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
        });
}

const renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash('error', 'Sorry, that campground could not be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCampground, title: `Edit ${foundCampground.title}` });
}

const updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => {
        return {
            url: f.path,
            filename: f.filename
        };
    });
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(campground);
    }
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