import React, { useEffect, useState } from "react";
import "../App.css";

export default function Reporte() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4002/api/manifiestos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos:", data); // útil para depuración

        const formateado = data.map((item) => ({
          "Nombre del residuo": item.residuo?.materialType?.name || "—",
          "Tipo de contenedor": item.container?.name || "—",
          "Cantidad generada Ton.": item.residuo?.cantidad || "—",
          "Área o proceso de generación": item.proceso?.nombre || "—",
          "Fecha de ingreso": item.residuo?.fecha_generacion?.slice(0, 10) || "—",
          "Fecha de salida": item.fecha_emision?.slice(0, 10) || "—",
          "Art. 71 fracción I inciso (e)": item.manejo?.manejo || "—",
          "Transportista": item.proveedorTransporte?.nombre || "—",
          "Autorización SEMARNAT": item.proveedorTransporte?.autorizacion_semarnat || "—",
          "Autorización SCT": item.proveedorTransporte?.autorizacion_sct || "—",
          "Destino": item.proveedorDestino?.nombre || "—",
          "Autorización destino": item.proveedorDestino?.autorizacion_semarnat || "—",
          "Responsable Técnico": item.empleado?.nombre || "—",
          "Elementos": item.residuo?.elementos?.map(e => e.elemento).join(', ') || "—",
        }));

        setDatos(formateado);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del backend:", error);
      });
  }, []);

  return (
    <div className="page-container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Reporte de Manifiestos</h1>
      <div style={{ overflowX: "auto" }}>
        <table className="tabla-reporte">
          <thead>
            <tr>
              {Object.keys(datos[0] || {}).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, idx) => (
              <tr key={idx}>
                {Object.values(fila).map((valor, i) => (
                  <td key={i}>{valor}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}