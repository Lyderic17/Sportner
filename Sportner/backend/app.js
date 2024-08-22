const express = require('express');
const passport = require('./passport');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const flash = require('connect-flash');
const corsOptions = {
    origin: 'http://localhost:4200', // Remplacez ceci par l'URL de votre application Angular en production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Autoriser l'inclusion des cookies dans les requêtes
  };
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
// Connect to MongoDB
mongoose.connect('mongodb+srv://lydericFoot:Lyd&6b2e09a696f@cluster0.rf6kchl.mongodb.net/Sportner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session middleware
app.use(expressSession({
  secret: 'MySecretKey',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Routes
app.use('/api', require('./routes/api'));
app.use('/user', require('./routes/authentication/user'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
