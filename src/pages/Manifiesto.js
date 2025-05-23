import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

const Manifiesto = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleCrearPDF = async () => {
    const existingPdfBytes = await fetch("/Formato Manifiesto.pdf")
      .then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const drawText = (text, x, y) => {
      page.drawText(text, {
        x,
        y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
    };

    const datos = [
      ["Aceite usado", "200", "Tambor", "0.5", "kg"],
      ["Disolvente", "150", "Cont. plástico", "0.8", "kg"],
      ["Pintura vencida", "100", "Lata", "0.3", "kg"],
      ["Fango industrial", "250", "Tambor ", "1.2", "kg"],
      ["Líquido refrigerante", "180", "Bidón", "0.6", "kg"]
    ];

    let y = 950;
    datos.forEach((fila) => {
      drawText(fila[0], 95, y);
      drawText(fila[1], 427, y);
      drawText(fila[2], 505, y);
      drawText(fila[3], 580, y);
      drawText(fila[4], 660, y);
      y -= 30;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Set preview URL
    const previewUrl = URL.createObjectURL(blob);
    setPdfUrl(previewUrl);

    // Optional: download automatically
    // saveAs(blob, "Manifiesto_KIA_Listo.pdf");
  };

  const handleDownload = () => {
    if (pdfUrl) {
      saveAs(pdfUrl, "Manifiesto_KIA_Listo.pdf");
    }
  };

  return (
    <div className="page-container">
      <header className="navbar">
        <div className="nav-left">
          <a href="/dashboard">Dashboard</a>
          <a href="/reporte">Reporte</a>
          <a href="/graficos">Gráficos</a>
          <a href="/ranking">Ranking</a>
          <a href="/manifiesto">Manifiesto</a>
        </div>
        <img src="/logo.png" alt="KIA logo" className="logo" />
      </header>

      <main className="content">
        <h1>Manifiesto de Residuos</h1>
        <button onClick={handleCrearPDF}>Crear Manifiesto (PDF)</button>
        {pdfUrl && (
          <>
            <h2>Vista previa del PDF</h2>
              <object data={pdfUrl} type="application/pdf" width="100%" height="600px">
                <p>No se puede mostrar el PDF. <a href={pdfUrl}>Descargar PDF</a>.</p>
              </object>
            <br />
            <button onClick={handleDownload}>Descargar PDF</button>
          </>
        )}
      </main>
    </div>
  );
};

export default Manifiesto;
