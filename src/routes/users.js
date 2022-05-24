const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const moment = require('moment');

const { isAuthenticated } = require('../helpers/auth');

router.get('/login', (req, res) => {
    res.render('users/login/signin');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', (req, res) => {
    res.render('users/login/signup');
});

router.post('/signup', async (req, res) => {
    const { name, last_name, second_last_name, username, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0 || username.length <= 0 || password.length <= 0
        || last_name.length <= 0) {
        errors.push({ text: 'Please fill all blank fields' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Passwords do not match.' });
    }
    if (password.length < 4) {
        errors.push({ text: 'Password should be at least 4 characters long.' });
    }
    if (errors.length > 0) {
        res.render('users/login/signup', { errors, name, last_name, second_last_name, username, password, confirm_password });
    } else {
        const emailUser = await User.findOne({ username: username });
        if (emailUser) {
            req.flash('error_msg', 'The email is already in use');
            res.redirect('/users/login/signup');
        } else {
            const newUser = new User({ name, last_name, second_last_name, username, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You have been registered');
            res.redirect('/users/login/signin')
        }
    }
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/users/profile', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    var degree = [];
    var degree1 = false;
    var degree2 = false;
    var degree3 = false;
    console.log(user['study_degree']);
    if (user['study_degree'] == "Licenciatura") {
        degree1 = true;
        degree2 = false;
        degree3 = false;
    } else if (user['study_degree'] == "Maestria") {
        degree1 = false;
        degree2 = true;
        degree3 = false;
    } else if (user['study_degree'] == "Doctorado") {
        degree1 = false;
        degree2 = false;
        degree3 = true;
    }
    degree.push(degree1);
    degree.push(degree2);
    degree.push(degree3);
    const admissionFormat = moment(user['admission']).add(1, 'day').format('YYYY-MM-DD');
    res.render('users/profile/profile', {degree, admissionFormat});
});

router.post('/users/profile', isAuthenticated, async (req, res) => {

});

router.post('/users/profile/edit', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    var degree = [];
    var degree1 = false;
    var degree2 = false;
    var degree3 = false;
    console.log(user['study_degree']);
    if (user['study_degree'] == "Licenciatura") {
        degree1 = true;
        degree2 = false;
        degree3 = false;
    } else if (user['study_degree'] == "Maestria") {
        degree1 = false;
        degree2 = true;
        degree3 = false;
    } else if (user['study_degree'] == "Doctorado") {
        degree1 = false;
        degree2 = false;
        degree3 = true;
    }
    degree.push(degree1);
    degree.push(degree2);
    degree.push(degree3);
    const admissionFormat = moment(user['admission']).add(1, 'day').format('YYYY-MM-DD');
    res.render('users/profile/edit_profile', {degree, admissionFormat});
});

module.exports = router;