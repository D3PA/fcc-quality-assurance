const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for Personal Library'))
.catch(err => console.log('MongoDB connection error:', err));

module.exports = mongoose;