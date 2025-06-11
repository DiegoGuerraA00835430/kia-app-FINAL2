const { sequelize } = require('./models');  // como estás en la raíz, path directo

async function renombrarColumna() {
  try {
    await sequelize.query(`
      ALTER TABLE kiadb.manifiesto_temp
      RENAME COLUMN "Área o proceso de generación" TO "Fecha de ingreso";
    `);
    console.log("✅ Columna renombrada correctamente.");
  } catch (error) {
    console.error("❌ Error al renombrar la columna:", error);
  } finally {
    await sequelize.close();
  }
}

renombrarColumna();
