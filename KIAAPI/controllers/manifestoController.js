const db = require('../models');
const { Manifiesto, Residuo, Empleado, Proveedor, Manejo, Proceso, Container, Elemento, Material_type } = db;

// 📝 Crear manifiesto
exports.crearManifiesto = async (req, res) => {
  const {
    id_material_type,
    cantidad,
    id_empleado,
    id_proveedor_destino,
    id_proveedor_transporte,
    id_manejo,
    id_proceso,
    id_container_type,
    fecha_emision
  } = req.body;

  try {
    const [
      materialType,
      empleado,
      proveedorDestino,
      proveedorTransporte,
      manejo,
      proceso,
      contenedor
    ] = await Promise.all([
      db.Material_type.findByPk(id_material_type),
      db.Empleado.findByPk(id_empleado),
      db.Proveedor.findByPk(id_proveedor_destino),
      db.Proveedor.findByPk(id_proveedor_transporte),
      db.Manejo.findByPk(id_manejo),
      db.Proceso.findByPk(id_proceso),
      db.Container.findByPk(id_container_type)
    ]);

    if (!materialType || !empleado || !proveedorDestino || !proveedorTransporte || !manejo || !proceso || !contenedor) {
      return res.status(400).json({ error: 'Uno o más datos son inválidos' });
    }

    const nuevoResiduo = await db.Residuo.create({
      id_material_type,
      cantidad,
      fecha_generacion: new Date()
    });

    const elementosLigados = await materialType.getElementos(); 
    await nuevoResiduo.setElementos(elementosLigados.map(e => e.id_elemento));

    const nuevoManifiesto = await db.Manifiesto.create({
      id_residuo: nuevoResiduo.id_residuo,
      id_empleado,
      id_proveedor_destino,
      id_proveedor_transporte,
      id_manejo,
      id_proceso,
      id_container_type,
      fecha_emision: fecha_emision || null
    });

    const manifiestoCompleto = await db.Manifiesto.findByPk(nuevoManifiesto.id_manifiesto, {
      include: [
        { model: db.Residuo, as: 'residuo', attributes: ['fecha_generacion', 'cantidad'], include: [
            { model: db.Material_type, as: 'materialType', attributes: ['name'] },
            { model: db.Elemento, as: 'elementos', attributes: ['elemento'], through: { attributes: [] } }
          ] 
        },
        { model: db.Empleado, as: 'empleado', attributes: ['nombre'] },
        { model: db.Proveedor, as: 'proveedorDestino', attributes: ['nombre', 'autorizacion_semarnat'] },
        { model: db.Proveedor, as: 'proveedorTransporte', attributes: ['nombre', 'autorizacion_semarnat', 'autorizacion_sct'] },
        { model: db.Manejo, as: 'manejo', attributes: ['manejo'] },
        { model: db.Proceso, as: 'proceso', attributes: ['nombre'] },
        { model: db.Container, as: 'container', attributes: ['name'] }
      ]
    });

    res.status(201).json({
      mensaje: 'Manifiesto creado correctamente',
      manifiesto: manifiestoCompleto
    });

  } catch (error) {
    console.error('❌ Error al crear manifiesto:', error);
    res.status(500).json({ error: 'Error al crear el manifiesto' });
  }
};

// 🔁 Cambiar residuo del manifiesto
exports.cambiarResiduoManifiesto = async (req, res) => {
  const { id_manifiesto } = req.params;
  const { id_residuo_nuevo } = req.body;

  try {
    const manifiesto = await db.Manifiesto.findByPk(id_manifiesto);
    if (!manifiesto) {
      return res.status(404).json({ error: 'Manifiesto no encontrado' });
    }

    await manifiesto.update({ id_residuo: id_residuo_nuevo });
    res.status(200).json({ message: 'Residuo del manifiesto actualizado', manifiesto });

  } catch (error) {
    console.error('❌ Error al actualizar residuo:', error);
    res.status(500).json({ error: 'Error al actualizar el manifiesto', details: error.message });
  }
};

// 🔎 Obtener manifiestos (sin filtros, frontend filtrará)
exports.obtenerManifiestos = async (req, res) => {
  try {
    const manifiestos = await Manifiesto.findAll({
      include: [
        {
          model: Residuo,
          as: 'residuo',
          attributes: ['cantidad', 'fecha_generacion'],
          include: [
            { model: Material_type, as: 'materialType', attributes: ['name'] },
            { model: Elemento, as: 'elementos', attributes: ['elemento'], through: { attributes: [] } }
          ]
        },
        { model: Empleado, as: 'empleado', attributes: ['nombre'] },
        { model: Proveedor, as: 'proveedorDestino', attributes: ['nombre', 'autorizacion_semarnat'] },
        { model: Proveedor, as: 'proveedorTransporte', attributes: ['nombre', 'autorizacion_semarnat', 'autorizacion_sct'] },
        { model: Manejo, as: 'manejo', attributes: ['manejo'] },
        { model: Proceso, as: 'proceso', attributes: ['nombre'] },
        { model: Container, as: 'container', attributes: ['name'] }
      ]
    });

    res.json(manifiestos);
  } catch (error) {
    console.error("Error al obtener manifiestos:", error);
    res.status(500).json({ error: "Error al obtener manifiestos" });
  }
};

// ✅ Actualizar fecha_emision de varios manifiestos al exportar
exports.marcarSalida = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Debe enviar una lista de IDs' });
  }

  try {
    const fechaActual = new Date();

    await db.Manifiesto.update(
      { fecha_emision: fechaActual },
      { where: { id_manifiesto: ids } }
    );

    res.json({ mensaje: 'Manifiestos actualizados correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar fecha de emisión:', error);
    res.status(500).json({ error: 'Error al actualizar los manifiestos' });
  }
};
