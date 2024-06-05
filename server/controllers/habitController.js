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

exports.getHabitsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const habits = await Habit.find({ userId });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getHabitById = async (req, res) => {
  const { id } = req.params;

  try {
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateHabitById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const habit = await Habit.findByIdAndUpdate(id, updateData, { new: true });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
