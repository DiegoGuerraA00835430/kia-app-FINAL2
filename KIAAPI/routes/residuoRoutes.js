const express = require('express');
const router = express.Router();
const residuoController = require('../controllers/residuoController');

// Actualizar un residuo específico
router.put('/:id_residuo', residuoController.actualizarResiduo);

module.exports = router;