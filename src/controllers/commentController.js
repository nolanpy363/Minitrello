// src/controllers/commentController.js

const Comment = require('../models/Comment');
const Card = require('../models/Card');
const Workspace = require('../models/Workspace'); // Para validación de permisos

// @desc    Añadir un comentario a una tarjeta
// @route   POST /api/cards/:cardId/comments
// @access  Private
const addCommentToCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { text } = req.body;
    const authorId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: 'El texto del comentario es obligatorio' });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    // --- Validación de Permisos ---
    const workspace = await Workspace.findOne({ boards: card.board });
    if (!workspace || !workspace.members.includes(authorId)) {
        return res.status(403).json({ message: 'No tienes permiso para comentar en esta tarjeta' });
    }
    // ----------------------------

    const comment = await Comment.create({
      text,
      author: authorId,
      card: cardId,
    });

    card.comments.push(comment._id);
    await card.save();

    // Populamos el autor para devolver el nombre de usuario
    await comment.populate('author', 'username email');

    res.status(201).json(comment);

  } catch (error) {
    console.error('Error al añadir comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Obtener todos los comentarios de una tarjeta
// @route   GET /api/cards/:cardId/comments
// @access  Private
const getCommentsFromCard = async (req, res) => {
    try {
        const { cardId } = req.params;

        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Tarjeta no encontrada' });
        }

        // --- Validación de Permisos (similar a la anterior) ---
        const workspace = await Workspace.findOne({ boards: card.board });
        if (!workspace || !workspace.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'No tienes permiso para ver los comentarios de esta tarjeta' });
        }
        // ----------------------------------------------------

        const comments = await Comment.find({ card: cardId })
            .populate('author', 'username email') // Traemos los datos del autor
            .sort({ createdAt: 'asc' }); // Ordenamos del más antiguo al más nuevo

        res.status(200).json(comments);

    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
  addCommentToCard,
  getCommentsFromCard,
};