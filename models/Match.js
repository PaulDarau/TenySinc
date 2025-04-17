const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  surface: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
