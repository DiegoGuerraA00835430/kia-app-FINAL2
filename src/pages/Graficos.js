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

export default function Graficos() {
  const [datos, setDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [areasSeleccionadas, setAreasSeleccionadas] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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
      <main className="content">
        <h1>Gráfico: Proporción de residuos por Área</h1>

        <button onClick={() => setMostrarFiltros(!mostrarFiltros)} style={{ marginBottom: "10px" }}>
          Filtros ▾
        </button>

        {mostrarFiltros && (
          <div className="filtros-container">
            <div className="fecha-container">
              <label>Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <label>Fecha final</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            <div>
              <label>Área</label><br />
              <button
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
                className="area-dropdown-toggle"
              >
                Áreas ▾
              </button>
              {mostrarDropdown && (
                <div className="area-dropdown">
                  {[{ name: "Seleccionar todo", isAll: true }, ...AREAS.map((name) => ({ name }))].map((item) => (
                    <label key={item.name}>
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
          </div>
        )}

        <div className="chart-section">
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

          <div className="pie-legend">
            <ul>
              {datosPieChart.map((entry, index) => {
                const total = datosPieChart.reduce((sum, d) => sum + d.value, 0);
                const porcentaje = ((entry.value / total) * 100).toFixed(1);
                return (
                  <li key={index}>
                    <span
                      className="color-dot"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
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
}
