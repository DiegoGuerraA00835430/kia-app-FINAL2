// pages/Ranking.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../App.css";

export default function Ranking() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [data, setDatos] = useState([]);
  const [mes, setMes] = useState("enero");
  const [año, setAño] = useState("2024");

  const mesANum = {
    enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
    julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
  };

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/a7d38c70-1c41-4bea-be48-dfa70da03d19")
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch((err) => console.error("Error al cargar datos:", err));
  }, []);

  const filteredData = data.filter(item => {
    const fecha = item["Fecha de ingreso"];
    if (!fecha) return false;

    const partes = fecha.split("/");
    if (partes.length !== 3) return false;

    let [mesStr, diaStr, anioStr] = partes;
    mesStr = mesStr.trim();
    anioStr = anioStr.trim().length === 2 ? `20${anioStr.trim()}` : anioStr.trim();

    const mesNum = mesStr.padStart(2, '0');
    const mesSeleccionado = mesANum[mes];

    return mesNum === mesSeleccionado && anioStr === año;
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF6666", "#0099CC", "#9933CC"];

  const toggleDetails = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div>
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
        <div className="ranking-box">
          <h2>Ranking por Área</h2>

          <div className="filters">
            <select value={mes} onChange={e => setMes(e.target.value)}>
              {Object.keys(mesANum).map(m => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>

            <select value={año} onChange={e => setAño(e.target.value)}>
              {[2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="ranking-list">
            {rankings.length === 0 ? (
              <p>No hay datos disponibles para este mes.</p>
            ) : (
              rankings.map(([area, total], index) => (
                <div key={index}>
                  <div
                    className={`ranking-item ${expandedIndex === index ? 'expanded' : ''}`}
                    onClick={() => toggleDetails(index)}
                  >
                    {area} — {total.toFixed(2)} ton <span className="arrow">{expandedIndex === index ? '🔼' : '🔽'}</span>
                  </div>
                  {expandedIndex === index && (
                    <div className="details">
                      <p>Total generado: {total.toFixed(2)} toneladas</p>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={getResiduoDataByArea(area)}
                            dataKey="value"
                            nameKey="name"
                            cx="30%"
                            cy="50%"
                            outerRadius={100}
                          >
                            {getResiduoDataByArea(area).map((entry, i) => (
                              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend layout="vertical" verticalAlign="middle" align="right" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}