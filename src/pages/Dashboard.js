import React, { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const iframeRef = useRef(null);
  const tokenSent = useRef(false); // track if token was already sent

  // Listen for Unity's confirmation
  useEffect(() => {
    function handleMessage(event) {
      if (event.data && event.data.type === "TOKEN_CONFIRM") {
        tokenSent.current = true;
        console.log("✅ Unity confirmó recepción del token");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleUnityLoaded = () => {
    const token = localStorage.getItem("token");
    const unityFrame = iframeRef.current;
    if (token && !tokenSent.current) {
      unityFrame.contentWindow.postMessage({ type: "SET_TOKEN", token }, "*");
      console.log("✅ Token enviado vía postMessage:", token);
    }
  };

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

        <div style={{ textAlign: "center", paddingTop: "2rem" }}>
          <iframe
            ref={iframeRef}
            id="unity-frame"
            title="UnityWebGL"
            src="/buildWEBGL/index.html"
            width="960"
            height="540"
            frameBorder="0"
            allowFullScreen
            onLoad={handleUnityLoaded}
          />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
