// Set environment variables in dev mode
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Core dependencies
const express = require('express');
const app = express();
const path = require('path');
const sessionMiddleware = require('./config/session');
const flash = require('connect-flash');
const { passport } = require('./config/passport');
const helmetMiddleware = require('./config/helmet');

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

// Core Express Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

app.use(sessionMiddleware);
app.use(flash());
app.use(helmetMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.deleted = req.flash('deleted');
    res.locals.siteTitle = 'YelpCamp';
    res.locals.siteDesc = 'Explore our many campgrounds';
    res.locals.siteImg = 'https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80';
    res.locals.siteUrl = 'https://yelpcamp-fqsh.onrender.com/';
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