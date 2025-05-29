import React, { useEffect, useState } from 'react';
import "../App.css";
import axios from 'axios';

export default function Usuario() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4002/api/usuarios')
      .then(res => setEmpleados(res.data))
      .catch(err => console.error('Error al cargar empleados', err));
  }, []);

  return (
    <div>
      <main className="content">
        <h2>Lista de Empleados</h2>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          overflowX: "auto"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cargo</th> 
              </tr>
            </thead>
            <tbody>
              {empleados.map(emp => (
                <tr key={emp.numero_empleado}>
                  <td>{emp.id}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.cargo}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
