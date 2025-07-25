// src/controllers/cardController.js - VERSIÓN FINAL CON MARKMODIFIED

// --- 1. IMPORTACIONES ---
const Card = require('../models/Card');
const List = require('../models/List');
const Workspace = require('../models/Workspace');

// --- 2. FUNCIONES DEL CONTROLADOR ---

// CREAR
const createCardInList = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const { listId } = req.params;
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: 'Lista no encontrada' });
    const card = await Card.create({
      title, description: description || '', list: listId, board: list.board,
      priority: priority || 'Media', dueDate: dueDate || null, isCompleted: false,
    });
    list.cards.push(card._id);
    await list.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarjeta' });
  }
};

// LEER
const getCardsInList = async (req, res) => { /* ... tu código ... */ };

// ACTUALIZAR (VERSIÓN CON MARKMODIFIED)
const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    // Fusiona los campos del body con la tarjeta encontrada.
    Object.assign(card, req.body);

    // FORZAMOS A MONGOOSE A RECONOCER LOS CAMBIOS
    Object.keys(req.body).forEach(key => {
      card.markModified(key);
    });

    const updatedCard = await card.save();
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarjeta' });
  }
};

// MOVER
const moveCard = async (req, res) => { /* ... tu código ... */ };

// ASIGNAR
const assignMemberToCard = async (req, res) => { /* ... tu código ... */ };

// BORRAR
const deleteCard = async (req, res) => { /* ... tu código ... */ };


// --- 3. EXPORTACIONES ---
module.exports = {
  createCardInList,
  getCardsInList,
  updateCard,
  moveCard,
  deleteCard,
  assignMemberToCard,
};