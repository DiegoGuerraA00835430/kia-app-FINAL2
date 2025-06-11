import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../App.css";

const COLORS = [
  "#05141f", "#1a73e8", "#34a853", "#4285f4",
  "#185abc", "#1967d2", "#174ea6", "#1a73e8"
];

export default function Ranking() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [data, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mes, setMes] = useState("enero");
  const [año, setAño] = useState("2024");

  const mesANum = {
    enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
    julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4002/api/manifiestos");
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
      const formateado = data.map((item) => ({
        "Nombre del residuo": item.residuo?.materialType?.name || "—",
        "Tipo de contenedor": item.container?.name || "—",
        "Cantidad generada Ton.": item.residuo?.cantidad || "0",
        "Area o proceso de generacion": item.proceso?.nombre || "—",
        "Fecha de ingreso": item.residuo?.fecha_generacion?.slice(0, 10) || "—",
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

  const filteredData = data.filter(item => {
    const fecha = item["Fecha de ingreso"];
    if (!fecha) return false;

    const [anioStr, mesStr] = fecha.split("-");
    const mesSeleccionado = mesANum[mes];

    return mesStr === mesANum[mes] && anioStr === año;
  });

  const rankings = Object.entries(
    filteredData.reduce((acc, curr) => {
      const area = curr["Area o proceso de generacion"];
      const peso = parseFloat(curr["Cantidad generada Ton."]?.replace(',', '.') || "0");
      if (!area) return acc;
      acc[area] = (acc[area] || 0) + peso;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const getResiduoDataByArea = (area) => {
    const residuos = filteredData.filter(item => item["Area o proceso de generacion"] === area);
    const acumulado = residuos.reduce((acc, curr) => {
      let nombre = curr["Nombre del residuo"] || "Desconocido";
      const peso = parseFloat(curr["Cantidad generada Ton."]?.replace(',', '.') || "0");
      if (nombre.includes("(T)")) {
        const idx = nombre.lastIndexOf("(T)");
        nombre = nombre.substring(0, idx + 3).trim();
      }
      nombre = nombre.length > 30 ? nombre.substring(0, 30) + "..." : nombre;
      acc[nombre] = (acc[nombre] || 0) + peso;
      return acc;
    }, {});
    const total = Object.values(acumulado).reduce((sum, v) => sum + v, 0);
    return Object.entries(acumulado).map(([name, value]) => ({
      name: `${name}: ${value.toFixed(2)} ton (${((value / total) * 100).toFixed(1)}%)`,
      value
    }));
  };

  const toggleDetails = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

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

    if (rankings.length === 0) {
      return (
        <div className="empty-state">
          <p>No hay datos disponibles para este mes.</p>
          </div>
      );
    }

    return (
          <div className="ranking-list">
        {rankings.map(([area, total], index) => (
          <div key={index} className="ranking-card">
                  <div
              className={`ranking-header ${expandedIndex === index ? 'expanded' : ''}`}
                    onClick={() => toggleDetails(index)}
                  >
              <div className="ranking-info">
                <h3 className="ranking-area">{area}</h3>
                <span className="ranking-total">{total.toFixed(2)} ton</span>
              </div>
              <svg 
                className={`expand-icon ${expandedIndex === index ? 'expanded' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
                  </div>
                  {expandedIndex === index && (
              <div className="ranking-details">
                <div className="details-header">
                  <h4>Desglose de Residuos</h4>
                  <p className="details-total">Total: {total.toFixed(2)} toneladas</p>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={getResiduoDataByArea(area)}
                            dataKey="value"
                            nameKey="name"
                        cx="50%"
                            cy="50%"
                        outerRadius={150}
                          >
                            {getResiduoDataByArea(area).map((entry, i) => (
                              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{
                          paddingLeft: '20px',
                        }}
                      />
                        </PieChart>
                      </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Ranking por Área</h1>
          <div className="ranking-filters">
            <select 
              className="filter-select"
              value={mes} 
              onChange={e => setMes(e.target.value)}
            >
              {Object.keys(mesANum).map(m => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={año} 
              onChange={e => setAño(e.target.value)}
            >
              {[2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {renderContent()}
        </div>
      </main>
  );
}
