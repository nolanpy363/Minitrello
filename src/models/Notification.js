// src/models/Notification.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  // El usuario que RECIBE la notificación
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // El usuario que REALIZÓ la acción (opcional)
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  // El tipo de notificación
  type: {
    type: String,
    enum: ['workspace_invitation', 'card_assignment', 'new_comment'],
    required: true,
  },
  // El mensaje que se mostrará
  message: {
    type: String,
    required: true,
  },
  // Si la notificación ha sido leída o no
  isRead: {
    type: Boolean,
    default: false,
  },
  // Entidad relacionada (ej. el workspace al que te invitan)
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;