const express = require('express');
const router = express.Router();
const datosInicialesController = require('../controllers/datosInicialesController');

router.get('/', datosInicialesController.obtenerDatosIniciales);

module.exports = router;