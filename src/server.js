// src/server.js - Versión Final Corregida para Conexiones de Red

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- 1. IMPORTACIONES ---
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const boardRoutes = require('./routes/boardRoutes');
const listRoutes = require('./routes/listRoutes');
const cardRoutes = require('./routes/cardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// --- 2. CONEXIÓN A DB Y APP ---
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// --- 3. DEFINICIÓN DE RUTAS (CON ORDEN DE PRIORIDAD) ---
app.get('/', (req, res) => res.send('API funcionando'));

app.use('/api/notifications', notificationRoutes);
app.use('/api', authRoutes);
app.use('/api', workspaceRoutes);
app.use('/api', boardRoutes);
app.use('/api', listRoutes);
app.use('/api', cardRoutes);

// --- 4. INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 5001;
// Añadimos '0.0.0.0' para aceptar conexiones desde la red local (necesario en Chromebooks)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en puerto ${PORT} aceptando todas las conexiones`);
});