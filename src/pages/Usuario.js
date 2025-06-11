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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:4002/api/usuarios');
      setEmpleados(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar la lista de usuarios. Por favor, intente más tarde.');
      console.error('Error al cargar empleados', err);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden");
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
      setSuccess('Usuario creado exitosamente');
      cargarEmpleados();
    } catch (err) {
      setError(err.response?.data || 'Error al crear usuario');
      console.error('Error al crear usuario', err);
    }
  };

  const eliminarEmpleado = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
    try {
      await axios.delete(`http://localhost:4002/api/usuarios/${id}`);
      setEmpleados(empleados.filter(emp => emp.numero_empleado !== id));
        setSuccess('Usuario eliminado exitosamente');
    } catch (err) {
        setError('Error al eliminar usuario');
      console.error('Error al eliminar usuario', err);
      }
    }
  };

  return (
      <main className="content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Usuarios</h1>
        </div>

        {/* Create User Form */}
        <div className="user-section">
          <h2 className="section-title">Crear Usuario</h2>
          <form onSubmit={handleCrear} className="user-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre</label>
          <input
            type="text"
                  className="form-input"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Nombre completo"
            required
          />
              </div>

              <div className="form-group">
                <label className="form-label">Cargo</label>
          <select
                  className="form-select"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            required
          >
            <option value="" disabled>Seleccionar cargo</option>
                  <option value="Admin">Administrador</option>
            <option value="Auditor">Auditor</option>
          </select>
              </div>

              <div className="form-group">
                <label className="form-label">Número de empleado</label>
          <input
            type="text"
                  className="form-input"
            value={form.numero_empleado}
            onChange={(e) => setForm({ ...form, numero_empleado: e.target.value })}
                  placeholder="8 dígitos"
                  maxLength="8"
                  pattern="\d{8}"
            required
          />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
          <input
            type="password"
                  className="form-input"
            value={form.contrasena}
            onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                  placeholder="Contraseña"
            required
          />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
                  className="form-input"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
                  placeholder="Confirmar contraseña"
            required
          />
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Crear Usuario
              </button>
            </div>
        </form>
        </div>

        {/* Users List */}
        <div className="user-section">
          <h2 className="section-title">Lista de Usuarios</h2>
          <div className="users-table-container">
            <table className="users-table">
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
                    <td>
                      <span className={`role-badge ${emp.cargo.toLowerCase()}`}>
                        {emp.cargo}
                      </span>
                    </td>
                  <td>
                      <button 
                        className="btn-delete"
                        onClick={() => eliminarEmpleado(emp.numero_empleado)}
                      >
                        Eliminar
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        </div>
      </main>
  );
}
