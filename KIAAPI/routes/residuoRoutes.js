const express = require('express');
const router = express.Router();
const residuoController = require('../controllers/residuoController');

// Actualizar un residuo específico
router.put('/:id_residuo', residuoController.actualizarResiduo);
router.get('/material-type/:id_material_type/elementos', residuoController.getElementosPorMaterialType);

module.exports = router;