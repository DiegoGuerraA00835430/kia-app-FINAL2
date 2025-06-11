const { Residuo, Manifesto } = require('../models'); // Ajusta la ruta si es necesario

// PUT /api/residuos/:id_residuo
exports.actualizarResiduo = async (req, res) => {
  const { id_residuo } = req.params;
  const nuevosDatos = req.body; 

  try {
    const residuo = await Residuo.findByPk(id_residuo);
    if (!residuo) {
      return res.status(404).json({ error: 'Residuo no encontrado' });
    }

    await residuo.update(nuevosDatos);
    res.status(200).json({ message: 'Residuo actualizado', residuo });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el residuo', details: error.message });
  }
};

exports.getElementosPorMaterialType = async (req, res) => {
  const { id_material_type } = req.params;

  try {
    const materialType = await db.Material_type.findByPk(id_material_type, {
      include: [
        {
          model: db.Elemento,
          as: 'elementos',
          attributes: ['id_elemento', 'elemento'],
          through: { attributes: [] }
        }
      ]
    });

    if (!materialType) {
      return res.status(404).json({ error: 'Material type no encontrado' });
    }

    res.status(200).json(materialType.elementos);
  } catch (error) {
    console.error('❌ Error al obtener elementos:', error);
    res.status(500).json({ error: 'Error al obtener elementos' });
  }
};