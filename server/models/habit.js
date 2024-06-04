const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  daysDone: { type: [Date], default: [] },
});

module.exports = mongoose.model('Habit', habitSchema);
