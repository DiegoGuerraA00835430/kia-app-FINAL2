import React, { useState } from "react";
import "../App.css";

export default function Manifiesto() {
  const [previewUrl, setPreviewUrl] = useState(null);

  const generarYMostrarPreview = async () => {
    try {
      const excelResp = await fetch("http://localhost:8000/generar-manifiesto");
      if (!excelResp.ok) throw new Error("No se pudo generar el Excel.");

      const pdfResp = await fetch("http://localhost:8000/preview-manifiesto");
      if (!pdfResp.ok) throw new Error("No se pudo generar el PDF.");

      const blob = await pdfResp.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Error:", err);
      alert("No se pudo generar el manifiesto o la vista previa.");
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

      <button className="manifiesto-btn" onClick={generarYMostrarPreview}>
        Preview
      </button>

      {previewUrl && (
        <>
          <h3>Vista previa PDF</h3>
          <object
            data={previewUrl}
            type="application/pdf"
            className="manifiesto-preview"
          >
            <p>
              Tu navegador no puede mostrar PDFs.{" "}
              <a href={previewUrl}>Descargar PDF</a>
            </p>
          </object>
          <button onClick={descargarExcel}>Descargar Excel</button>
        </>
      )}
    </main>
  );
}
