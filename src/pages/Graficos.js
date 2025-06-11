import React, { useEffect, useState, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import "../App.css";

const COLORS = [
  "#05141f", "#1a73e8", "#34a853", "#4285f4",
  "#185abc", "#1967d2", "#174ea6", "#1a73e8",
];

const AREAS = [
  "Assembly", "HO", "Paint", "PTAR",
  "Stamping", "Utility", "Vendors", "Welding"
];

export default function Graficos() {
  const [datos, setDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [areasSeleccionadas, setAreasSeleccionadas] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Define the areas array
  const areas = [
    "Pintura",
    "Ensamble",
    "Calidad",
    "Almacén",
    "Mantenimiento",
    "Oficinas",
    "Comedor",
    "Exterior"
  ];

  useEffect(() => {
    fetch("http://localhost:4002/api/manifiestos")
      .then((res) => res.json())
      .then((data) => {
        const formateado = data.map((item) => ({
          "Nombre del residuo": item.residuo?.materialType?.name || "—",
          "Tipo de contenedor": item.container?.name || "—",
          "Cantidad generada Ton.": item.residuo?.cantidad || "0",
          "Area o proceso de generacion": item.proceso?.nombre || "—",
          "Fecha de ingreso": item.residuo?.fecha_generacion?.slice(0, 10) || "—",
        }));
        setDatos(formateado);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del backend:", error);
      });
  }, []);

  const toggleArea = (area) => {
    if (areasSeleccionadas.includes(area)) {
      setAreasSeleccionadas(areasSeleccionadas.filter(a => a !== area));
    } else {
      setAreasSeleccionadas([...areasSeleccionadas, area]);
    }
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

  const resumenPorArea = {};
  datosFiltrados.forEach((fila) => {
    const area = fila["Area o proceso de generacion"];
    const cantidad = parseFloat(fila["Cantidad generada Ton."]) || 0;
    if (!resumenPorArea[area]) resumenPorArea[area] = 0;
    resumenPorArea[area] += cantidad;
  });

  const datosPieChart = Object.entries(resumenPorArea).map(([name, value]) => ({ name, value }));
  const areasUnicas = [...new Set(datosFiltrados.map((d) => d["Area o proceso de generacion"]))];

  const transformarParaLineChart = () => {
    const mapa = {};
    datosFiltrados.forEach((d) => {
      const fechaObj = new Date(d["Fecha de ingreso"]);
      if (isNaN(fechaObj.getTime())) return;

      const fecha = fechaObj.toISOString().split("T")[0];
      const area = d["Area o proceso de generacion"];
      const cantidad = parseFloat(d["Cantidad generada Ton."]) || 0;

      if (!mapa[fecha]) mapa[fecha] = { fecha };
      if (!mapa[fecha][area]) mapa[fecha][area] = 0;
      mapa[fecha][area] += cantidad;
    });

    return Object.values(mapa).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  };

  const aplicarFiltros = () => {
    // Implement filter logic here
  };

  return (
    <main className="content">
    <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gráficos de Residuos</h1>
          <div className="header-buttons">
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

              <div className="filter-item">
                <label className="filter-label">Áreas</label>
                <div 
                  className="area-dropdown-toggle"
                  onClick={() => setShowAreaDropdown(!showAreaDropdown)}
                  ref={dropdownRef}
                >
                  {areasSeleccionadas.length 
                    ? `${areasSeleccionadas.length} áreas seleccionadas` 
                    : "Seleccionar áreas"}
                </div>
                {showAreaDropdown && (
                <div className="area-dropdown">
                    {areas.map(area => (
                      <label key={area} className="area-checkbox">
                        <input
                          type="checkbox"
                          checked={areasSeleccionadas.includes(area)}
                          onChange={() => toggleArea(area)}
                      />
                        <span>{area}</span>
                    </label>
                  ))}
                </div>
              )}
              </div>

              <div className="filter-actions">
                <button 
                  className="btn-primary"
                  onClick={aplicarFiltros}
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="chart-title">Proporción de Residuos por Área</h2>

        <div className="charts-container">
        <div className="chart-section">
            <div className="chart-content">
          <ResponsiveContainer width={400} height={400}>
            <PieChart>
              <Pie
                data={datosPieChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                    isAnimationActive={true}
              >
                {datosPieChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(2)} ton`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
            </PieChart>
          </ResponsiveContainer>

              <div className="chart-legend">
              {datosPieChart.map((entry, index) => {
                const total = datosPieChart.reduce((sum, d) => sum + d.value, 0);
                const porcentaje = ((entry.value / total) * 100).toFixed(1);
                return (
                    <div key={index} className="legend-item">
                    <span
                        className="legend-color"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="legend-text">
                        {entry.name}
                        <span className="legend-value">
                          {entry.value.toFixed(2)} ton ({porcentaje}%)
                        </span>
                      </span>
                    </div>
                );
              })}
              </div>
          </div>
        </div>

          <div className="chart-section">
            <h2 className="chart-title">Tendencia de Residuos por Área</h2>
            <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transformarParaLineChart()}>
                  <XAxis 
                    dataKey="fecha"
                    tick={{ fill: '#05141f' }}
                    stroke="#dee2e6"
                  />
                  <YAxis
                    tick={{ fill: '#05141f' }}
                    stroke="#dee2e6"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
            <Legend />
            {areasUnicas.map((area, index) => (
              <Line
                key={area}
                type="monotone"
                dataKey={area}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      </main>
  );
}
