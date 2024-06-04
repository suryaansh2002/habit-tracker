const express = require('express');
const router = express.Router();
const { createHabit } = require('../controllers/habitController');

router.post('/', createHabit);

module.exports = router;
