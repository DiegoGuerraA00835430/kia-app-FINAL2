const express = require('express');
const router = express.Router();
const manifestoController = require('../controllers/manifestoController');

router.post('/crearManifiesto', manifestoController.crearManifiesto);
router.put('/:id_manifiesto/residuo', manifestoController.cambiarResiduoManifiesto);
router.get('/manifiestos', manifestoController.obtenerManifiestos);
router.put('/manifiestos/marcarSalida', manifestoController.marcarSalida);

module.exports = router;
