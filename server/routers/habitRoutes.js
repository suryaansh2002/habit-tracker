const express = require('express');
const router = express.Router();
const { createHabit, getHabitsByUser, getHabitById, updateHabitById, getFilteredHabits, getUserStartDate, getHabitsByMasterId } = require('../controllers/habitController');

router.post('/', createHabit);
router.get('/filtered', getFilteredHabits);
router.get('/startDate', getUserStartDate);
router.get('/:userId', getHabitsByUser);
router.get('/master/:masterHabitId', getHabitsByMasterId);
router.get('/single/:id', getHabitById);
router.put('/:id', updateHabitById);

module.exports = router;
