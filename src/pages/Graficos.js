import React, { useEffect, useState } from "react";
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
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#9241f5", "#E91E63", "#3F51B5", "#009688",
];

const AREAS = [
  "Assembly", "HO", "Paint", "PTAR",
  "Stamping", "Utility", "Vendors", "Welding"
];

const Graficos = () => {
  const [datos, setDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [areasSeleccionadas, setAreasSeleccionadas] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/a7d38c70-1c41-4bea-be48-dfa70da03d19")
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch((err) => console.error("Error al cargar datos:", err));
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
        <h1>Gráfico: Proporción de residuos por Área</h1>

        <button onClick={() => setMostrarFiltros(!mostrarFiltros)} style={{ marginBottom: "10px" }}>
          Filtros ▾
        </button>

        {mostrarFiltros && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, auto)",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                style={{ width: "150px", padding: "5px" }}
              />
              <label>Fecha final</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                style={{ width: "150px", padding: "5px" }}
              />
            </div>

            <div>
              <label>Área</label><br />
              <button
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
                style={{
                  width: "200px",
                  padding: "5px",
                  textAlign: "left",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  cursor: "pointer"
                }}
              >
                Áreas ▾
              </button>
              {mostrarDropdown && (
                <div style={{
                  position: "absolute",
                  background: "#fff",
                  border: "1px solid #ccc",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  maxHeight: "250px",
                  overflowY: "auto",
                  minWidth: "200px",
                  textAlign: "left",
                }}>
                  {[{ name: "Seleccionar todo", isAll: true }, ...AREAS.map((name) => ({ name }))].map((item) => (
                    <label
                      key={item.name}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "20px 1fr",
                        alignItems: "center",
                        marginBottom: "8px",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          item.isAll
                            ? areasSeleccionadas.length === AREAS.length
                            : areasSeleccionadas.includes(item.name)
                        }
                        onChange={() =>
                          item.isAll ? toggleSeleccionarTodo() : toggleArea(item.name)
                        }
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label>Art. 71</label><br />
              <select disabled style={{ width: "200px", padding: "5px" }}>
                <option>Próximamente...</option>
              </select>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <ResponsiveContainer width={400} height={400}>
            <PieChart>
              <Pie
                data={datosPieChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                isAnimationActive={false}
              >
                {datosPieChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)} ton`} />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ fontSize: "14px" }}>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {datosPieChart.map((entry, index) => {
                const total = datosPieChart.reduce((sum, d) => sum + d.value, 0);
                const porcentaje = ((entry.value / total) * 100).toFixed(1);
                return (
                  <li key={index} style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{
                      width: 12, height: 12, display: "inline-block",
                      borderRadius: "50%", backgroundColor: COLORS[index % COLORS.length]
                    }}></span>
                    <span>{`${entry.name}: ${entry.value.toFixed(2)} ton (${porcentaje}%)`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <h2 style={{ marginTop: "40px" }}>Tendencia de residuos por Área</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transformarParaLineChart()}>
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            {areasUnicas.map((area, index) => (
              <Line
                key={area}
                type="monotone"
                dataKey={area}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 1.5 }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default Graficos;
