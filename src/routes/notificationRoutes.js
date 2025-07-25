// src/routes/notificationRoutes.js - Versión Final y Simple
const express = require('express');
const router = express.Router();
const { getMyNotifications, markNotificationsAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Como la ruta base será /api/notifications, esta es la raíz de ese sub-camino
router.get('/', getMyNotifications); 

// Esta será /api/notifications/mark-as-read
router.patch('/mark-as-read', markNotificationsAsRead);

module.exports = router;