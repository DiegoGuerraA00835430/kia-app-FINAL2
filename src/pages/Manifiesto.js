import React, { useState } from "react";
import "../App.css";

export default function Manifiesto() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});

  // Obtener datos con fecha_emision null desde KIAAPI
  const crearManifiesto = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch("http://localhost:4002/api/manifiestos");
      const data = await resp.json();
      const filtrados = data.filter(item => item.fecha_emision === null);
      setDatosFiltrados(filtrados);
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setError("No se pudieron cargar los residuos.");
    } finally {
      setLoading(false);
    }
  };

  // Enviar fila al backend KIAAPI (tabla temporal)
  const agregarAFila = async (fila, index) => {
    try {
      setLoading(true);
      setError(null);
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
      setError("No se pudo agregar la fila al manifiesto.");
    } finally {
      setLoading(false);
    }
  };

  const generarYMostrarPreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const excelResp = await fetch("http://localhost:8000/generar-manifiesto");
      if (!excelResp.ok) throw new Error("Error al generar el manifiesto.");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pdfResp = await fetch("http://localhost:8000/preview-manifiesto");
      if (!pdfResp.ok) throw new Error("Error al generar el PDF.");

      const blob = await pdfResp.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Reset checkboxes after successful generation
      setCheckedRows({});
      
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudo generar el manifiesto o la vista previa.");
    } finally {
      setLoading(false);
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
    <main className="content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Manifiesto de Residuos</h1>
        </div>

        <div className="manifiesto-content">
          <div className="manifiesto-actions">
            <button 
              className="action-button primary"
              onClick={crearManifiesto}
              disabled={loading}
            >
              <div className="button-content">
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="button-icon">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                    <span>Crear Manifiesto</span>
                  </>
                )}
              </div>
            </button>

            {datosFiltrados.length > 0 && (
              <button 
                className="action-button primary"
                onClick={generarYMostrarPreview}
                disabled={loading}
              >
                <div className="button-content">
                  {loading ? (
                    <>
                      <div className="button-spinner"></div>
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="button-icon">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                      <span>Generar Vista Previa</span>
                    </>
                  )}
                </div>
              </button>
            )}

            {previewUrl && (
              <button 
                className="action-button secondary"
                onClick={descargarExcel}
              >
                <div className="button-content">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="button-icon">
                    <path d="M4 4v16h16" />
                    <path d="M4 16l6-6 4 4 6-6" />
                  </svg>
                  <span>Descargar Excel</span>
                </div>
              </button>
            )}
          </div>

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {datosFiltrados.length > 0 && (
            <div className="tabla-scroll-wrapper">
              <table className="tabla-manifiesto">
                <thead>
                  <tr>
                    <th></th>
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
                        <button 
                          className="action-button secondary"
                          onClick={() => agregarAFila(item, index)}
                          disabled={checkedRows[index]}
                        >
                          Agregar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {previewUrl && (
            <div className="preview-container">
              <h2 className="preview-title">Vista Previa del Manifiesto</h2>
              <div className="pdf-container">
                <object
                  data={previewUrl}
                  type="application/pdf"
                  className="pdf-preview"
                >
                  <div className="pdf-fallback">
                    <p>Tu navegador no puede mostrar PDFs.</p>
                    <a 
                      href={previewUrl}
                      className="download-link"
                      download="manifiesto.pdf"
                    >
                      Descargar PDF
                    </a>
                  </div>
                </object>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
