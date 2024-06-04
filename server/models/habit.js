const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  startDate: {type: String},
  endDate: {type: String},
  numDays : {type: Number},
  userId: { type: String },
  daysDone: { type: [String], default: [] },
});

module.exports = mongoose.model('Habit', habitSchema);
