const Proveedor = require('../models/Proveedor');

// Crear un nuevo proveedor (tipo: "Transportista" o "Receptor")
exports.crearProveedor = async (req, res) => {
  try {
    const { nombre, tipo_proveedor, autorizacion_semarnat, fecha_final_contrato, autorizacion_sct, responsable_tecnico } = req.body;

    if (!nombre || !tipo_proveedor) {
      return res.status(400).json({ error: 'Nombre y tipo_proveedor son requeridos' });
    }

     const tiposValidos = ['Transportista', 'Receptora'];
    if (!tiposValidos.includes(tipo_proveedor)) {
      return res.status(400).json({
        error: 'El tipo_proveedor debe ser "Transportista" o "Receptor"'
      });
    }

    const nuevoProveedor = await Proveedor.create({
      nombre,
      tipo_proveedor,
      autorizacion_semarnat,
      fecha_final_contrato,
      autorizacion_sct,
      responsable_tecnico,
    });

    res.status(201).json({ message: 'Proveedor creado correctamente', proveedor: nuevoProveedor });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proveedor', details: error.message });
  }
};

// Actualizar la fecha final de contrato
exports.actualizarFechaFinalContrato = async (req, res) => {
  const { id_proveedor } = req.params;
  const { fecha_final_contrato } = req.body;

  try {
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    await proveedor.update({ fecha_final_contrato });
    res.status(200).json({ message: 'Fecha final de contrato actualizada', proveedor });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la fecha', details: error.message });
  }
};

// Eliminar un proveedor
exports.eliminarProveedor = async (req, res) => {
  const { id_proveedor } = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    await proveedor.destroy();
    res.status(200).json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proveedor', details: error.message });
  }
};

