import React, { useState } from "react";

export default function Manifiesto() {
  const [previewUrl, setPreviewUrl] = useState(null);

  const generarYMostrarPreview = async () => {
    try {
      // Paso 1: generar Excel
      const excelResp = await fetch("http://localhost:8000/generar-manifiesto");
      if (!excelResp.ok) throw new Error("No se pudo generar el Excel.");

      // Paso 2: generar vista previa PDF
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
    <main className="content" style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Manifiesto de Residuos</h1>

      <button onClick={generarYMostrarPreview} style={{ marginBottom: "2rem" }}>
        Preview
      </button>

      {previewUrl && (
        <>
          <h3>Vista previa PDF</h3>
          <object
            data={previewUrl}
            type="application/pdf"
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc" }}
          >
            <p>Tu navegador no puede mostrar PDFs. <a href={previewUrl}>Descargar PDF</a></p>
          </object>
          <br />
          <button onClick={descargarExcel} style={{ marginTop: "1rem" }}>
            Descargar Excel
          </button>
        </>
      )}
    </main>
  );
}
