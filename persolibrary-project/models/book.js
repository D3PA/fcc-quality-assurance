'use strict';
require('../db/connection');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  comments: [{ 
    type: String 
  }],
  commentcount: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: false 
});

module.exports = mongoose.model('Book', bookSchema);