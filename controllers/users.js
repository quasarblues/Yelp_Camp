const User = require('../models/user');

const renderRegisterForm = (req, res) => {
    res.render('users/register',
        {
            title: 'Register',
            siteTitle: 'Join YelpCamp!',
            siteDesc: 'Sign up to submit and review campgrounds',
            siteImg: 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80',
            siteUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
        }
    );
}

const createNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            console.log(registeredUser);
            req.flash('success', `Welcome to Yelp Camp ${username}`);
            return res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('register');
    }
}

const loginUser = (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', "You logged out.");
        res.redirect('/campgrounds');
    });
}

module.exports = { renderRegisterForm, createNewUser, loginUser, logoutUser };