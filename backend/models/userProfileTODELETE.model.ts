// userProfileSchema.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  age: { type: Number },
  location: { type: String },
  sportsInterests: [{ type: String }],
  bio: { type: String },
  profilePicture: { type: String } // Store file path or URL to profile picture
});

const userProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = userProfile;
