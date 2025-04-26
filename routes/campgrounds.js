const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinaryConfig');
const upload = multer({ storage: storage });

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewform);

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground));

router.post('/', upload.array('campground[image]'), (req, res) => {
    res.send('it worked')
    console.log(req.body, req.files);
})

router.get('/:id', catchAsync(campgrounds.show));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;