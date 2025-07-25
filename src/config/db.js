// src/config/db.js - Versión Final y Profesional

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Le decimos que use la variable de entorno que ya sabemos que está bien escrita en el .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error en la conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;