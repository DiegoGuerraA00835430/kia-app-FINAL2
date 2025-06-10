const db = require("../models");

/**
 * POST /api/manifiesto-temporal
 * Guarda una fila en la tabla temporal (edición previa al manifiesto final)
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
 * Guarda un nuevo manifiesto (documento) final con todas las filas de manifiesto_temp,
 * y luego borra la tabla temporal.
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

    const documento = await db.Documento.create({
      numero,
      ruta_excel: `/archivos/${numero}.xlsx`,
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
      numero,
      id_documento: documento.id
    });

  } catch (error) {
    await t.rollback();
    console.error("❌ Error al guardar documento final:", error);
    res.status(500).json({ error: "No se pudo guardar el documento final" });
  }
};
