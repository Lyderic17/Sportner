const express = require('express');
const router = express.Router();
const Message = require('../../models/message.model');
const mongoose = require('mongoose');
// Endpoint to get previous messages for a chat
async function getPreviousMessages(req, res){
  try {
    const chatId = req.params.chatId;
    // Retrieve messages for the specified chat from the database
    const messages = await Message.find({ chatId: chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving previous messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function getLastMessage(req, res){
  try {
    const { senderId, recipientId } = req.query;
    const senderObjectId = mongoose.Types.ObjectId(senderId);
    const recipientObjectId = mongoose.Types.ObjectId(recipientId);
    // Find the last message where senderId and recipientId match
    const lastMessage = await Message.findOne({ 
      $or: [
        { senderId, recipientObjectId, recipientId:senderObjectId },
        { senderId: senderObjectId, recipientId: recipientObjectId } // In case the sender and recipient are swapped
      ]
    }).sort({ createdAt: -1 }).limit(1);
    console.log(lastMessage," last messagenono")
    res.status(200).json(lastMessage);
  } catch (error) {
    console.error('Error fetching last message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


    
module.exports = {getPreviousMessages, getLastMessage}