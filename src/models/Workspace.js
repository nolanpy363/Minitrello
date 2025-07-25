// src/models/Workspace.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkspaceSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre del espacio de trabajo es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  // --- Relaciones Clave ---
  owner: {
    type: Schema.Types.ObjectId, // Almacena el ID de un usuario
    ref: 'User', // Referencia al modelo 'User'
    required: true,
  },
  members: [{
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['Owner', 'Collaborator'],
    default: 'Collaborator',
    required: true,
  },
  _id: false // Evita que Mongoose cree un _id para cada subdocumento de miembro
}],
  // Boards que pertenecen a este workspace (se llenará más tarde)
  boards: [{
    type: Schema.Types.ObjectId,
    ref: 'Board',
  }],
}, {
  timestamps: true,
});


const Workspace = mongoose.model('Workspace', WorkspaceSchema);

module.exports = Workspace;