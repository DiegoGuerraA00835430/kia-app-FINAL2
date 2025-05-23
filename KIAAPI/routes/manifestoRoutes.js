const express = require('express');
const router = express.Router();
const manifestoController = require('../controllers/manifestoController');

router.post('/manifiestos', manifestoController.crearManifiesto);

module.exports = router;