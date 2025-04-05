const isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please sign in.');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;

