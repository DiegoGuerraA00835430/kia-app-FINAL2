const jwt = require('jsonwebtoken');
const db = require('../models');
const Empleado = db.Empleado;

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("⚠️ No se proporcionó token.");
    return res.status(401).send('Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];
  console.log("🔐 TOKEN:", token);
  console.log("🧪 USANDO JWT_SECRET:", JWT_SECRET);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("🔐 Token decodificado correctamente:", decoded);

    // Buscar el usuario completo en base de datos
    const usuario = await Empleado.findOne({
      where: { numero_empleado: decoded.numero_empleado },
      attributes: ['id_empleado', 'nombre', 'cargo', 'numero_empleado']
    });

    if (!usuario) {
      console.error("❌ Usuario no encontrado en la base de datos.");
      return res.status(404).send('Usuario no encontrado');
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error.message);
    return res.status(401).send('Token inválido');
  }
};