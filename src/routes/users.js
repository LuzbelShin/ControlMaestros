const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin', 
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) =>{
    const {name, last_name, second_last_name, username, password, confirm_password} = req.body;
    const errors = [];
    if(name.length <= 0 || username.length <= 0 || password.length <= 0
        || last_name.length <= 0){
        errors.push({text: 'Please fill all blank fields'});
    }
    if(password != confirm_password){
        errors.push({text: 'Passwords do not match.'});
    }
    if(password.length < 4){
        errors.push({text: 'Password should be at least 4 characters long.'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, last_name, second_last_name, username, password, confirm_password});
    } else{
        const emailUser = await User.findOne({username: username});
        if(emailUser){
            req.flash('error_msg', 'The email is already in use');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({name, last_name, second_last_name, username, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You have been registered');
            res.redirect('/users/signin')
        }
    }
});

router.get('/users/logout', (req, res) =>{
    req.logOut();
    res.redirect('/');
});

router.get('/users/profile', (req, res) =>{
    res.render('users/profile');
});

module.exports = router;