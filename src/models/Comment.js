// src/models/Comment.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  // --- Relaciones Clave ---
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;