// pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4002/api/login', {
        numero_empleado: username,
        contrasena: password
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data || 'Error al conectar con el servidor';
      setError(errorMsg);
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <img src="/logo.png" alt="KIA logo" className="login-logo" />
      </header>

      <main className="login-main">
        <div className="login-container">
          <h1 className="login-title">Iniciar Sesión</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username" className="input-label">Número de empleado</label>
              <input
                id="username"
                type="text"
                className="login-input"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">Contraseña</label>
              <input
                id="password"
                type="password"
                className="login-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}