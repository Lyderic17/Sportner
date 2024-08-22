const express = require('express');
const router = express.Router();
const passport = require('../../passport');

// Signup route
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/signup',
  failureRedirect: '/signup',
  failureFlash: true
}));

// Login route
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/signup',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
