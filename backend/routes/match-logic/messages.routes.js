const express = require('express');
const router = express.Router();
const Message = require('../../models/message.model');
const messageController = require('../../controller/messages/messagesController')

router.get('/:chatId', messageController.getPreviousMessages);
router.get('/last-message', messageController.getLastMessage);
module.exports = router;