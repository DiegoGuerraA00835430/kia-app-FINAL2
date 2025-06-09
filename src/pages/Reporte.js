import React, { useEffect, useState, useRef } from "react";
import "../App.css";

const AREAS = ["Assembly", "HO", "Paint", "PTAR", "Stamping", "Utility", "Vendors", "Welding"];

export default function Reporte() {
  const [datos, setDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [areasSeleccionadas, setAreasSeleccionadas] = useState([]);
  const [ordenCantidad, setOrdenCantidad] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("");
  const [buscarResiduo, setBuscarResiduo] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 50;
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:4002/api/manifiestos")
      .then((res) => res.json())
      .then((data) => {
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
          "Elementos": item.residuo?.elementos?.map(e => e.elemento).join(', ') || "—"
        }));
        setDatos(formateado);
      });
  }, []);

  const datosFiltrados = datos.filter((fila) => {
    const fecha = new Date(fila["Fecha de ingreso"]);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;
    const areaFila = fila["Área o proceso de generación"];
    const nombreResiduo = fila["Nombre del residuo"].toLowerCase();
    return (
      (!inicio || fecha >= inicio) &&
      (!fin || fecha <= fin) &&
      (areasSeleccionadas.length === 0 || areasSeleccionadas.includes(areaFila)) &&
      nombreResiduo.includes(buscarResiduo.toLowerCase())
    );
  });

  if (ordenCantidad === "asc") {
    datosFiltrados.sort((a, b) => parseFloat(a["Cantidad generada Ton."]) - parseFloat(b["Cantidad generada Ton."]));
  } else if (ordenCantidad === "desc") {
    datosFiltrados.sort((a, b) => parseFloat(b["Cantidad generada Ton."]) - parseFloat(a["Cantidad generada Ton."]));
  }

  if (ordenFecha === "asc") {
    datosFiltrados.sort((a, b) => new Date(a["Fecha de salida"]) - new Date(b["Fecha de salida"]));
  } else if (ordenFecha === "desc") {
    datosFiltrados.sort((a, b) => new Date(b["Fecha de salida"]) - new Date(a["Fecha de salida"]));
  }

  const totalPaginas = Math.ceil(datosFiltrados.length / elementosPorPagina);
  const datosPaginados = datosFiltrados.slice((paginaActual - 1) * elementosPorPagina, paginaActual * elementosPorPagina);

  return (
    <div className="page-container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Reporte de Manifiestos</h1>

      <button onClick={() => setMostrarFiltros(!mostrarFiltros)}>Filtros ▾</button>

      {mostrarFiltros && (
        <div className="filtros-reporte">
          <label>Fecha inicio: <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} /></label>
          <label>Fecha final: <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} /></label>

          <label>Nombre del residuo:
            <input
              type="text"
              value={buscarResiduo}
              onChange={(e) => setBuscarResiduo(e.target.value)}
              placeholder="Buscar residuo..."
            />
          </label>

          <label>Orden por cantidad:
            <select value={ordenCantidad} onChange={(e) => setOrdenCantidad(e.target.value)}>
              <option value="">--</option>
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </label>

          <label>Orden por fecha:
            <select value={ordenFecha} onChange={(e) => setOrdenFecha(e.target.value)}>
              <option value="">--</option>
              <option value="asc">Más antiguo</option>
              <option value="desc">Más reciente</option>
            </select>
          </label>
        </div>
      )}

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
            {datosPaginados.map((fila, i) => (
              <tr key={i}>
                {Object.values(fila).map((valor, j) => (
                  <td key={j}>{valor}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
