const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const moment = require('moment');

const { isAuthenticated } = require('../helpers/auth');

const cloudinary = require('cloudinary');
const fs = require('fs-extra');
/**
 * Cloudinary Config
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sign In render
 */
router.get('/login', (req, res) => {
    res.render('users/login/signin');
});

/**
 * Sign In
 */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/',
    failureFlash: true
}));

/**
 * Sign up render
 */
router.get('/signup', (req, res) => {
    res.render('users/login/signup');
});

/**
 * Sign up
 */
router.post('/signup', async (req, res) => {
    const { name, last_name, second_last_name, username, password, confirm_password } = req.body;
    console.log(req.body);
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
            res.redirect('/login');
        } else {
            const imageURL = 'https://res.cloudinary.com/dpar6bmfd/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max/v1654021505/149071_ddfsfq.png'
            const newUser = new User({ name, last_name, second_last_name, username, password, imageURL });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You have been registered');
            res.redirect('/login')
        }
    }
});

/**
 * Log out
 */
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

/**
 * Render Profile, validations for degree and date maybe could be optimized
 */
router.get('/profile', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    console.log(req.body);
    const { degree, admissionFormat } = validation(user);
    res.render('users/profile/profile', { degree, admissionFormat });
});

/** 
 * Render profile so it can be updated, same validations
 * ?????????
 */
router.get('/profile/edit/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    const { degree, admissionFormat } = validation(user);
    res.render('users/profile/edit_profile', { user, degree, admissionFormat });
});

/**
 * Update info. NO PROFILE PICTURE INCLUDED
 * 
 */
router.put('/profile/edit/:id', isAuthenticated, async (req, res) => {
    const { name, last_name, second_last_name, phone, address, curp, rfc, email_i, email_p,
        email_personal, admission, professional_profile, study_degree } = req.body;
    const id = req.user.id;
    
    const user = await User.findById(id);
    
    console.log(firstTime(user));

    const errors = [];

    //VALIDATIONS
    const regexName = /^\s*([A-Za-z]{1,}([\.,]? |[-']| ))+[A-Za-z]+\.?\s*$|\w+/;
    const regexPhone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const regexAddress = /^[A-Za-z0-9#-\s]*$/;
    const regexCurp = /[\A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}([A-Z]{2})?([0-9]{2})?/;
    const regexRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;


    if (!regexName.test(name) || name === '' || name === null) {
        errors.push({ text: 'Por favor ingresa un nombre valido' });
    }
    if (!regexName.test(last_name) || last_name === '' || last_name === null) {
        errors.push({ text: 'Por favor ingresa un nombre valido' });
    }
    if (!regexName.test(second_last_name) || second_last_name === '' || second_last_name === null) {
        errors.push({ text: 'Por favor ingresa un nombre valido' });
    }
    if (!regexPhone.test(phone) || phone === '' || phone === null) {
        errors.push({ text: 'Por favor ingresa un número de teléfono valido' });
    }
    if (!regexAddress.test(address) || address == null || address === '') {
        errors.push({ text: 'Por favor ingresa una dirección valida' });
    }
    if (!regexCurp.test(curp) || curp === '' || curp === null) {
        errors.push({ text: 'Por favor ingresa una CURP valida' });
    }
    if (!regexRFC.test(rfc) || rfc === '' || rfc === null) {
        errors.push({ text: 'Por favor ingresa un RFC valido' });
    }
    if (errors.length > 0) {
        console.log(errors);
        res.render('users/profile/edit_profile', { errors, name, last_name, second_last_name, phone, address, curp, rfc, email_i, email_p, email_personal, admission, professional_profile, study_degree });
    } else {
        await User.findByIdAndUpdate(req.params.id, {
            name, last_name, second_last_name, phone, address, curp, rfc,
            email_i, email_p, email_personal, admission, professional_profile, study_degree
        });
        req.flash('success_msg', 'Cambios realizados exitosamente');
        res.redirect('/profile');
    }
});

/**
 * Change profile picture and show buttons
 
router.get('/profile/update_profile_picture/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    const preview = true;
    const { degree, admissionFormat } = validation(user);
    //Aqui tiene que actualziar sin recargar
    res.render('users/profile/edit_profile', { user, degree, admissionFormat, preview });
});

/**
 * Change profile picture
 
router.post('/profile/update_profile_picture/:id', isAuthenticated, async (req, res) => {
    console.log(req.file != null);
    const user = await User.findById(req.user.id);
    
    const { degree, admissionFormat } = validation(user);
    
    var errors = [];
    if (req.file != null) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        const public_id = result.public_id;
        const imageURL = result.secure_url;
        //Aqui tiene que actualziar sin recargar para que la preview cargue

        await User.findByIdAndUpdate(req.params.id, { imageURL, public_id });
        await fs.unlink(req.file.path);
        req.flash('success_msg', 'Imagen subida');
    } else {
        const preview = true;
        errors.push('Por favor sube un archivo');

        res.render('users/profile/edit_profile', { errors, user, degree, admissionFormat, preview });
    }

    res.redirect('/profile');
    
});
*/
router.get('/schedule', (req, res) => {
    res.render('users/activities/schedule');
});

function validation(user) {
    var degree = [];
    var degree1 = false;
    var degree2 = false;
    var degree3 = false;
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
    return { degree, admissionFormat };
}

function firstTime(user) {
    const name = user.name;
    const last_name = user.last_name;
    const second_last_name = user.second_last_name;
    const phone = user.phone;
    const address = user.address;
    const curp = user.curp;
    const rfc = user.rfc;
    const email_i = user.email_i;
    const email_p = user.email_p;
    const email_personal = user.email_personal;
    const admission = user.admission;
    const professional_profile = user.professional_profile;
    const study_degree = user.study_degree;

    if (name != null || last_name != null || second_last_name != null || phone != null || address != null ||
        curp != null || rfc != null || email_i != null || email_p != null || email_personal != null || 
        admission != null || professional_profile != null || study_degree != null) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = router;