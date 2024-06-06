const express = require('express');
const router = express.Router();
const { createHabit, getHabitsByUser, getHabitById, updateHabitById, getFilteredHabits } = require('../controllers/habitController');

router.post('/', createHabit);
router.get('/filtered', getFilteredHabits);
router.get('/:userId', getHabitsByUser);
router.get('/single/:id', getHabitById);
router.put('/:id', updateHabitById);

module.exports = router;
