// routes/masterHabit.routes.js
const express = require('express');
const router = express.Router();
const masterHabitController = require('../controllers/masterHabitController');

// Create new entry
router.post('/', masterHabitController.createMasterHabit);

// Get all unique categories
router.get('/categories', masterHabitController.getAllUniqueCategories);
router.get('/', masterHabitController.getAllHabits);

// Get all habits for one category
router.post('/categoryHabits', masterHabitController.getHabitsByCategory);

// Update existing entry
router.put('/:id', masterHabitController.updateMasterHabit);

module.exports = router;
