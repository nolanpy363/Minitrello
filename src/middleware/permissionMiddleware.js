// src/middleware/permissionMiddleware.js

const Workspace = require('../models/Workspace');
const Board = require('../models/Board'); // Podríamos necesitarlo en el futuro

// Este es un "generador de middleware". Es una función que devuelve otra función (el middleware).
// Esto nos permite pasarle los roles permitidos como argumento.
const checkRole = (rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      // Asumimos que el middleware 'protect' ya se ejecutó y tenemos req.user
      const usuario = req.user;
      
      // Necesitamos identificar el workspace sobre el que se está operando.
      // Lo buscamos en los parámetros de la URL.
      const { workspaceId, boardId, listId, cardId } = req.params;

      let workspace;

      if (workspaceId) {
        workspace = await Workspace.findById(workspaceId);
      } else if (boardId) {
        const board = await Board.findById(boardId);
        workspace = await Workspace.findOne({ boards: board._id });
      }
      // Podríamos añadir más lógicas para 'listId' y 'cardId' si fuera necesario
      
      if (!workspace) {
        return res.status(404).json({ message: 'Contexto de espacio de trabajo no encontrado para validar permisos.' });
      }
      
      // Buscamos al usuario en la lista de miembros del workspace
      const miembro = workspace.members.find(m => m.user.equals(usuario._id));

      if (!miembro) {
        return res.status(403).json({ message: 'Acceso denegado. No eres miembro de este espacio de trabajo.' });
      }

      // Comprobamos si el rol del miembro está en la lista de roles permitidos
      if (rolesPermitidos.includes(miembro.role)) {
        next(); // ¡Permiso concedido! Pasa al siguiente middleware o controlador.
      } else {
        return res.status(403).json({ message: `Acceso denegado. Se requiere el rol: ${rolesPermitidos.join(' o ')}.` });
      }

    } catch (error) {
      console.error('Error en la validación de rol:', error);
      res.status(500).json({ message: 'Error interno del servidor al validar permisos.' });
    }
  };
};

module.exports = { checkRole };