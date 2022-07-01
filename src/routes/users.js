const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

const { isAuthenticated } = require('../helpers/auth');

const cloudinary = require('cloudinary');
const fs = require('fs-extra');
const { $where } = require('../models/User');
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

router.get('/login/google', passport.authenticate('auth.google', {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
    session: false,
}));

router.get('/oauth2/redirect/google', passport.authenticate('auth.google', { 
    successRedirect: '/',
    failureRedirect: '/login', 
    failureMessage: true 
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
    const errors = [];
    const regexName = /^\s*([A-Za-z]{1,}([\.,]? |[-']| ))+[A-Za-z]+\.?\s*$|\w+/;

    if (name.length <= 0 || username.length <= 0 || password.length <= 0
        || last_name.length <= 0) {
        errors.push({ text: 'Favor de llenar todos los campos' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña deberia ser de al menos 4 caracteres' });
    }

    if (!regexName.test(name)) {
        errors.push({ text: 'Favor de ingresar un nombre valido' });
    }
    if (!regexName.test(last_name)) {
        errors.push({ text: 'Favor de ingresar un nombre valido' });
    }
    if (second_last_name.length > 0) {
        if (!regexName.test(second_last_name)) {
            errors.push({ text: 'Favor de ingresar un nombre valido' });
        }
    }
    if (errors.length > 0) {
        res.render('users/login/signup', { errors, name, last_name, second_last_name, username, password, confirm_password });
    } else {
        const emailUser = await User.findOne({ username: username });
        if (emailUser) {
            req.flash('error_msg', 'El correo ya se encuentra registrado');
            res.redirect('/login');
            // errors.push({ text: 'The email is already in use' });
            // res.render('users/login/signup', { errors, name, last_name, second_last_name });
        } else {
            const newUser = new User({ name, last_name, second_last_name, username, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Ha sido registrado');
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
router.get('/profile/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    const { degree, email } = validation(user);
    res.render('users/profile/profile', { degree, email });
});

/** 
 * Render profile so it can be updated, same validations
 * 
 */
router.get('/profile/edit/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    const { degree, email } = validation(user);
    var firsttime = firstTime(user);
    res.render('users/profile/edit_profile', { user, degree, firsttime, email });

});

/**
 * Update info.
 * 
 */
router.put('/profile/edit/:id', isAuthenticated, async (req, res) => {
    const { name, last_name, second_last_name, phone, address, curp, rfc, email_i, email_p,
        email_personal, admission, profile, study_degree, check_email_i, check_email_p, check_email_personal
    } = req.body;
    const id = req.user.id;

    const user = await User.findById(id);

    var firsttime = firstTime(user);
    var favorite_email = favoriteEmail(email_i, email_p, email_personal, check_email_i, check_email_p, check_email_personal);
    const errors = [];

    const regexPhone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const regexAddress = /^[A-Za-z0-9#.-\s]*$/;
    const regexCurp = /[\A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}([A-Z]{2})?([0-9]{2})?/;
    const regexRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    const regexDate = /^(0?[1-9]|1[0-9]|2[0-4])([\-/])\d{4}$/;

    if (!regexPhone.test(phone) || phone === '' || phone === null) {
        errors.push({ text: 'Favor de ingresar un número de teléfono valido' });
    }
    if (!regexAddress.test(address) || address == null || address === '') {
        errors.push({ text: 'Favor de ingresar una dirección valida' });
    }
    if (firsttime) {
        if (!regexCurp.test(curp) || curp === '' || curp === null) {
            errors.push({ text: 'Favor de ingresar una CURP valida' });
        }
        if (!regexRFC.test(rfc) || rfc === '' || rfc === null) {
            errors.push({ text: 'Favor de ingresar un RFC valido' });
        }
        if (!regexDate.test(admission) || admission === '' || admission === null) {
            errors.push({ text: 'Favor de ingresar una quincena valida' });
        }
    }
    if (req.files.length != 0 && errors.length > 0) {
        const file = req.files.at(0);
        const result = await cloudinary.v2.uploader.upload(file.path);
        const public_id = result.public_id;
        const imageURL = result.secure_url;

        await User.findByIdAndUpdate(req.params.id, { imageURL, public_id });
        await fs.unlink(file.path);
        const onlyImage = '/profile/edit/' + user._id;
        res.redirect(onlyImage);
    }
    if (errors.length > 0) {
        res.render('users/profile/edit_profile', { errors, name, last_name, second_last_name, phone, address, curp, rfc, email_i, email_p, email_personal, admission, profile, study_degree, firsttime });
    } else {
        if (req.files.length != 0) {
            const file = req.files.at(0);
            const result = await cloudinary.v2.uploader.upload(file.path);
            const public_id = result.public_id;
            const imageURL = result.secure_url;

            await fs.unlink(file.path);
            await User.findByIdAndUpdate(req.params.id, {
                name, last_name, second_last_name, phone, address, curp, rfc,
                email_i, email_p, email_personal, admission, profile, study_degree, imageURL, public_id, favorite_email
            });
        } else {
            await User.findByIdAndUpdate(req.params.id, {
                name, last_name, second_last_name, phone, address, curp, rfc,
                email_i, email_p, email_personal, admission, profile, study_degree, favorite_email
            });
        }
        let profileLink = '/profile/' + user._id;
        req.flash('success_msg', 'Cambios realizados exitosamente');
        res.redirect(profileLink);
    }
});

function validation(user) {
    var degree = [];
    var degree1 = false;
    var degree2 = false;
    var degree3 = false;
    if (user['study_degree'] == "Licenciatura") {
        degree1 = true;
    } else if (user['study_degree'] == "Maestria") {
        degree2 = true;
    } else if (user['study_degree'] == "Doctorado") {
        degree3 = true;
    }
    degree.push(degree1);
    degree.push(degree2);
    degree.push(degree3);
    var email = [];
    var email1 = false;
    var email2 = false;
    var email3 = false;
    var email4 = true;
    const email_i = user['email_i'];
    const email_p = user['email_p'];
    const email_personal = user['email_personal'];
    const favorite_email = user['favorite_email'];
    if (favorite_email != null && favorite_email != '') {
        if (email_i != null && email_i != '') {
            if (email_i == favorite_email) {
                email1 = true;
                email4 = false;
            }
        }
        if (email_p != null && email_p != '') {
            if (email_p == favorite_email) {
                email2 = true;
                email4 = false;
            }
        }
        if (email_personal != null && email_personal != '') {
            if (email_personal == favorite_email) {
                email3 = true;
                email4 = false;
            }
        }
    }

    email.push(email1);
    email.push(email2);
    email.push(email3);
    email.push(email4);
    // const admissionFormat = moment(user['admission']).add(1, 'day').format('YYYY-MM-DD');
    return { degree, email };
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
    const profile = user.profile;
    const study_degree = user.study_degree;

    if (name != null && last_name != null && second_last_name != null && phone == null &&
        address == null && curp == null && rfc == null && email_i == null &&
        email_p == null && email_personal == null && admission == null &&
        profile == null && study_degree == null) {
        return true;
    }
    return false;
}

function favoriteEmail(email_i, email_p, email_personal, check_email_i, check_email_p, check_email_personal) {
    var favorite_email = '';

    if (check_email_i == 'on') {
        if (email_i != null && email_i != '') {
            favorite_email = email_i
        }
    } else if (check_email_p == 'on') {
        if (email_p != null && email_p != '') {
            favorite_email = email_p
        }
    } else if (check_email_personal == 'on') {
        if (email_personal != null && email_personal != '') {
            favorite_email = email_personal
        }
    }
    return favorite_email;
}

module.exports = router;