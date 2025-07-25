// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    if (password.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'El correo ya está registrado' });
    const user = await User.create({ username, email, password });
    if (user) {
      res.status(201).json({ message: 'Usuario registrado', user: { id: user._id, username: user.username, email: user.email } });
    } else {
      res.status(400).json({ message: 'Datos inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(200).json({
        message: 'Login exitoso', token,
        user: { id: user._id, username: user.username, email: user.email, theme: user.theme }
      });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) res.status(200).json(user);
    else res.status(404).json({ message: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.username = req.body.username || user.username;
      user.theme = req.body.theme || user.theme;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        theme: updatedUser.theme,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// --- FUNCIÓN NUEVA ---
const logout = (req, res) => {
  res.status(200).json({ message: 'Logout exitoso' });
};

// --- EXPORTACIONES ACTUALIZADAS ---
module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  logout, // <-- Añadido
};