import React, { useState } from "react";
import "../App.css";

export default function Manifiesto() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [datosFiltrados, setDatosFiltrados] = useState([]);

  // Obtener datos con fecha_emision null desde KIAAPI
  const crearManifiesto = async () => {
    try {
      const resp = await fetch("http://localhost:4002/api/manifiestos");
      const data = await resp.json();
      const filtrados = data.filter(item => item.fecha_emision === null);
      setDatosFiltrados(filtrados);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      alert("No se pudieron cargar los residuos.");
    }
  };

  // Enviar fila al backend KIAAPI (tabla temporal)
  const agregarAFila = async (fila) => {
    try {
      const body = {
        nombre: fila.residuo?.materialType?.name || "—",
        cantidad: fila.residuo?.cantidad?.toString() || "0",
        contenedor: fila.container?.name || "—",
        peso: "0",   // puedes ajustarlo si tienes el dato real
        codigo: "0"  // puedes ajustarlo si tienes el dato real
      };

      const res = await fetch("http://localhost:4002/api/manifiesto-temporal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al guardar fila.");
      
    } catch (error) {
      console.error("Error al enviar fila:", error);
      alert("No se pudo agregar la fila al manifiesto.");
    }
  };

  // Vista previa (usa FastAPI para PDF)
const generarYMostrarPreview = async () => {
  try {
    // Paso 1: Generar el archivo Excel en el backend FastAPI
    const excelResp = await fetch("http://localhost:8000/generar-manifiesto");
    if (!excelResp.ok) throw new Error("Error al generar el manifiesto.");

    // Paso 2: Esperar 1 segundo para asegurar que el archivo fue guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Paso 3: Generar el PDF desde el Excel recién creado
    const pdfResp = await fetch("http://localhost:8000/preview-manifiesto");
    if (!pdfResp.ok) throw new Error("Error al generar el PDF.");

    // Paso 4: Mostrar la vista previa del PDF
    const blob = await pdfResp.blob();
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  } catch (err) {
    console.error("Error al exportar manifiesto:", err);
    alert("No se pudo generar el manifiesto.");
  }
};

  // Descargar Excel directamente
  const descargarExcel = () => {
    const a = document.createElement("a");
    a.href = "http://localhost:8000/generar-manifiesto";
    a.download = "Manifiesto KMX-AA-XX SAI.xlsx";
    a.click();
    a.remove();
  };

  return (
    <main className="content manifiesto-container">
      <h1 className="manifiesto-title">Manifiesto de Residuos</h1>

      <button className="manifiesto-btn" onClick={crearManifiesto}>
        Crear Manifiesto
      </button>

      {datosFiltrados.length > 0 && (
        <div className="tabla-scroll-wrapper">
          <table className="tabla-manifiesto">
            <thead>
              <tr>
                <th>Nombre del residuo</th>
                <th>Tipo de contenedor</th>
                <th>Cantidad generada (Ton)</th>
                <th>Área o proceso de generación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((item, index) => (
                <tr key={index}>
                  <td>{item.residuo?.materialType?.name || "—"}</td>
                  <td>{item.container?.name || "—"}</td>
                  <td>{item.residuo?.cantidad || "—"}</td>
                  <td>{item.proceso?.nombre || "—"}</td>
                  <td>
                    <button onClick={() => agregarAFila(item)}>
                      Agregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="manifiesto-btn" onClick={generarYMostrarPreview}>
        Preview
      </button>

      {previewUrl && (
        <>
          <h3>Vista previa PDF</h3>
          <object data={previewUrl} type="application/pdf" className="manifiesto-preview">
            <p>
              Tu navegador no puede mostrar PDFs. <a href={previewUrl}>Descargar PDF</a>
            </p>
          </object>
          <button onClick={descargarExcel}>Descargar Excel</button>
        </>
      )}
    </main>
  );
}
