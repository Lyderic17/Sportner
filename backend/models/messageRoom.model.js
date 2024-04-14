const mongoose = require('mongoose');

const messageRoomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the message room
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Participants in the message room
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Messages in the message room
  createdAt: { type: Date, default: Date.now } // Timestamp of message room creation
});

module.exports = mongoose.model('MessageRoom', messageRoomSchema);