const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const moment = require('moment');

const { isAuthenticated } = require('../helpers/auth');

const cloudinary = require('cloudinary');
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/login', (req, res) => {
    res.render('users/login/signin');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/',
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
    res.render('users/profile/profile', { degree, admissionFormat });
});

router.get('/users/profile/edit/?:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
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
    res.render('users/profile/edit_profile', { user, degree, admissionFormat });
});

router.put('/users/profile/edit/:id', isAuthenticated, async (req, res) => {
    const { name, last_name, second_last_name, phone, address, curp, rfc, email_i, email_p, email_personal, admission, professional_profile, study_degree } = req.body;
    const errors = [];
    //VALIDATIONS
    const regexName = /^\s*([A-Za-z]{1,}([\.,]? |[-']| ))+[A-Za-z]+\.?\s*$|\w+/;
    const regexPhone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const regexAddress = /^[A-Za-z0-9#-\s]*$/;
    const regexCurp = /[\A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}([A-Z]{2})?([0-9]{2})?/;
    const regexRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    const regexTitle = /^[a-zA-Z\s]*$/;
    var rName = regexName.test(name);
    var rLastname = regexName.test(last_name);
    var rSLastname = regexName.test(second_last_name);
    var rPhone = regexPhone.test(phone);
    var rAddress = regexAddress.test(address);
    var rCurp = regexCurp.test(curp);
    var rRFC = regexRFC.test(rfc);
    var rProfessionalProfile = regexTitle.test(professional_profile);
    if (!rName) {
        errors.push({ text: 'Por favor ingresa un nombre valido' });
        console.log('1');
    }
    if (!rLastname) {
        errors.push({ text: 'Por favor ingresa un nombre valido' });
        console.log('2');
    }
    if (!rSLastname) {
        errors.push({ text: 'Por favor ingresa un nombre valido' });
        console.log('3');
    }
    if (!rPhone) {
        errors.push({ text: 'Por favor ingresa un n&uacute;mero de tel&eacute;fono valido' });
        console.log('4');
    }
    if (!rAddress) {
        errors.push({ text: 'Por favor ingresa una direcci&oacute; valida' });
        console.log('5');
    }
    if (!rCurp) {
        errors.push({ text: 'Por favor ingresa una CURP valida' });
        console.log('6');
    }
    if (!rRFC) {
        errors.push({ text: 'Por favor ingresa un RFC valido' });
        console.log('7');
    }
    if (!rProfessionalProfile) {
        errors.push({ text: 'Por favor ingresa un t&iacute;tulo valido' });
        console.log('8');
    }
    //Este If no sirve, preguntar al Eliu
    if (errors.length > 0) {
        res.render('/users/profile/edit_profile/', { errors, name, last_name, second_last_name, phone, address, curp, rfc, email_i, email_p, email_personal, admission, professional_profile, study_degree });
    } else {
        await User.findByIdAndUpdate(req.params.id, {
            name, last_name, second_last_name, phone, address, curp, rfc,
            email_i, email_p, email_personal, admission, professional_profile, study_degree
        });
        req.flash('success_msg', 'Cambios realizados exitosamente');
        res.redirect('/users/profile');
    }
});

router.get('/users/profile/edit/profile_picture/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);
    const preview = true;
    //
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
//
    //Aqui tiene que actualziar sin recargar
    res.render('users/profile/edit_profile', { user, degree, admissionFormat , preview});
});

router.post('/users/profile/edit/profile_picture/:id', isAuthenticated, async (req, res) => {

    console.log(req.file != null);
    if (req.file != null) {

        const result = await cloudinary.v2.uploader.upload(req.file.path);
        const public_id = result.public_id;
        const imageURL = result.secure_url;
        //Aqui tiene que actualziar sin recargar para que la preview cargue

        await User.findByIdAndUpdate(req.params.id, { imageURL, public_id });

        await fs.unlink(req.file.path);
    }



});

module.exports = router;