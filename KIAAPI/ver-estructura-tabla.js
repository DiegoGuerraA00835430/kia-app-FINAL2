const { sequelize } = require("./models");

async function verEstructuraTabla(schema, table) {
  const query = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2
  `;

  try {
    const [results] = await sequelize.query(query, {
      bind: [schema, table],
    });
    console.log(`📄 Estructura de la tabla '${schema}.${table}':`);
    console.table(results);
  } catch (err) {
    console.error("❌ Error al obtener estructura:", err);
  } finally {
    await sequelize.close();
  }
}

// 👇 Aquí defines el schema y tabla que quieres inspeccionar:
verEstructuraTabla("kiadb", "manifiesto_temp");
