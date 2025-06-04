const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Crear proveedor
router.post('/create', proveedorController.crearProveedor);

// Actualizar fecha final de contrato
router.put('/:id_proveedor/fecha_final', proveedorController.actualizarFechaFinalContrato);

// Eliminar proveedor
router.delete('/:id_proveedor', proveedorController.eliminarProveedor);

module.exports = router;