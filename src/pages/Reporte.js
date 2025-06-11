import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import ExcelJS from 'exceljs';

const AREAS = ["Assembly", "HO", "Paint", "PTAR", "Stamping", "Utility", "Vendors", "Welding"];

// Language mapping for waste names
const wasteNameTranslations = {
  "Trapos, guantes y textiles contaminados con aceite hidraulico,pintura, thinner y grasa provenientes de actividades de limpieza, operación y mantenimiento": "Rags, gloves and textiles contaminated with hydraulic oil, paint, thinner and grease from cleaning, operation and maintenance activities",
  "Plasticos contaminados con aceite hidraulico y pintura provenientes de actividades de limpieza y operación": "Plastics contaminated with hydraulic oil and paint from cleaning and operation activities",
  "Papel contaminado con pintura proveniente de la actividad de retoque de carrocerias": "Paper contaminated with paint from bodywork refinishing activities",
  "Tambos vacios metalicos contaminados con aceite hidraulico, liquidos para frenos y sello": "Empty metal drums contaminated with hydraulic oil, brake fluids and sealants",
  "Tambos vacios plasticos contaminados limpiadores con base de hidroxido de potasio": "Empty plastic drums contaminated with potassium hydroxide based cleaners",
  "Lodos de Fosfatizado proveniente de la lavadora de fosfatizado": "Phosphatizing sludge from the phosphatizing washer",
  "Contenedores vacios metalicos contaminados de pintura de aceite, aceite hidraulico y sello": "Empty metal containers contaminated with oil paint, hydraulic oil and seal",
  "Contenedores vacios plasticos contaminados de pintura de aceite y aceite hidraulico": "Empty plastic containers contaminated with oil paint, hydraulic oil and seals",
  "Aceite Gastado proveniente de los mantenimientos realizados a los equipos": "Spent oil coming from the maintenance of the equipment",
  "Solventes Mezclados con base de thinner provenientes de las actividades de limpieza y/o los mantenimientos realizados a los equipos": "Thinner-based mixed solvents from cleaning activities and/or maintenance performed on equipment",
  "Totes contaminados plasticos con aceite hidraulico": "Contaminated plastic totes with hydraulic oil",
  "Agua Contaminada con pintura proveniente de la aplicación a las carrocerias": "Water Contaminated with paint from the application of paint to bodywork",
  "Filtros contaminados con pigmentos y agua provenientes de la Planta Tratadora de Aguas Residuales": "Filters contaminated with pigments and water from the wastewater treatment plant",
  "Sello Gastado proveniente de la aplicación de sellos a carcazas": "Spent seal from the application of seals to carcasses",
  "Residuos No Anatomicos : algodon, gasas,vendas ,sabanas,guantes provenientes de curaciones": "Non-anatomical waste: cotton, gauze, bandages, linens, gloves from treatments",
  "Objetos Punzocortantes provenientes de procedimientos medicos : lancetas, agujas, bisturis": "Sharps from medical procedures: lancets, needles, scalpels",
  "Pilas Alcalinas": "Alkaline batteries",
  "Baterias de equipos automotores": "Automotive equipment batteries",
  "Lodos de Clara provenientes de residuos de casetas de pintura": "Clear sludge from paint booth wastes",
  "Rebaba y Eslinga Metalica impregnada con aceite proveniente del mantenimiento a troqueles": "Metal burrs and slings impregnated with oil from die maintenance",
  "Lamparas Flourescentes": "Flourescent lamps",
  "Filtros contaminados con pigmentos y agua provenientes de la Planta de pintura": "Pigment and water contaminated filters from the paint plant",
  "Contenedores vacios metalicos de gases refrigerantes": "Empty metal refrigerant gas containers",
  "Catalizadores gastados de equipos automotores": "Spent catalytic converters from automotive equipment",
  "Baterias automotrices de metal litio": "Automotive lithium metal batteries"
};

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
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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

  const exportToExcelWithLanguage = async (language) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Residuos');

    // Add headers
    const headers = Object.keys(datos[0] || {});
    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: 15
    }));

    // Add data
    datosFiltrados.forEach(row => {
      worksheet.addRow(row);
    });

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF000000' }
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
    });

    // Set row height
    worksheet.eachRow((row) => {
      row.height = 25;
    });

    // Generate filename with date
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
    const fileName = `Reporte_Residuos_${language === 'en' ? 'EN' : 'ES'}_${dateStr}_${timeStr}.xlsx`;

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    setShowLanguageModal(false);
  };

  const LanguageModal = () => (
    <div className="language-modal-overlay">
      <div className="language-modal">
        <h3>Select Language / Seleccionar Idioma</h3>
        <div className="language-buttons">
          <button onClick={() => exportToExcelWithLanguage('es')}>Español</button>
          <button onClick={() => exportToExcelWithLanguage('en')}>English</button>
        </div>
        <button className="close-button" onClick={() => setShowLanguageModal(false)}>×</button>
      </div>
    </div>
  );

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
          <div className="header-buttons">
            <button 
              className="export-button"
              onClick={() => setShowLanguageModal(true)}
            >
              Export
            </button>
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
        </div>

        {showLanguageModal && <LanguageModal />}

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