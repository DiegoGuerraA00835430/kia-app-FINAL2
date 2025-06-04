const Usuario = require('../models/Usuario');
const Empleado = require('../models/Usuario');



//Get Usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      attributes: ['id_empleado', 'nombre', 'cargo', 'numero_empleado']
    });

    console.log("Empleados encontrados:", empleados);

    const empleadosFormateados = empleados.map(e => ({
      numero_empleado: e.numero_empleado,
      nombre: e.nombre,
      cargo: e.cargo,
      
    }));

    res.json(empleadosFormateados);
  } catch (error) {
    console.error("🔥 ERROR DETALLADO:", error); 
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

//Crear User
exports.crearUsuario = async (req, res) => {
  try {
    console.log("📥 Datos recibidos:", req.body);  // Añade esto
    const nuevo = await Empleado.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);  // IMPORTANTE
    res.status(400).json({ error: 'Error al crear el usuario' });
  }
};

//Delete User
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await Empleado.destroy({ where: { numero_empleado: id } });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};