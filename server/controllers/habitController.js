const Habit = require('../models/habit');

exports.createHabit = async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' });
  }
};
