// models/masterHabit.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterHabitSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  habitName: {
    type: String,
    required: true,
  }
});

const MasterHabit = mongoose.model('MasterHabit', masterHabitSchema);

module.exports = MasterHabit;
