const express = require("express");
const router = express.Router();
const db = require("../models"); // ✅ Aquí está la solución
const documentoController = require("../controllers/documentoController");

// GET /api/manifiesto-temporal
router.get("/manifiesto-temporal", async (req, res) => {
  try {
    const filas = await db.ManifiestoTemp.findAll();
    res.json(filas);
  } catch (error) {
    console.error("❌ Error al obtener filas temporales:", error);
    res.status(500).json({ error: "No se pudo obtener la tabla temporal" });
  }
});

router.post("/manifiesto-temporal", documentoController.guardarFilaTemporal);
router.post("/documento-final", documentoController.guardarDocumentoFinal);

module.exports = router;
