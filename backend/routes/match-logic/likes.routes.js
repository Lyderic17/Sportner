// routes/likeRoutes.js

const express = require('express');
const router = express.Router();
const likeController = require('../../controller/likes/likeController');

// Route for liking a profile
router.post('/like', likeController.likeProfile);

// Route for getting liked profiles
router.get('/liked-profiles/:userId', likeController.getLikedProfiles);

// Route for getting matches
router.get('/matches/:userId', likeController.getMatches);

module.exports = router;
