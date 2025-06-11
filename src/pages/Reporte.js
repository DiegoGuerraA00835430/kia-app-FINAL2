import React, { useEffect, useState, useRef } from "react";
import "../App.css";

const AREAS = ["Assembly", "HO", "Paint", "PTAR", "Stamping", "Utility", "Vendors", "Welding"];

export default function Reporte() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4002/api/manifiestos");
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        const formateado = data.map((item) => ({
          "Nombre del residuo": item.residuo?.materialType?.name || "—",
          "Tipo de contenedor": item.container?.name || "—",
          "Cantidad generada Ton.": item.residuo?.cantidad || "—",
          "Elementos": item.residuo?.elementos?.map(e => e.elemento).join(', ') || "—",
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
        }));
        setDatos(formateado);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (datos.length === 0) {
      return (
        <div className="empty-state">
          <p>No hay datos disponibles</p>
        </div>
      );
    }

    return (
      <div className="table-container">
        <table className="data-table">
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
        <div className="pagination">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={`pagination-button ${paginaActual === i + 1 ? 'active' : ''}`}
              onClick={() => setPaginaActual(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Reporte de Manifiestos</h1>
          <button 
            className="filter-button"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="button-icon">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <span>Filtros</span>
          </button>
        </div>

        {mostrarFiltros && (
          <div className="filters-panel">
            <div className="filters-content">
              <div className="filters-row">
                <div className="filter-item">
                  <label className="filter-label">Fecha inicio</label>
                  <input 
                    type="date" 
                    className="filter-input"
                    value={fechaInicio} 
                    onChange={(e) => setFechaInicio(e.target.value)} 
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div className="filter-item">
                  <label className="filter-label">Fecha final</label>
                  <input 
                    type="date" 
                    className="filter-input"
                    value={fechaFin} 
                    onChange={(e) => setFechaFin(e.target.value)} 
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>

              <div className="filter-item full-width">
                <label className="filter-label">Nombre del residuo</label>
                <input
                  type="text"
                  className="filter-input"
                  value={buscarResiduo}
                  onChange={(e) => setBuscarResiduo(e.target.value)}
                  placeholder="Buscar residuo..."
                />
              </div>

              <div className="filters-row">
                <div className="filter-item">
                  <label className="filter-label">Orden por cantidad</label>
                  <select 
                    className="filter-select"
                    value={ordenCantidad} 
                    onChange={(e) => setOrdenCantidad(e.target.value)}
                  >
                    <option value="">Sin orden</option>
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                </div>

                <div className="filter-item">
                  <label className="filter-label">Orden por fecha</label>
                  <select 
                    className="filter-select"
                    value={ordenFecha} 
                    onChange={(e) => setOrdenFecha(e.target.value)}
                  >
                    <option value="">Sin orden</option>
                    <option value="asc">Más antiguo</option>
                    <option value="desc">Más reciente</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {error ? (
          <div className="error-state">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
            <p className="error-message">Error al cargar los datos. Por favor, intente más tarde.</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className="table-container">
            {renderContent()}
          </div>
        )}
      </div>
    </main>
  );
}
