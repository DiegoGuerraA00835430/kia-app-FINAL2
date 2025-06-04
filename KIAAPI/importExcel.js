const XLSX = require('xlsx');
const path = require('path');
const { Usuario, Proveedor, Manejo, Proceso, Container, Elemento, Residuo, Manifiesto } = require('./models'); // Adjust this line to match your setup

// ---- CONFIGURATION ----
const excelFilePath = path.join(__dirname, 'tu_archivo.xlsx'); // Change the file name!
const defaultEmpleadoId = 1; // Change this or look up by name if needed

// ---- READ EXCEL ----
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

(async () => {
  for (const [i, row] of rows.entries()) {
    try {
      // -- 1. Find foreign keys by name --
      const elemento = await Elemento.findOne({ where: { elemento: row['Elemento'] } });
      if (!elemento) {
        console.warn(`Row ${i + 1}: Elemento "${row['Elemento']}" not found. Skipping.`);
        continue;
      }

      const proceso = await Proceso.findOne({ where: { nombre: row['Área o proceso de generación'] } });
      if (!proceso) {
        console.warn(`Row ${i + 1}: Proceso "${row['Área o proceso de generación']}" not found. Skipping.`);
        continue;
      }

      const container = await Container.findOne({ where: { name: row['Tipo de contenedor'] } });
      if (!container) {
        console.warn(`Row ${i + 1}: Container "${row['Tipo de contenedor']}" not found. Skipping.`);
        continue;
      }

      const proveedorDestino = await Proveedor.findOne({ where: { nombre: row['Nombre Proveedor Destino'] } });
      if (!proveedorDestino) {
        console.warn(`Row ${i + 1}: Proveedor destino "${row['Nombre Proveedor Destino']}" not found. Skipping.`);
        continue;
      }

      const proveedorTransporte = await Proveedor.findOne({ where: { nombre: row['Nombre Proveedor Transporte'] } });
      if (!proveedorTransporte) {
        console.warn(`Row ${i + 1}: Proveedor transporte "${row['Nombre Proveedor Transporte']}" not found. Skipping.`);
        continue;
      }

      const manejo = await Manejo.findOne({ where: { manejo: row['Manejo'] } });
      if (!manejo) {
        console.warn(`Row ${i + 1}: Manejo "${row['Manejo']}" not found. Skipping.`);
        continue;
      }

      // -- 2. Insert into Residuo --
      const residuo = await Residuo.create({
        id_elemento: elemento.id_elemento,
        cantidad: row['Cantidad generada Ton.'],
        fecha_generacion: new Date(row['Fecha de ingreso'])
      });

      // -- 3. Insert into Manifiesto --
      await Manifiesto.create({
        id_residuo: residuo.id_residuo,
        id_empleado: defaultEmpleadoId, // Change or lookup as needed
        id_proveedor_destino: proveedorDestino.id_proveedor,
        id_proveedor_transporte: proveedorTransporte.id_proveedor,
        id_manejo: manejo.id_manejo,
        id_proceso: proceso.id_proceso,
        id_container_type: container.id_container_type,
        fecha_emision: new Date() // Or from Excel if needed
      });

      console.log(`Row ${i + 1}: Imported successfully.`);
    } catch (err) {
      console.error(`Row ${i + 1}: Error importing:`, err.message);
    }
  }
  console.log('All rows processed!');
  process.exit(0);
})();
