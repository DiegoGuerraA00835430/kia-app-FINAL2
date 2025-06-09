const XLSX = require('xlsx');
const path = require('path');
const db = require('./models');
const { Empleado, Proveedor, Manejo, Proceso, Container, Elemento, Residuo, Material_type } = db;
const { Op } = require('sequelize');

console.log('Loaded models:', Object.keys(db));

// Ruta del Excel
const excelFilePath = path.join(__dirname, 'Bitacora RPS  2024 (4).xlsx');

// Leer Excel
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Función para parsear fechas de Excel
function parseExcelDate(value) {
  if (typeof value === 'number') {
    const { y, m, d } = XLSX.SSF.parse_date_code(value);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    const table = db.Manifiesto.getTableName();
    console.log('🔎 Manifiesto se mapeará como:', table);

    const test = await db.Manifiesto.findOne({ raw: true });
    console.log('✅ Manifiesto accesible. Primera fila:', test || 'Vacío');
  } catch (err) {
    console.error('❌ Error al conectar o acceder a Manifiesto:', err.message);
    process.exit(1);
  }

  for (const [i, row] of rows.entries()) {
    const transaction = await db.sequelize.transaction();
    try {
      const elementoStrings = row['Tipo Elemento']?.split(',').map(e => e.trim()) ?? [];
      const elementosEncontrados = await Elemento.findAll({
        where: {
          [Op.or]: elementoStrings.map(e => ({
            elemento: { [Op.iLike]: e }
          }))
        }
      });

      const procesoName = row['Area o proceso de generacion']?.trim();
      if (!procesoName) {
        console.warn(`Row ${i + 1}: Missing proceso name. Skipping.`);
        await transaction.rollback();
        continue;
      }
      const proceso = await Proceso.findOne({ where: { nombre: procesoName } });
      if (!proceso) {
        console.warn(`Row ${i + 1}: Proceso "${procesoName}" not found. Skipping.`);
        await transaction.rollback();
        continue;
      }

      const containerName = row['tipo_contenedor']?.trim();
      if (!containerName) {
        console.warn(`Row ${i + 1}: Missing container type. Skipping.`);
        await transaction.rollback();
        continue;
      }
      const container = await Container.findOne({ where: { name: containerName } });
      if (!container) {
        console.warn(`Row ${i + 1}: Container "${containerName}" not found. Skipping.`);
        await transaction.rollback();
        continue;
      }

      const proveedorDestinoName = row['Destinatario']?.trim();
      if (!proveedorDestinoName) {
        console.warn(`Row ${i + 1}: Missing proveedor destino. Skipping.`);
        await transaction.rollback();
        continue;
      }
      const proveedorDestino = await Proveedor.findOne({ where: { nombre: proveedorDestinoName } });
      if (!proveedorDestino) {
        console.warn(`Row ${i + 1}: Proveedor destino "${proveedorDestinoName}" not found. Skipping.`);
        await transaction.rollback();
        continue;
      }

      const proveedorTransporteName = row['transportista']?.trim();
      if (!proveedorTransporteName) {
        console.warn(`Row ${i + 1}: Missing proveedor transporte. Skipping.`);
        await transaction.rollback();
        continue;
      }
      const proveedorTransporte = await Proveedor.findOne({ where: { nombre: proveedorTransporteName } });
      if (!proveedorTransporte) {
        console.warn(`Row ${i + 1}: Proveedor transporte "${proveedorTransporteName}" not found. Skipping.`);
        await transaction.rollback();
        continue;
      }

      const manejoName = row['Art. 71 fracción I inciso (e)']?.trim();
      if (!manejoName) {
        console.warn(`Row ${i + 1}: Missing manejo. Skipping.`);
        await transaction.rollback();
        continue;
      }
      const manejo = await Manejo.findOne({ where: { manejo: manejoName } });
      if (!manejo) {
        console.warn(`Row ${i + 1}: Manejo "${manejoName}" not found. Skipping.`);
        await transaction.rollback();
        continue;
      }

      const materialName = row['nombre_residuo']?.trim();
      if (!materialName) {
        console.warn(`Row ${i + 1}: Missing material name. Skipping.`);
        await transaction.rollback();
        continue;
      }
      const materialType = await Material_type.findOne({ where: { name: materialName } });
      if (!materialType) {
        console.warn(`Row ${i + 1}: MaterialType "${materialName}" not found. Skipping.`);
        await transaction.rollback();
        continue;
      }

      let cantidad = row['Cantidad generada Ton.'];
      if (typeof cantidad === 'string') {
        cantidad = cantidad.trim().replace(',', '.');
      }
      cantidad = parseFloat(cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        console.warn(`Row ${i + 1}: cantidad inválida (${row['Cantidad generada Ton.']}). Skipping.`);
        await transaction.rollback();
        continue;
      }

      const fechaGeneracion = parseExcelDate(row['Fecha de ingreso']);
      if (!fechaGeneracion) {
        console.warn(`Row ${i + 1}: Fecha de ingreso inválida: ${row['Fecha de ingreso']}. Skipping.`);
        await transaction.rollback();
        continue;
      }

      const residuo = await Residuo.create({
        id_material_type: materialType.id_material_type,
        cantidad,
        fecha_generacion: fechaGeneracion
      }, { transaction });

      await residuo.setElementos(elementosEncontrados.map(e => e.id_elemento), { transaction });

      const fechaEmision = parseExcelDate(row['Fecha de salida']);
      if (!fechaEmision) {
        console.warn(`Row ${i + 1}: Fecha de salida inválida: ${row['Fecha de salida']}. Skipping.`);
        await transaction.rollback();
        continue;
      }

      await db.Manifiesto.schema('kiadb').create({
        id_residuo: residuo.id_residuo,
        id_empleado: 50,
        id_proveedor_destino: proveedorDestino.id_proveedor,
        id_proveedor_transporte: proveedorTransporte.id_proveedor,
        id_manejo: manejo.id_manejo,
        id_proceso: proceso.id_proceso,
        id_container_type: container.id_container_type,
        fecha_emision: fechaEmision
      }, { transaction });

      await transaction.commit();
      console.log(`Row ${i + 1}: Imported successfully.`);
    } catch (err) {
      await transaction.rollback();
      console.error(`Row ${i + 1}: Error importing:`, err.message);
    }
  }

  console.log('✅ All rows processed!');
  process.exit(0);
})();
