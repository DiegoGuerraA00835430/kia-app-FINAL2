const Usuario = require('../models/Usuario');


// Eliminar
exports.eliminarUsuario = async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.status(204).send();
};
