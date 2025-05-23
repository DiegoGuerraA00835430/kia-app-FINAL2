
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middleware/verificarToken');

router.post('/login', authController.login);
router.post('/registro', authController.crearUsuario);
router.get('/perfil', verificarToken, authController.perfil);

module.exports = router;