import React, { useState } from "react";
import "../App.css";

export default function Manifiesto() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});

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

  const agregarAFila = async (fila, index) => {
    try {
      const body = {
        nombre: fila.residuo?.materialType?.name || "—",
        cantidad: fila.residuo?.cantidad?.toString() || "0",
        contenedor: fila.container?.name || "—",
        peso: "0"
      };

      const res = await fetch("http://localhost:4002/api/manifiesto-temporal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al guardar fila.");
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

      setCheckedRows({});
      crearManifiesto();
    } catch (err) {
      console.error("Error al exportar manifiesto:", err);
      alert("No se pudo generar el manifiesto.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manifiesto de Residuos</h1>
      </div>

      <div className="manifiesto-actions">
        <button className="action-button primary" onClick={crearManifiesto}>Crear Manifiesto</button>
        <button className="action-button primary" onClick={generarYMostrarPreview}>Exportar</button>
      </div>

      {datosFiltrados.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Nombre del residuo</th>
                <th>Tipo de contenedor</th>
                <th>Cantidad generada (Ton)</th>
                <th>Fecha de emisión</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((item, index) => (
                <tr key={index}>
                  <td><input type="checkbox" checked={checkedRows[index] || false} readOnly /></td>
                  <td>{item.residuo?.materialType?.name || "—"}</td>
                  <td>{item.container?.name || "—"}</td>
                  <td>{item.residuo?.cantidad || "—"}</td>
                  <td>{item.residuo?.fecha_generacion?.slice(0, 10) || "—"}</td>
                  <td>
                    <button className="action-button secondary" onClick={() => agregarAFila(item, index)}>Agregar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {previewUrl && (
        <div className="preview-container" style={{ marginTop: "2rem" }}>
          <h3 className="preview-title">Vista previa PDF</h3>
          <div className="pdf-container">
            <object data={previewUrl} type="application/pdf" className="pdf-preview">
              <p>Tu navegador no puede mostrar PDFs. <a href={previewUrl}>Descargar PDF</a></p>
            </object>
          </div>
        </div>
      )}
    </div>
  );
}