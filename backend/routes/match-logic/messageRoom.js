
const express = require('express');
const router = express.Router();
const MessageRoom = require('../../models/messageRoom.model');
const Message = require('../../models/message.model');
const mongoose = require('mongoose');

// Fetch all message rooms
router.get('/', async (req, res) => {
  try {
    const messageRooms = await MessageRoom.find();
    res.json(messageRooms);
  } catch (error) {
    console.error('Error fetching message rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/last-message', async(req, res) => {
  try {
    const { senderId, recipientId } = req.query;

    // Find the last message where senderId and recipientId match
    const lastMessage = await Message.findOne({ 
      $or: [
        { senderId, senderId, recipientId:recipientId },
        { senderId: recipientId, recipientId: senderId } // In case the sender and recipient are swapped
      ]
    }).sort({ createdAt: -1 }).limit(1);
    res.status(200).json(lastMessage);
  } catch (error) {
    console.error('Error fetching last messageOULALA:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
