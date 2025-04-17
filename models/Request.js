const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['trimisă', 'acceptată', 'respinsă'],
    default: 'trimisă'
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
