const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');
const Notification = require('../models/Notification');

const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });
    const workspace = await Workspace.create({
      name, description: description || '', owner: req.user._id,
      members: [{ user: req.user._id, role: 'Owner' }]
    });
    res.status(201).json({ message: 'Workspace creado', workspace });
  } catch (error) { res.status(500).json({ message: 'Error al crear workspace' }); }
};

// --- FUNCIÓN CORREGIDA Y DEFINITIVA ---
const getWorkspaces = async (req, res) => {
  try {
    // La consulta correcta: busca en el array 'members' un objeto cuyo campo 'user' sea el ID del usuario actual.
    const workspaces = await Workspace.find({ 'members.user': req.user._id })
        .populate('owner', 'username email')
        .populate('members.user', 'username email');
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener workspaces' });
  }
};
// ------------------------------------

const addMemberToWorkspace = async (req, res) => {
    // ... tu código existente
};
const deleteWorkspace = async (req, res) => {
    // ... tu código existente
};

module.exports = { createWorkspace, getWorkspaces, addMemberToWorkspace, deleteWorkspace };