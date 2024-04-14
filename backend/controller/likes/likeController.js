// controllers/likeController.js

const Like = require('../../models/likes.model');
const Match = require('../../models/match.model');
const Notification = require('../../models/notifications.model')
// Controller function for liking a profile
// Controller function for liking a profile
async function likeProfile(req, res) {
    try {
      console.log("getting in likeProfile of like controller,");
      const { userId, likedUserId } = req.body;
  
      // Check if the like already exists
      const existingLike = await Like.findOne({ userId, likedUserId });
  
      if (existingLike) {
        return res.status(400).json({ message: 'You have already liked this profile' });
      }
  
      // Create a new like
      const like = new Like({ likerUserId: userId, likedUserId });
      await like.save();
      console.log(like, " getting like ");
      // Check for a match (mutual like)
      console.log(likedUserId, userId, " oth id")
      const mutualLike = await Like.findOne({ likerUserId: likedUserId, likedUserId: userId });
  
      console.log(mutualLike, " mutualLike")
if (mutualLike) {
      // If there's a mutual like, create a match
      const match = new Match({ users: [userId, likedUserId] });
      await match.save();

      // Create match notifications for both users
      const senderNotificationData = {
        senderId: userId,
        receiverId: likedUserId,
        type: 'match'
      };
      const receiverNotificationData = {
        senderId: likedUserId,
        receiverId: userId,
        type: 'match'
      };

      await createNotification(senderNotificationData);
      await createNotification(receiverNotificationData);
    } else {
      // If it's not a mutual like, just create a like notification for the liked user
      const notificationData = {
        senderId: likedUserId,
        receiverId: userId,
        type: 'like'
      };
      await createNotification(notificationData);
    }
      res.status(201).json({ message: 'Profile liked successfully' });
      
    } catch (error) {
      console.error('Error liking profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  async function createNotification(notificationData) {
    const notification = new Notification(notificationData);
    await notification.save();
  }
// Controller function for getting liked profiles
async function getLikedProfiles(req, res){
  try {
    const userId = req.params.userId;
    console.log(userId, 'userfucking ID')
    // Retrieve liked profiles for the specified user
    const likedProfiles = await Like.find({ likerUserId: userId }).populate('likedUserId');
    console.log(likedProfiles, "here we have all liked maybe ?")
    res.status(200).json(likedProfiles);
  } catch (error) {
    console.error('Error fetching liked profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function for getting matches
async function getMatches(req, res){
  try {
    const userId = req.params.userId;

    // Retrieve matches for the specified user
    const matches = await Match.find({ userId }).populate('matchedUserId');

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {getMatches, getLikedProfiles, likeProfile}