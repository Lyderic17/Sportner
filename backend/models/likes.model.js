// like.model.js
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  likerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Like= mongoose.model('Like', likeSchema);

module.exports = Like;