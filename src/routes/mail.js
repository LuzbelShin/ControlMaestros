const express = require('express');
const { isAuthenticated } = require('../helpers/auth');
const NodeMailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs-extra');
const User = require('../models/User');

const router = express.Router();

router.get('/email', isAuthenticated, async (req, res) => {
    const id = req.user.id;
    const user = await User.findById(id);

    if(user['admin']){
        res.render('users/activities/mail');
    } else{
        res.redirect('/');
    }
});

router.post('/sendEmail', isAuthenticated, async (req, res) => {
    const { subject, message, mailSelect } = req.body;
    const errors = [];
    const contentHTML = `
        <p>${message}</p>
    `;
    const files = req.files;
    var mails = [];
    if(mailSelect == 'Favoritos'){
        mails = await correosFavoritos();
    } else if(mailSelect == 'Institucionales'){
        mails = await correosInstitucionales();
    }
    clean(mails);
    const clientID = process.env.CLIENTID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectURI = process.env.REDIRECT_URI;
    const refreshToken = process.env.REFRESH_TOKEN;
    const oAuth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI);
    oAuth2Client.setCredentials({refresh_token: refreshToken});

    async function sendMail(subject, files, contentHTML){
        try{
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = NodeMailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "carlos.valenzuela.cbtis037@gmail.com",
                    clientId: clientID,
                    clientSecret: clientSecret,
                    refreshToken: refreshToken,
                    accessToken: accessToken
                }
            });
            const mailOptions = {
                from: "Carlos Valenzuela <carlos.valenzuela.cbtis037@gmail.com>",
                to: mails.toString(),
                subject: subject,
                html: contentHTML,
                attachments: files,
            };
            const result = await transport.sendMail(mailOptions);
            return result;
        } catch(err) {
            console.log(err)
        }
    }
    async function removeFiles(files){
        files.forEach(element => fs.unlink(element.path));
    }
    if(subject == null && subject == ''){
        errors.push({ text: 'Favor de introducir un asunto' });
    }
    if(message == null && message == ''){
        errors.push({ text: 'Favor de introducir un mensaje' });
    }
    if (errors.length > 0) {
        res.render('users/activities/mail', { errors, subject, message, files });
    } else {
        sendMail(subject, files, contentHTML).then(result=> { 
            removeFiles(files);
            res.status(200).redirect("/");
        }).catch(error=>console.log(error.message));
    }
});

async function correosFavoritos(){
    return await User.distinct('favorite_email');
}

async function correosInstitucionales(){
    return await User.distinct('email_i');
}

function clean(array){
    array.forEach(element => {
        if(element == ''){
            array.splice(array.indexOf(element), array.indexOf(element)+1);
        }
    });
    return array;
}

module.exports = router;