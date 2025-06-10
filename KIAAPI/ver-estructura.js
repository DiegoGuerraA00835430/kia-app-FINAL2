const { sequelize } = require("./models");

async function verEstructuraTabla(schema, table) {
  const query = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2
  `;

  try {
    const [result] = await sequelize.query(query, {
      bind: [schema, table]
    });
    console.log(`📄 Columnas de la tabla '${schema}.${table}':`);
    console.table(result);
  } catch (error) {
    console.error("❌ Error al obtener estructura:", error);
  } finally {
    await sequelize.close();
  }
}

verEstructuraTabla("kiadb", "container_type");  // ✅ aquí defines esquema y tabla

