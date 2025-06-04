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
      await axios.post('http://localhost:4002/api/registro', {
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
        <h2>Crear Usuario</h2>

        <form onSubmit={handleCrear} className="usuario-formulario">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <select
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            required
          >
            <option value="" disabled>Seleccionar cargo</option>
            <option value="Admin">Admin</option>
            <option value="Auditor">Auditor</option>
          </select>
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

        <h2>Lista de Usuario</h2>
        <div className="usuario-tabla-container">
          <table className="usuario-tabla">
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
