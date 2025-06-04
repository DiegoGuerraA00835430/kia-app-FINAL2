const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

// Lista todos los usuarios
router.get('/', usuarioController.getUsuarios);
//Crear
router.post('/', usuarioController.crearUsuario);
//Delete
router.delete('/:id', usuarioController.eliminarUsuario);


module.exports = router;