const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  surface: {
    type: String,
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPlayed: {
    type: Boolean,
    default: false
  },
  score: {
    type: [{
      creatorScore: { type: Number, default: 0 },
      opponentScore: { type: Number, default: 0 }
    }],
    default: []
  },
  ratingGiven: {
    type: Number,
    min: 1,
    max: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
