const express = require('express');
const router = express.Router();
const { createListInBoard, getListsInBoard, deleteList } = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.post('/boards/:boardId/lists', createListInBoard);
router.get('/boards/:boardId/lists', getListsInBoard);
router.delete('/lists/:listId', deleteList);
module.exports = router;