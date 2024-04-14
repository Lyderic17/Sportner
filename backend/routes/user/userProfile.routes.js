// userProfileRoutes.js
const express = require('express');
const router = express.Router();
const UserProfile = require('../../models/userProfile.model');
const Match = require('../../models/match.model');
const path = require('path');
const fs = require('fs');

//const authMiddleware = require('../middleware/auth');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Generate unique filename
  }
});
const upload = multer({ storage: storage });

// Create or update user profile
router.post('/profile', upload.single('profilePicture'),  async (req, res) => {
    try {
            // Handle profile picture upload
    let profilePicturePath = ''; // Initialize profile picture path

    // Check if a file was uploaded
    if (req.file) {
      profilePicturePath = req.file.path; // Get the file path
    }
      const { username, age, location, sportsInterests, bio } = req.body;
      const userProfile = await UserProfile.findOneAndUpdate(
        { userId: req.body.userId }, // Assuming userId is included in the request body
        { username, age, location, sportsInterests, bio, profilePicture: profilePicturePath },
        { upsert: true, new: true }
      );
      res.status(200).json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Get user profile
router.get('/:userId/profile', async (req, res) => {
  try {
    
    const userProfile = await UserProfile.findOne({ userId: req.params.userId });
    res.status(200).json(userProfile);
  } catch (error) {
    console.log(req.params," user here");
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define route to serve image files
router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../..', 'uploads', filename); // Adjust the path as per your directory structure
  if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
      console.log(res, " res idk why");
      console.log(imagePath, " full image path");
  } else {
      res.status(404).json({ message: 'File not found' });
  }
});

// Update user profile route with file upload handling
router.put('/:userId/profile', upload.single('profilePicture'), async (req, res) => {
    try {
       // Handle profile picture upload
    let profilePicturePath = ''; // Initialize profile picture path

    // Check if a file was uploaded
    //console.log(req, " hello req")
    if (req.file) {
      profilePicturePath = req.file.path; // Get the file path
    }
      // Other profile data
      const { username, age, location, sportsInterests, bio } = req.body;
      // Update user profile including profile picture path
      const userProfile = await UserProfile.findOneAndUpdate(
        { userId: req.params.userId },
        { username, age, location, sportsInterests, bio, profilePicture: profilePicturePath },
        { upsert: true, new: true }
      );
      res.status(200).json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
// Delete user profile
router.delete('/profile', async (req, res) => {
  try {
    await UserProfile.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch matched users for a specific user
router.get('/:userId/matched-users', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find matches where the user is one of the users in the match
    const matches = await Match.find({ users: userId }).populate('users');
    // Extract matched users from the matches
    const matchedUsers = matches.map(match => {
      // Filter out the current user from the match
      const matchedUser = match.users.find(user => user._id.toString() !== userId);
      return matchedUser;
    });
    console.log(matchedUsers," matched")
    res.json(matchedUsers);
  } catch (error) {
    console.error('Error fetching matched users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user geolocation route
router.put('/:userId/geolocation', async (req, res) => {
  try {
      const { latitude, longitude } = req.body;
      const userId = req.params.userId;
      // Update user profile with geolocation data
      const userProfile = await UserProfile.findOneAndUpdate(
          { userId: userId },
          { $set: { latitude: latitude, longitude: longitude } }, // Update latitude and longitude fields
          { new: true }
      );
      res.status(200).json(userProfile);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
