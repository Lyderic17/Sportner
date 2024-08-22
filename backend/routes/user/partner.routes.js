// routes/partners.js

const express = require('express');
const router = express.Router();
const PartnerRequest = require('../../models/partnerRequest.model')
const UserProfile = require('../../models/userProfile.model');
// POST request to create a new partner request
router.post('/requests', async (req, res) => {
  try {
    const { userId, sport, dateTime, location, additionalInfo } = req.body;

    // Create a new partner request
    const newRequest = new PartnerRequest({
      userId,
      sport,
      dateTime,
      location,
      additionalInfo
    });

    // Save the new request to the database
    await newRequest.save();

    res.status(201).json({ message: 'Partner request created successfully' });
  } catch (error) {
    console.error('Error creating partner request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET request to fetch all partner requests
router.get('/requests', async (req, res) => {
  try {
    // Fetch all partner requests and populate the userId field
    const requests = await PartnerRequest.find().populate('userId').lean();

    // Extract user IDs from partner requests
    const userIds = requests.map(request => request.userId);

    // Query UserProfile model to get usernames and profile pictures
    const profiles = await UserProfile.find({ userId: { $in: userIds } }, 'userId username profilePicture').lean();

    // Map user profiles by user ID
    const userProfileMap = {};
    profiles.forEach(profile => {
      userProfileMap[profile.userId] = {
        username: profile.username,
        profilePicture: profile.profilePicture
      };
    });

    // Map through the requests and add username and profile picture
    const modifiedRequests = requests.map(request => ({
      ...request,
      userId: request.userId._id, // Extracting only the _id property
      username: userProfileMap[request.userId._id].username,
      profilePicture: userProfileMap[request.userId._id].profilePicture
    }));

    res.json(modifiedRequests);
    console.log(requests, " first");
    console.log(modifiedRequests, " second modifieyee");
  } catch (error) {
    console.error('Error fetching partner requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
