const express = require('express');
const { isAuthenticated } = require('../helpers/auth');
const router = express.Router();
const Schedule = require('../models/Schedule');

router.get('/schedule', (req, res) => {
    // const { field11, field12, field13, field14, field15,
    //         field21, field22, field23, field24, field25,
    //         field31, field32, field33, field34, field35,
    //         field41, field42, field43, field44, field45, 
    //         field51, field52, field53, field54, field55, 
    //         field61, field62, field63, field64, field65, 
    //         field71, field72, field73, field74, field75, 
    //         field81, field82, field83, field84, field85, 
    //         field91, field92, field93, field94, field95, 
    //         fielda1, fielda2, fielda3, fielda4, fielda5, 
    //         fieldb1, fieldb2, fieldb3, fieldb4, fieldb5, 
    //         fieldc1, fieldc2, fieldc3, fieldc4, fieldc5, 
    //         fieldd1, fieldd2, fieldd3, fieldd4, fieldd5 } = req.body;

    res.render('users/activities/schedule');
});

router.post('/schedule', (req, res) => {
    
    res.render('users/activities/schedule');
});

module.exports = router;