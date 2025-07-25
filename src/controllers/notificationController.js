// src/controllers/notificationController.js

const Notification = require('../models/Notification');

// @desc    Obtener las notificaciones del usuario logueado
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username email') // Para saber quién envió la notificación
      .sort({ createdAt: -1 }); // Las más nuevas primero

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

// @desc    Marcar notificaciones como leídas
// @route   PATCH /api/notifications/mark-read
// @access  Private
const markNotificationsAsRead = async (req, res) => {
    try {
        // Marcar todas las notificaciones no leídas del usuario como leídas
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Notificaciones marcadas como leídas' });
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar notificaciones' });
    }
};

module.exports = {
  getMyNotifications,
  markNotificationsAsRead,
};