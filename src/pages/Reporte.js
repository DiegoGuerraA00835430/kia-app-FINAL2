// Reporte.js
import React, { useEffect, useState, useRef } from "react";
import "../App.css";

const AREAS = [
  "Assembly", "HO", "Paint", "PTAR",
  "Stamping", "Utility", "Vendors", "Welding"
];

const Reporte = () => {
  const [datos, setDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [areasSeleccionadas, setAreasSeleccionadas] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [ordenCantidad, setOrdenCantidad] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 50;

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/a7d38c70-1c41-4bea-be48-dfa70da03d19")
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch((err) => console.error("Error al cargar datos:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleArea = (area) => {
    setAreasSeleccionadas((prev) =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const toggleSeleccionarTodo = () => {
    if (areasSeleccionadas.length === AREAS.length) {
      setAreasSeleccionadas([]);
    } else {
      setAreasSeleccionadas(AREAS);
    }
  };

  const datosFiltrados = datos.filter((fila) => {
    const fecha = new Date(fila["Fecha de ingreso"]);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;
    const areaFila = fila["Area o proceso de generacion"];
    return (
      (!inicio || fecha >= inicio) &&
      (!fin || fecha <= fin) &&
      (areasSeleccionadas.length === 0 || areasSeleccionadas.includes(areaFila))
    );
  });

  if (ordenCantidad === "asc") {
    datosFiltrados.sort((a, b) => parseFloat(a["Cantidad generada Ton."]) - parseFloat(b["Cantidad generada Ton."]));
  } else if (ordenCantidad === "desc") {
    datosFiltrados.sort((a, b) => parseFloat(b["Cantidad generada Ton."]) - parseFloat(a["Cantidad generada Ton."]));
  }

  const totalPaginas = Math.ceil(datosFiltrados.length / elementosPorPagina);
  const datosPaginados = datosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

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
        <h1>Reporte</h1>

        <button onClick={() => setMostrarFiltros(!mostrarFiltros)} style={{ marginBottom: "10px" }}>
          Filtros ▾
        </button>

        {mostrarFiltros && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "10px",
            justifyContent: "center", marginBottom: "20px"
          }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Fecha inicio</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ width: "150px", padding: "5px" }} />
              <label>Fecha final</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={{ width: "150px", padding: "5px" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <label>Área</label>
              <button onClick={() => setMostrarDropdown(!mostrarDropdown)} style={{ width: "200px", padding: "5px", textAlign: "left", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff", cursor: "pointer" }}>
                Áreas ▾
              </button>
              {mostrarDropdown && (
                <div ref={dropdownRef} style={{
                  position: "absolute", background: "#fff", border: "1px solid #ccc", padding: "10px 12px",
                  borderRadius: "6px", zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  maxHeight: "250px", overflowY: "auto", minWidth: "200px", textAlign: "left"
                }}>
                  {[{ name: "Seleccionar todo", isAll: true }, ...AREAS.map((name) => ({ name }))].map((item) => (
                    <label key={item.name} style={{ display: "grid", gridTemplateColumns: "20px 1fr", alignItems: "center", marginBottom: "8px", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={item.isAll ? areasSeleccionadas.length === AREAS.length : areasSeleccionadas.includes(item.name)}
                        onChange={() => item.isAll ? toggleSeleccionarTodo() : toggleArea(item.name)}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <label>Orden por cantidad</label>
              <select value={ordenCantidad} onChange={(e) => setOrdenCantidad(e.target.value)} style={{ width: "200px", padding: "5px" }}>
                <option value="">--</option>
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table className="manifiesto-tabla" style={{ margin: "auto", backgroundColor: "white", minWidth: "1200px" }}>
            <thead>
              <tr>
                <th>Nombre del residuo</th>
                <th>Tipo de contenedor</th>
                <th>Cantidad generada (Ton)</th>
                <th>Área o proceso de generación</th>
                <th>Fecha de ingreso</th>
                <th>Fecha de salida</th>
                <th>Art. 71 fracción I inciso (e)</th>
                <th>Transportista</th>
                <th>Autorización SEMARNAT</th>
                <th>Autorización SCT</th>
                <th>Destino</th>
                <th>Autorización destino</th>
                <th>Responsable Técnico</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((fila, index) => (
                <tr key={index}>
                  <td>{fila["Nombre del residuo"]}</td>
                  <td>{fila["Tipo de contenedor "]}</td>
                  <td>{fila["Cantidad generada Ton."]}</td>
                  <td>{fila["Area o proceso de generacion"]}</td>
                  <td>{fila["Fecha de ingreso"]}</td>
                  <td>{fila["Fecha de salida"]}</td>
                  <td>{fila["Art. 71 fracción I inciso (e)"]}</td>
                  <td>{fila["Nombre, denominación o razón social (Transportista)"]}</td>
                  <td>{fila["Número de autorización SEMARNAT"]}</td>
                  <td>{fila["Número de autorización SCT"]}</td>
                  <td>{fila["Nombre, denominación o razón social (Destino)"]}</td>
                  <td>{fila["No. autorización destino"]}</td>
                  <td>{fila["Nombre, Responsable Técnico"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", flexWrap: "nowrap", whiteSpace: "nowrap" }}>
          {[1, 2, 3, 4].map((num) =>
            num <= totalPaginas ? (
              <button
                key={num}
                onClick={() => setPaginaActual(num)}
                style={{ width: "24px", height: "24px", fontSize: "12px", borderRadius: "4px", background: paginaActual === num ? "#1a73e8" : "transparent", color: paginaActual === num ? "#fff" : "#1a73e8", border: "none", fontWeight: paginaActual === num ? "bold" : "normal", cursor: "pointer", padding: "0" }}
              >
                {num}
              </button>
            ) : null
          )}
          {totalPaginas > 5 && <span style={{ fontSize: "12px", color: "#555" }}>...</span>}
          {totalPaginas > 4 && (
            <button onClick={() => setPaginaActual(totalPaginas)} style={{ width: "24px", height: "24px", fontSize: "12px", borderRadius: "4px", background: paginaActual === totalPaginas ? "#1a73e8" : "transparent", color: paginaActual === totalPaginas ? "#fff" : "#1a73e8", border: "none", fontWeight: paginaActual === totalPaginas ? "bold" : "normal", cursor: "pointer", padding: "0" }}>{totalPaginas}</button>
          )}
          {paginaActual < totalPaginas && (
            <button onClick={() => setPaginaActual(paginaActual + 1)} style={{ width: "24px", height: "24px", fontSize: "12px", borderRadius: "4px", background: "transparent", color: "#1a73e8", border: "none", cursor: "pointer", padding: "0" }}>&gt;</button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reporte;
