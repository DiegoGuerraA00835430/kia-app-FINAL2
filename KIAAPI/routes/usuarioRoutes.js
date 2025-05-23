const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

module.exports = router;
