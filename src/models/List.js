// src/models/List.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título de la lista es obligatorio'],
    trim: true,
  },
  // --- Relación Clave ---
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board', // Referencia al tablero al que pertenece
    required: true,
  },
  // Tarjetas que pertenecen a esta lista
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Card',
  }],
}, {
  timestamps: true,
});

const List = mongoose.model('List', ListSchema);

module.exports = List;