const { sequelize } = require("./models");

async function verDatosTabla(schema, table) {
  const query = `SELECT * FROM "${schema}"."${table}" LIMIT 100`;

  try {
    const [results] = await sequelize.query(query);
    console.log(`📦 Datos de la tabla '${schema}.${table}':`);
    console.table(results);
  } catch (err) {
    console.error("❌ Error al obtener datos:", err);
  } finally {
    await sequelize.close();
  }
}

verDatosTabla("kiadb", "container_type");
