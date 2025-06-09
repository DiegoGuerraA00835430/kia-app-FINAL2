const express = require('express');
const router = express.Router();
const manifestoController = require('../controllers/manifestoController');

router.post('/manifiestos', manifestoController.crearManifiesto);
router.put('/:id_manifiesto/residuo', manifestoController.cambiarResiduoManifiesto);
router.get('/manifiestos', manifestoController.obtenerManifiestos);

module.exports = router;