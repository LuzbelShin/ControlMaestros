const express = require('express');
const { isAuthenticated } = require('../helpers/auth');
const NodeMailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs-extra');
const router = express.Router();

router.get('/email', (req, res) => {
    res.render('users/activities/mail');
});

router.post('/sendEmail', (req, res) => {
    const { subject, message } = req.body;
    var errors = [];
    const contentHTML = `
    <p>message: ${message}</p>
    `;
    const files = req.files;
    
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
                    user: "carlos.valenzuela@cbtis037.edu.mx",
                    clientId: clientID,
                    clientSecret: clientSecret,
                    refreshToken: refreshToken,
                    accessToken: accessToken
                }
            });
            const mailOptions = {
                from: "NodeMailer <carlos.valenzuela@cbtis037.edu.mx>",
                to: "carlos.valenzuela.cbtis037@gmail.com",
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
    if(subject != null && subject != ''){
        sendMail(subject, files, contentHTML).then(result=> { 
            removeFiles(files);
            res.status(200).redirect("/");
        }).catch(error=>console.log(error.message));
    }else{
        errors.push({message: 'Favor de introducir un asunto'});   
    }
    if (errors.length > 0) {
        res.render('users/profile/edit_profile', { errors, subject, message, files });
    }
});


module.exports = router;