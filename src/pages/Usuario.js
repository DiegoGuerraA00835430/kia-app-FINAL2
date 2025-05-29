import React, { useEffect, useState } from 'react';
import "../App.css";
import axios from 'axios';

export default function Usuario() {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    cargo: '',
    numero_empleado: '',
    contrasena: '',
    confirmar: ''
  });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:4002/api/usuarios');
      setEmpleados(res.data);
    } catch (err) {
      console.error('Error al cargar empleados', err);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    if (form.contrasena !== form.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post('http://localhost:4002/api/usuarios', {
        nombre: form.nombre,
        cargo: form.cargo,
        numero_empleado: form.numero_empleado,
        contrasena: form.contrasena
      });

      setForm({ nombre: '', cargo: '', numero_empleado: '', contrasena: '', confirmar: '' });
      cargarEmpleados();
    } catch (err) {
      console.error('Error al crear usuario', err);
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      await axios.delete(`http://localhost:4002/api/usuarios/${id}`);
      setEmpleados(empleados.filter(emp => emp.numero_empleado !== id));
    } catch (err) {
      console.error('Error al eliminar usuario', err);
    }
  };

  return (
    <div>
      <main className="content">
        <h2>Lista de Empleados</h2>

        {/* Formulario de creación */}
        <form onSubmit={handleCrear} style={{
          maxWidth: "800px",
          margin: "20px auto",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 0 10px #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cargo"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Número de empleado (8 dígitos)"
            value={form.numero_empleado}
            onChange={(e) => setForm({ ...form, numero_empleado: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
            required
          />
          <button type="submit">Crear Usuario</button>
        </form>

        {/* Tabla de empleados */}
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
                <th>Puesto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map(emp => (
                <tr key={emp.numero_empleado}>
                  <td>{emp.numero_empleado}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.cargo}</td>
                  <td>
                    <button onClick={() => eliminarEmpleado(emp.numero_empleado)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
