const db = require('../models');

const { Manifiesto, Residuo, Empleado, Proveedor, Manejo, Proceso, Container, Elemento, Material_type } = db;

// 📝 Crear manifiesto
exports.crearManifiesto = async (req, res) => {
  const {
    id_residuo,
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
      residuo,
      empleado,
      proveedorDestino,
      proveedorTransporte,
      manejo,
      proceso,
      contenedor
    ] = await Promise.all([
      db.Residuo.findByPk(id_residuo),
      db.Empleado.findByPk(id_empleado),
      db.Proveedor.findByPk(id_proveedor_destino),
      db.Proveedor.findByPk(id_proveedor_transporte),
      db.Manejo.findByPk(id_manejo),
      db.Proceso.findByPk(id_proceso),
      db.Container.findByPk(id_container_type)
    ]);

    if (!residuo || !empleado || !proveedorDestino || !proveedorTransporte || !manejo || !proceso || !contenedor) {
      return res.status(400).json({ error: 'Uno o más datos son inválidos' });
    }

    const nuevoManifiesto = await db.Manifiesto.create({
      id_residuo,
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
        {
          model: db.Residuo,
          as: 'residuo',
          attributes: ['nombre_residuo', 'fecha_generacion', 'cantidad'],
          include: [
            {
              model: db.Elemento,
              as: 'elementos',
              attributes: ['elemento']
            }
          ]
        },
        {
          model: db.Empleado,
          as: 'empleado',
          attributes: ['nombre']
        },
        {
          model: db.Proveedor,
          as: 'proveedorDestino',
          attributes: ['nombre', 'autorizacion_semarnat']
        },
        {
          model: db.Proveedor,
          as: 'proveedorTransporte',
          attributes: ['nombre', 'autorizacion_semarnat', 'autorizacion_sct']
        },
        {
          model: db.Manejo,
          as: 'manejo',
          attributes: ['manejo']
        },
        {
          model: db.Proceso,
          as: 'proceso',
          attributes: ['nombre']
        },
        {
          model: db.Container,
          as: 'container',
          attributes: ['name']
        }
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

exports.obtenerManifiestos = async (req, res) => {
  try {
    const manifiestos = await Manifiesto.findAll({
      include: [
        {
          model: Residuo,
          as: 'residuo',
          attributes: ['cantidad', 'fecha_generacion'],
          include: [
            {
              model: Material_type,
              as: 'materialType',
              attributes: ['name']
            },
            {
              model: Elemento,
              as: 'elementos',
              attributes: ['elemento'],
              through: { attributes: [] } // Oculta residuo_elemento
            }
          ]
        },
        {
          model: Empleado,
          as: 'empleado',
          attributes: ['nombre']
        },
        {
          model: Proveedor,
          as: 'proveedorDestino',
          attributes: ['nombre', 'autorizacion_semarnat']
        },
        {
          model: Proveedor,
          as: 'proveedorTransporte',
          attributes: ['nombre', 'autorizacion_semarnat', 'autorizacion_sct']
        },
        {
          model: Manejo,
          as: 'manejo',
          attributes: ['manejo']
        },
        {
          model: Proceso,
          as: 'proceso',
          attributes: ['nombre']
        },
        {
          model: Container,
          as: 'container',
          attributes: ['name']
        }
      ]
    });

    res.json(manifiestos);
  } catch (error) {
    console.error("Error al obtener manifiestos:", error);
    res.status(500).json({ error: "Error al obtener manifiestos" });
  }
};
