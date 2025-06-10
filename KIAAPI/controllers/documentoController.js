const db = require("../models");

/**
 * POST /api/manifiesto-temporal
 * Guarda una fila en la tabla temporal
 */
exports.guardarFilaTemporal = async (req, res) => {
  const { nombre, cantidad, contenedor, peso, codigo } = req.body;

  if (!nombre || !cantidad || !contenedor) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    await db.ManifiestoTemp.create({ nombre, cantidad, contenedor, peso, codigo });
    res.status(201).json({ mensaje: "Fila guardada correctamente" });
  } catch (error) {
    console.error("❌ Error al guardar fila temporal:", error);
    res.status(500).json({ error: "No se pudo guardar la fila" });
  }
};

/**
 * POST /api/documento-final
 * Guarda un documento con las filas temporales y las elimina
 */
exports.guardarDocumentoFinal = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const filasTemp = await db.ManifiestoTemp.findAll();

    if (filasTemp.length === 0) {
      return res.status(400).json({ error: "No hay filas temporales para guardar" });
    }

    const year = new Date().getFullYear() % 100;
    const count = await db.Documento.count();
    const numero = `KMX-${year}-${(count + 1).toString().padStart(2, '0')}`;
    const nombre_archivo = `${numero} SAI.xlsx`;

    const documento = await db.Documento.create({
      nombre_archivo,
      ruta_excel: `/archivos/Manifiesto ${nombre_archivo}`,
      ruta_pdf: `/archivos/${numero}.pdf`
    }, { transaction: t });

    for (const fila of filasTemp) {
      await db.ManifiestoFila.create({
        documento_id: documento.id,
        nombre: fila.nombre,
        cantidad: fila.cantidad,
        contenedor: fila.contenedor,
        peso: fila.peso,
        codigo: fila.codigo
      }, { transaction: t });
    }

    await db.ManifiestoTemp.destroy({ where: {}, truncate: true, transaction: t });

    await t.commit();

    res.status(201).json({
      mensaje: "Documento guardado correctamente",
      archivo: nombre_archivo, // ← lo que FastAPI usará
      id_documento: documento.id
    });

  } catch (error) {
    await t.rollback();
    console.error("❌ Error al guardar documento final:", error);
    res.status(500).json({ error: "No se pudo guardar el documento final" });
  }
};


/**
 * GET /api/documentos/ultimo
 * Retorna el nombre_archivo del último documento
 */
exports.obtenerUltimoDocumento = async (req, res) => {
  try {
    const ultimo = await db.Documento.findOne({
      order: [["id", "DESC"]]
    });

    if (!ultimo) {
      return res.status(404).json({ error: "No hay documentos registrados" });
    }

    res.json({ nombre_archivo: ultimo.nombre_archivo });
  } catch (err) {
    console.error("❌ Error en obtenerUltimoDocumento:", err);
    res.status(500).json({ error: "Error al obtener el último documento" });
  }
};

/**
 * GET /api/documentos
 * Retorna todos los documentos con sus rutas
 */
exports.obtenerTodosLosDocumentos = async (req, res) => {
  try {
    const documentos = await db.Documento.findAll({
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "nombre_archivo",
        "ruta_excel",
        "ruta_pdf",
        "fecha_creacion"
      ]
    });

    res.json(documentos);
  } catch (err) {
    console.error("❌ Error al obtener los documentos:", err);
    res.status(500).json({ error: "Error al obtener los documentos" });
  }
};
