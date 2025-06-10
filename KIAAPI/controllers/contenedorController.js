const db = require("../models");
const Container = db.Container;

exports.obtenerContenedores = async (req, res) => {
  try {
    const contenedores = await Container.findAll({
      attributes: ["name", "capacidad"]
    });
    res.json(contenedores);
  } catch (error) {
    console.error("❌ Error al obtener contenedores:", error);
    res.status(500).json({ error: "No se pudieron obtener los contenedores" });
  }
};