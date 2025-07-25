// src/controllers/listController.js

const Card = require('../models/Card');
const List = require('../models/List');
const Board = require('../models/Board');

// @desc    Crear una nueva lista en un tablero
// @route   POST /api/boards/:boardId/lists
// @access  Private
const createListInBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const { boardId } = req.params;

    // 1. Validar que el título de la lista viene en la petición
    if (!title) {
      return res.status(400).json({ message: 'El título de la lista es obligatorio' });
    }

    // 2. Verificar que el tablero existe
    // (La comprobación de permisos del usuario sobre el tablero se hereda de la ruta padre,
    // pero una comprobación explícita aquí sería aún más segura. Por ahora lo mantenemos simple).
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Tablero no encontrado' });
    }
    
    // 3. Crear la lista
    const list = await List.create({
      title,
      board: boardId,
    });

    // 4. Añadir el ID de la nueva lista al array 'lists' del tablero
    board.lists.push(list._id);
    await board.save();

    res.status(201).json(list);

  } catch (error) {
    console.error('Error al crear la lista:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Obtener todas las listas de un tablero
// @route   GET /api/boards/:boardId/lists
// @access  Private
const getListsInBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    // 1. Verificar que el tablero existe
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Tablero no encontrado' });
    }

    // 2. Buscar todas las listas que pertenecen a ese tablero
    // Usamos .populate() para que en el futuro podamos traer las tarjetas también
    const lists = await List.find({ board: boardId });

    res.status(200).json(lists);

  } catch (error) {
    console.error('Error al obtener las listas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ... (debajo de getListsInBoard)

// @desc    Borrar una lista y todas sus tarjetas
// @route   DELETE /api/lists/:listId
// @access  Private
const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    const boardId = list.board;

    // 1. Borrado en cascada: Eliminar todas las tarjetas de esta lista
    await Card.deleteMany({ list: listId });

    // 2. Eliminar la lista en sí
    await List.findByIdAndDelete(listId);

    // 3. Quitar la referencia de la lista del tablero padre
    await Board.findByIdAndUpdate(boardId, { $pull: { lists: listId } });

    res.status(200).json({ message: 'Lista y sus tarjetas borradas exitosamente' });

  } catch (error) {
    console.error('Error al borrar la lista:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createListInBoard,
  getListsInBoard,
  deleteList,
};