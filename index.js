// Set environment variables in dev mode
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Core dependencies
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

// Middleware
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

// Custom Utilities
const ExpressError = require('./utils/ExpressError');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Mongo DB connected')
    })
    .catch((err) => {
        console.log(`Error of ${err}`)
    });

// Core Express Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

const sessionConfig = {
    name: 'sesh',
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        // Expire after 1 week
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        // maxAge is 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

// Set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.deleted = req.flash('deleted');
    next();
});

// Route Setup (Express Router)
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use(userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, there was a problem'
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});