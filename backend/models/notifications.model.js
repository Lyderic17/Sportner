const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // 'like' or 'match'
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  });
const Notification =  mongoose.model('Notification', notificationSchema);

module.exports = Notification