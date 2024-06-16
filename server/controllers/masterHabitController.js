// controllers/masterHabit.controller.js
const MasterHabit = require('../models/masterHabit');

// Create a new entry
exports.createMasterHabit = async (req, res) => {
  try {
    const { categoryName, habitName } = req.body;
    const newHabit = new MasterHabit({ categoryName, habitName });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all unique categories
exports.getAllUniqueCategories = async (req, res) => {
  try {
    const categories = await MasterHabit.distinct('categoryName');
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all habits for one category
exports.getHabitsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const habits = await MasterHabit.find({ categoryName });
    res.status(200).json(habits);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing entry
exports.updateMasterHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, habitName } = req.body;
    const updatedHabit = await MasterHabit.findByIdAndUpdate(id, { categoryName, habitName }, { new: true });
    if (!updatedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(200).json(updatedHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
