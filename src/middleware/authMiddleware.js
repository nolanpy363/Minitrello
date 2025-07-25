// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Necesitamos el modelo para buscar al usuario

const protect = async (req, res, next) => {
  let token;

  // 1. Verificamos si la cabecera 'Authorization' existe y empieza con 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extraemos el token de la cabecera (quitando la palabra 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificamos la firma del token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Buscamos al usuario por el ID que está dentro del token (el payload)
      // y lo adjuntamos al objeto 'req' para que esté disponible en las rutas protegidas.
      // El '-password' evita que la contraseña hasheada se adjunte al objeto.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // Si el usuario del token ya no existe
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      // 5. Si todo sale bien, llamamos a next() para pasar al siguiente middleware o al controlador
      next();
    } catch (error) {
      console.error('Error de autenticación:', error.message);
      return res.status(401).json({ message: 'No autorizado, el token falló' });
    }
  }

  // Si no hay token en la cabecera
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

module.exports = { protect };