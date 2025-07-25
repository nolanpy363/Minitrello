// src/models/Card.js - LA VERSIÓN CORRECTA Y FINAL

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  list: { type: Schema.Types.ObjectId, ref: 'List', required: true, index: true },
  board: { type: Schema.Types.ObjectId, ref: 'Board', required: true, index: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
  // --- LOS CAMPOS QUE FALTABAN ---
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  priority: {
    type: String,
    enum: ['Baja', 'Media', 'Alta'],
    default: 'Media',
  },
  // ---------------------------------

}, {
  timestamps: true,
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;