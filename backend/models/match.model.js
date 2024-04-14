// match.model.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now }
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
