const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/userSchema');
const bcrypt = require('bcrypt');

passport.use('local-signup', new LocalStrategy({
  usernameField:'username',
  emailField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    console.log("signup done");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return done(null, false, { message: 'Email is already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username: req.body.username,
      email: email,
      password: hashedPassword 
    });

    await newUser.save();

    return done(null, newUser);
  } catch (error) {
    console.log(error, " error while creating ");
  }
}));

passport.use('local-login', new LocalStrategy({
    emailField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });

      
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }
      
  
      const isValidPassword = await bcrypt.compare(password, user.password); // Compare hashed password
      console.log("login done ? ");
      if (!isValidPassword) {
        console.log("login done 222? ");
        return done(null, false, { message: 'Incorrect password' });
      }
      console.log("login done 11? ");
      return done(null, user);
    } catch (error) {
        console.log("login nod done");
      return done(error);
    }
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });


module.exports = passport;