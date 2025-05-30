import React from "react";

export default function Manifiesto() {
  const downloadExcel = async () => {
    try {
      const response = await fetch("http://localhost:8000/generar-manifiesto");
      if (!response.ok) throw new Error("Error al generar el manifiesto");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Manifiesto_KIA_Listo.xlsx";
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo generar el manifiesto. Verifica que el servidor esté corriendo.");
    }
  };

  return (
    <main className="content">
      <h1>Manifiesto de Residuos</h1>
      <button onClick={downloadExcel}>Generar Manifiesto (Excel)</button>
    </main>
  );
}
