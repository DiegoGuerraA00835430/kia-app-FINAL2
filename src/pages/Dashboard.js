import React from 'react';
import "../App.css";

export default function Dashboard() {
  return (
    <main className="content">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Recolección de datos</h1>
        <p className="dashboard-description">
          Sistema de gestión de residuos KIA
        </p>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <h3>Reportes</h3>
            <p>Gestión de datos y estadísticas</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v16h16" />
                <path d="M4 16l4-4 4 4 8-8" />
              </svg>
            </div>
            <h3>Gráficos</h3>
            <p>Visualización de tendencias</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>
            <h3>Ranking</h3>
            <p>Métricas de desempeño</p>
          </div>
        </div>
      </div>
    </main>
  );
}
