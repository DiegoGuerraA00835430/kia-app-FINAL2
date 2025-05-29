const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

// Lista todos los usuarios
router.get('/', usuarioController.getUsuarios);

module.exports = router;
