const { sequelize } = require("./models");

async function verTodasLasTablas(schema) {
  const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = $1
  `;

  try {
    const [result] = await sequelize.query(query, {
      bind: [schema]
    });
    console.log(`📄 Tablas en el esquema '${schema}':`);
    console.table(result);
  } catch (error) {
    console.error("❌ Error al obtener las tablas:", error);
  } finally {
    await sequelize.close();
  }
}

verTodasLasTablas("kiadb, manifiesto_temp");
