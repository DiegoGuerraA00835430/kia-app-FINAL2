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
      <div
        style={{
          width: '70%',
          height: '50%',
          padding: '40px',
          border: '2px solid #1a73e8',
          borderRadius: '12px',
          backgroundColor: '#f5f5f5',
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1a73e8',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Recolección de datos
      </div>
    </main>
  );
}
