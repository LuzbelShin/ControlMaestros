const express = require('express');
const router = express.Router();

const label = document.getElementById('btn11');

label.addEventListener('click', function onClick() {

    label.style.backgroundColor = 'salmon';
    label.style.color = 'white';
});

module.exports = router;