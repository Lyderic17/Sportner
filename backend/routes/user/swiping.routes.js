// swiping.routes.js

const express = require('express');
const router = express.Router();
const UserProfile = require('../../models/userProfile.model');
const Like = require('../../models/likes.model')
// GET endpoint to retrieve user profiles to swipe

router.get('/profiles-to-swipe', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId, 'User ID');

        // Retrieve liked profiles for the specified user
        const likedProfiles = await Like.find({ likerUserId: userId }).distinct('likedUserId');
        console.log(likedProfiles, "Liked Profiles");

         // Now fetch profiles to swipe excluding the liked profiles
         console.log(req.query.sportsInterests, " before it")
    const sportsInterests = req.query.sportsInterests.map(interest => JSON.parse(interest));
    const sportNames = sportsInterests.map(interest => interest.sport);
    const profilesToSwipe = await UserProfile.find({
      'sportsInterests.sport': { $in: sportNames },
      userId: { $nin: likedProfiles } // Exclude liked profiles
    });
    console.log(profilesToSwipe, "Profiles to swipe");

        res.status(200).json(profilesToSwipe);
    } catch (error) {
        console.error('Error fetching liked profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  });

  //GET for only sports that'sit
    router.get('/profiles-by-sport', async (req, res) => {
    try {
      const sport = req.query.sport;
  
      // Fetch profiles based on the specified sport
      const profiles = await UserProfile.find({ 'sportsInterests.sport': sport });
      console.log('Profiles for sport', sport, ':', profiles);
  
      res.status(200).json(profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // POST route to handle like action
router.post('/like', async (req, res) => {
    try {
      const { userId, likedUserId } = req.body;
  
      // Check if the like already exists in the database
      // This depends on your database schema and how you track likes
  
      await UserProfile.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { likedProfiles: likedUserId } }
      );
      res.status(200).json({ message: 'Like saved successfully' });
    } catch (error) {
      console.error('Error saving like:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;
