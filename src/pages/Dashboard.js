import React from 'react';
import "../App.css";

export default function Dashboard() {
  return (
    <main
      className="content"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <div className="dashboard-container">
        Recolección de datos
      </div>
    </main>
  );
}
