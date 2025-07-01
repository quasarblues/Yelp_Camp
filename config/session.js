const session = require('express-session');
const MongoStore = require('connect-mongo');
const { dbUrl } = require('./db');

const secret = process.env.SESSION_SECRET || 'thisdevsecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
})
const sessionMiddleware = session({
    store,
    name: 'sesh',
    secret: secret,
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
});

module.exports = sessionMiddleware;