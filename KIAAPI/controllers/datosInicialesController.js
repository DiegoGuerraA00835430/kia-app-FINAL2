const db = require('../models');

exports.obtenerDatosIniciales = async (req, res) => {
  try {
    const [
      materialTypes,
      contenedores,
      procesos,
      manejos,
      proveedores
    ] = await Promise.all([
      db.Material_type.findAll(),
      db.Container.findAll(),
      db.Proceso.findAll(),
      db.Manejo.findAll(),
      db.Proveedor.findAll()
    ]);

    const proveedoresTransporte = proveedores.filter(p => p.tipo_proveedor === 'Transportista');
    const proveedoresDestino = proveedores.filter(p => p.tipo_proveedor === 'Receptora');

    res.json({
      materialTypes,
      contenedores,
      procesos,
      manejos,
      proveedoresTransporte,
      proveedoresDestino
    });

  } catch (error) {
    console.error('Error al obtener datos iniciales:', error);
    res.status(500).json({ error: 'Error al obtener datos iniciales' });
  }
};
