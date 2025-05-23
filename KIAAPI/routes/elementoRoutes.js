const express = require('express');
const router = express.Router();
const elementoController = require('../controllers/elementoController');

router.put('/actualizar-fecha', elementoController.actualizarFechaCambio);

module.exports = router;