// src/models/Board.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título del tablero es obligatorio'],
    trim: true,
  },
  // --- Relación Clave ---
  workspace: {
    type: Schema.Types.ObjectId,
    ref: 'Workspace', // Referencia al workspace al que pertenece
    required: true,
  },
  // Listas que pertenecen a este tablero (se llenará más tarde)
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'List',
  }],
}, {
  timestamps: true,
});

const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;