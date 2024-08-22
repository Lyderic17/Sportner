// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const authRoutes = require('./routes/authentication/auth.routes');
const userRoutes = require('./routes/user/userProfile.routes');
const User = require('./models/user.model');
const Match = require('./models/match.model');
const Message = require('./models/message.model');
const Like = require('./models/likes.model')
const jwt = require('jsonwebtoken');
const swipingRoutes = require('./routes/user/swiping.routes');
const likesRoutes = require('./routes/match-logic/likes.routes');
const notificationsRoutes = require('./routes/match-logic/notifications.routes');
const messageRoom = require('./routes/match-logic/messageRoom');
const messages = require('./routes/match-logic/messages.routes');
const Notification = require('./models/notifications.model');
const partnerRoutes = require("./routes/user/partner.routes");
const ObjectId = mongoose.Types.ObjectId;
//websocket
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});

// Import player routes
const corsOptions = {
    origin: 'http://localhost:4200', // Remplacez ceci par l'URL de votre application Angular en production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Autoriser l'inclusion des cookies dans les requêtes
  };

  // Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
// Connexion à MongoDB (assure-toi d'avoir un serveur MongoDB en cours d'exécution)
mongoose.connect('mongodb+srv://lydericFoot:Lyd&6b2e09a696f@cluster0.rf6kchl.mongodb.net/Sportner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.options('*', cors(corsOptions));
const db = mongoose.connection;

// Event listener for successful connection
db.on('connected', () => {
    console.log('Connected to MongoDB');
    const changeStream = db.watch();
    // Modify the MongoDB change stream to handle updates to the readBy array
    const messageChange = Message.watch();

    // Listen for changes in the readBy field
    messageChange.on('change', async (change) => {
      if (change.operationType === 'update') {
        const updatedMessage = change.updateDescription.updatedFields;
        if (updatedMessage.readBy) {
          const messageId = change.documentKey._id;
          const message = await Message.findById(messageId);
          const senderSocketId = message.senderId.toString();
          io.emit('messageReadByRecipient', message);
          console.log(`Message ${messageId} marked as read by the recipient that shit is in the changestream!`);
        }
      }
    });

// MongoDB change stream event listener for notifications
const notificationChangeStream = Notification.watch();

// Listen for 'change' events to capture changes in the database
// Listen for 'change' events to capture changes in the database
notificationChangeStream.on('change', async (change) => {
  try {
    if (change.operationType === 'insert') {
      // If a new notification is inserted, emit it to the recipient's client
      const newNotification = change.fullDocument;
      const recipientId = newNotification.receiverId;

      // Find the socket associated with the recipient's user ID
      /* console.log(recipientId," ID before socket thing")
      const recipientSocket = io.sockets.connected[recipientId];
      console.log(recipientSocket);
      if (recipientSocket) {
        // If the recipient's socket is connected, emit the new notification directly to it
        recipientSocket.emit('newNotification', newNotification);
      } else {
        console.log(`Recipient with ID ${recipientId} is not connected.`);
      } */
    }
  } catch (error) {
    console.error('Error handling notification change:', error);
  }
});

const messageChangeStream = Message.watch();
// Listen for 'change' events to capture changes in the database
//this below seems to "work" ? 
messageChangeStream.on('change', async (change) => {
  try {
    if (change.operationType === 'insert') {
      // If a new message is inserted, emit it to the recipient's client
      const newMessage = change.fullDocument;
      const recipientId = newMessage.recipientId;
      console.log("new message for the user:", recipientId)
      // Emit message to the recipient's client
      io.to(recipientId).emit('newMessage', newMessage);
    }
  } catch (error) {
    console.error('Error handling message change:', error);
  }
});

// MongoDB change stream event listener for likes
const likeChangeStream = Like.watch();

// Listen for 'change' events to capture changes in the database
likeChangeStream.on('change', async (change) => {
  try {
    if (change.operationType === 'insert') {
      // If a new like is inserted, emit it to the recipient's client
      const newLike = change.fullDocument;
      const recipientId = newLike.recipientId;

      // Emit like to the recipient's client
      io.to(recipientId).emit('newLike', newLike);
    }
  } catch (error) {
    console.error('Error handling like change:', error);
  }
});

// MongoDB change stream event listener for matches
const matchChangeStream = Match.watch();

// Listen for 'change' events to capture changes in the database
matchChangeStream.on('change', async (change) => {
  try {
    if (change.operationType === 'insert') {
      // If a new match is inserted, emit it to the recipient's client
      const newMatch = change.fullDocument;
      const recipientId = newMatch.recipientId;

      // Emit match to the recipient's client
      io.to(recipientId).emit('newMatch', newMatch);
    }
  } catch (error) {
    console.error('Error handling match change:', error);
  }
});

    
  });

  // Event listener for connection error
db.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});
app.use(cors(corsOptions));
// Use player routes
//From here, it will be about the prediction:
app.use('/auth', authRoutes);
// Prediction endpoint
app.use('/user', userRoutes);
app.use('/like', likesRoutes);
// swiping endpoint:
app.use('/swiping', swipingRoutes);
//notifications
app.use('/notifications', notificationsRoutes);
//everything about logins and register and all : 
app.use('/message-rooms', messageRoom);
app.use('/messages', messages);
app.use('/partner', partnerRoutes);
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if(user){
      console.log("THERE ONE ")
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
    console.log('Generated token:', token);
    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//app backend
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// WebSocket server
//changestream start
// MongoDB change stream event listener
/* const changeStream = db.watch();
changeStream.on('change', async (change) => {
    // Check if the change event is an insertion and related to messages collection
    if (change.operationType === 'insert' && change.ns.coll === 'messages') {
        try {
            // Extract the new message from the change event
            const newMessage = change.fullDocument;

            // Emit the new message to the specific chat room
            io.to(newMessage.chatId).emit('message:' + newMessage.chatId, { 
                message: newMessage.message, 
                senderId: newMessage.senderId, 
                recipientId: newMessage.recipientId, 
                createdAt: newMessage.createdAt 
            });
        } catch (error) {
            console.error('Error emitting new message:', error);
        }
    }
}); */

//changestream end


const connectedClients = {};
// Function to add user to connectedClients
async function isInChatRoom(chatId, userId) {
  try {
    // Get the sids map from the adapter
    const sidsMap = io.sockets.adapter.sids;
    // Find the socket ID of the recipient based on their user ID
    const recipientSocketId = Object.keys(connectedClients).find(socketId => connectedClients[socketId].userId === userId);
    // If recipientSocketId is not found, the user is not connected
    if (!recipientSocketId) {
      return false;
    }
    // Check if the recipient's socket ID is in the specified chat room
    const roomIds = sidsMap.get(recipientSocketId);
    return roomIds.has(chatId);
  } catch (error) {
    console.error('Error checking if user is in chat room:', error);
    return false;
  }
}

function generateChatId(user1Id, user2Id) {
  return [user1Id, user2Id].sort().join('_'); // Concatenate user IDs and sort them to ensure consistency
}

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle when a user joins the chat
  socket.on('join', async (data) => {
    const { userId, chatId } = data;
    connectedClients[socket.id] = { userId, chatId };
    console.log(`User ${userId} joined chat ${chatId}`);
    console.log(socket.id, " socket id of", userId);
    console.log(connectedClients[socket.id], " socket id of", userId);
    // Retrieve previous messages from the database
    try {
      const messages = await Message.find({ chatId });
      socket.emit('previousMessages', messages);

    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }

    socket.join(chatId); // Join the room corresponding to the chatId
  });

  // Handle when a user disconnects from the chat
  socket.on('disconnect', () => {
    if (connectedClients[socket.id]) {
      const { userId, chatId } = connectedClients[socket.id];
      delete connectedClients[socket.id];
      socket.leave(chatId); // Remove the user from the room
      console.log(`User ${userId} left chat from disconnect ${chatId}`);
    }
  });
  socket.on('leave-chat', (chatId) => {
    if (connectedClients[socket.id]) {
      const { userId } = connectedClients[socket.id];
      delete connectedClients[socket.id];
      socket.leave(chatId); // Remove the user from the room
      console.log(`User ${userId} left chat ${chatId}`);
    }
  });

  // Handle sending a message in a room
// Handle sending a message in a room
socket.on('sendMessage', async (data) => {
  const { message, senderId, recipientId } = data;
  const chatId = generateChatId(senderId, recipientId);
  
  try {
    //const isInRoom = isInChatRoom(chatId, recipientId);
    const isInRoom = await isInChatRoom(chatId, recipientId);
    console.log(isInRoom, " is the recipient here? ");
    // Check if the match exists between sender and recipient
    let match = await Match.findOne({ users: { $all: [senderId, recipientId] } });
    if (!match) {
      match = new Match({ users: [senderId, recipientId] });
      await match.save();
    }

    // Save the message in the database
    const newMessage = new Message({ message, senderId, recipientId, chatId, readBy: [] });
    await newMessage.save();

    // Emit the message to the specific chat room
    io.to(chatId).emit('message:' + chatId, { message: newMessage.message,
                                              senderId:newMessage.senderId,
                                              recipientId:newMessage.recipientId,
                                              createdAt:newMessage.createdAt,
                                              isInChatRoom: isInRoom });
    console.log(`Sending message to chat ${chatId} and ${recipientId} is in chat ? :${isInRoom}`);

    // Acknowledge that the message was sent successfully
    socket.emit('messageSent', { success: true, message: 'Message sent successfully', isInChatRoom: isInRoom });
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('messageSent', { success: false, message: 'Failed to send message' });
  }
});
socket.on('messageRead', async (chatId, recipientId) => {
  try {
    // Find the latest message in the chat
    const latestMessage = await Message.findOne({ chatId }).sort({ createdAt: -1 });

    // If there's a latest message and it's not already read by the user
    console.log(latestMessage, 'latestMessage');
    if (latestMessage && latestMessage.recipientId.toString() === recipientId && !latestMessage.readBy.includes(recipientId)) {
      // Mark the message as read by adding the userId to the readBy array
      const senderSocketId = latestMessage.senderId.toString();
      latestMessage.readBy.push(recipientId);
      await latestMessage.save();
      //io.to(senderSocketId).emit('messageReadByRecipient', latestMessage);
      console.log(`Message ${latestMessage._id} marked as read by the recipient! ${recipientId}`);
    } else {
      console.log(`Message in chat ${latestMessage._id} ${chatId} already read by user ${recipientId} or means it's the sender.`);
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
});
// Optionally, you can emit an event to inform the sender that their message has been read
      // io.to(senderSocketId).emit('messageReadByRecipient', messageId);
});

const socketPort = 3001; // Choose a different port for Socket.IO server
http.listen(socketPort, () => {
  console.log(`WebSocket Server is running on port ${socketPort}`);
});
