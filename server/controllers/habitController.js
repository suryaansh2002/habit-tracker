const Habit = require('../models/habit');

exports.createHabit = async (req, res) => {
  const { userId, daysDone } = req.body;

  try {
    const habit = new Habit({ userId, daysDone });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
