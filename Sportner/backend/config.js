const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://lydericFoot:Lyd&6b2e09a696f@cluster0.rf6kchl.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
