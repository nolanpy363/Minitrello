const Board = require('../models/Board');
const Workspace = require('../models/Workspace');
const List = require('../models/List');
const Card = require('../models/Card');

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const { workspaceId } = req.params;
    if (!title) return res.status(400).json({ message: 'El título es obligatorio' });
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace no encontrado' });
    if (!workspace.members.some(m => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: 'No tienes permiso para crear tableros aquí.' });
    }
    const board = await Board.create({ title, workspace: workspaceId });
    workspace.boards.push(board._id);
    await workspace.save();
    res.status(201).json(board);
  } catch (error) { res.status(500).json({ message: 'Error al crear tablero' }); }
};

const getBoardsFromWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const boards = await Board.find({ workspace: workspaceId });
    res.status(200).json(boards);
  } catch (error) { res.status(500).json({ message: 'Error al obtener tableros' }); }
};

const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'El título es obligatorio' });
    const board = await Board.findByIdAndUpdate(boardId, { title }, { new: true });
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    res.status(200).json(board);
  } catch (error) { res.status(500).json({ message: 'Error al actualizar tablero' }); }
};

const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    const lists = await List.find({ board: boardId });
    if (lists.length > 0) {
      const listIds = lists.map(l => l._id);
      await Card.deleteMany({ list: { $in: listIds } });
    }
    await List.deleteMany({ board: boardId });
    await Workspace.findByIdAndUpdate(board.workspace, { $pull: { boards: boardId } });
    await Board.findByIdAndDelete(boardId);
    res.status(200).json({ message: 'Tablero y su contenido borrados.' });
  } catch (error) { res.status(500).json({ message: 'Error al borrar tablero' }); }
};

module.exports = { createBoard, getBoardsFromWorkspace, updateBoard, deleteBoard };