const { sequelize } = require("./models");

async function verDatosTablaFiltrado(schema, table) {
  const query = `SELECT * FROM "${schema}"."${table}" WHERE fecha_emision IS NULL LIMIT 100`;

  try {
    const [results] = await sequelize.query(query);
    console.log(`📦 Datos de la tabla '${schema}.${table}' (fecha_emision IS NULL):`);
    console.log(results);
    console.table(results);
  } catch (err) {
    console.error("❌ Error al obtener datos:", err);
  } finally {
    await sequelize.close();
  }
}

verDatosTablaFiltrado("kiadb", "manifiesto");
