// auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const UserProfile = require('../../models/userProfile.model');
const secretKey = 'SecretKeyManual';

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    // Check if the email is already registered
   /*  const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email address is already registered' });
    } */

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function login(req, res) {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Define the controller function
  async function getSportList(req, res) {
    try {
      const userId = req.params.userId; // Retrieve the user ID from the request parameters
  
      // Find the user profile for the specified user ID
      const userProfile = await UserProfile.findOne({ userId }, 'sportsInterests');
  
      if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      // Extract sports interests from the user profile
    const sportsInterests = userProfile.sportsInterests.map(interest => ({
      sport: interest.sport,
      level: interest.level
    }));
      console.log(sportsInterests, " userporifle here");
      console.log(sportsInterests," and its sprots");
      // Return the sports interests of the user as a response
      res.status(200).json(sportsInterests);
    } catch (error) {
      // If an error occurs, return an error response
      console.error('Error fetching sports:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = { register, login, getSportList };
