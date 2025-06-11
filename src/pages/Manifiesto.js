import React, { useState } from "react";
import "../App.css";

export default function Manifiesto() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});  // << Nuevo estado para checkboxes

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
  const agregarAFila = async (fila, index) => {
    try {
      const body = {
        nombre: fila.residuo?.materialType?.name || "—",
        cantidad: fila.residuo?.cantidad?.toString() || "0",
        contenedor: fila.container?.name || "—",
        peso: "0",   
        codigo: "0"
      };

      const res = await fetch("http://localhost:4002/api/manifiesto-temporal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al guardar fila.");

      // Al agregar, marcar el checkbox de esa fila
      setCheckedRows(prev => ({ ...prev, [index]: true }));

    } catch (error) {
      console.error("Error al enviar fila:", error);
      alert("No se pudo agregar la fila al manifiesto.");
    }
  };

  const generarYMostrarPreview = async () => {
    try {
      const excelResp = await fetch("http://localhost:8000/generar-manifiesto");
      if (!excelResp.ok) throw new Error("Error al generar el manifiesto.");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pdfResp = await fetch("http://localhost:8000/preview-manifiesto");
      if (!pdfResp.ok) throw new Error("Error al generar el PDF.");

      const blob = await pdfResp.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // 🔧 Aquí es donde reseteamos los checkboxes:
      setCheckedRows({});
      
    } catch (err) {
      console.error("Error al exportar manifiesto:", err);
      alert("No se pudo generar el manifiesto.");
    }
  };

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
                <th></th> {/* columna checkbox */}
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
                  <td>
                    <input 
                      type="checkbox" 
                      checked={checkedRows[index] || false}
                      readOnly 
                    />
                  </td>
                  <td>{item.residuo?.materialType?.name || "—"}</td>
                  <td>{item.container?.name || "—"}</td>
                  <td>{item.residuo?.cantidad || "—"}</td>
                  <td>{item.proceso?.nombre || "—"}</td>
                  <td>
                    <button onClick={() => agregarAFila(item, index)}>
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
