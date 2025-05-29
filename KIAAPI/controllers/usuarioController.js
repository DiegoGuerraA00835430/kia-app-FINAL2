const Usuario = require('../models/Usuario');
const Empleado = require('../models/Usuario');


// Eliminar
exports.eliminarUsuario = async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.status(204).send();
};

//Get Usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      attributes: ['id_empleado', 'nombre', 'cargo', 'numero_empleado']
    });

    console.log("Empleados encontrados:", empleados);

    const empleadosFormateados = empleados.map(e => ({
      id: e.numero_empleado,
      nombre: e.nombre,
      cargo: e.cargo,
      
    }));

    res.json(empleadosFormateados);
  } catch (error) {
    console.error("🔥 ERROR DETALLADO:", error); 
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

