import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNombre = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4002/api/perfil", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(res.data); // 👈 Aquí ves si viene bien el usuario
        setUserName(res.data.usuario?.nombre || "Usuario");
      } catch (err) {
        console.error("No se pudo obtener el nombre del usuario:", err);
        setUserName("Usuario");
      }
    };
    fetchNombre();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToSettings = () => {
    navigate("/usuario");
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    if (!name) return "U"; // Valor por defecto si es undefined o vacío
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/reporte" className="nav-link">Reporte</Link>
        <Link to="/graficos" className="nav-link">Gráficos</Link>
        <Link to="/ranking" className="nav-link">Ranking</Link>
        <Link to="/manifiesto" className="nav-link">Manifiesto</Link>

        {/* Botón de usuario con dropdown */}
        <div
          ref={dropdownRef}
          style={{ position: "relative", display: "flex", alignItems: "center" }}
        >
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="nav-link"
            style={{
              height: "40px",
              width: "40px",
              padding: "8px",
              fontSize: "16px",
              lineHeight: "1",
              textAlign: "center",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            👤
          </button>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: "0",
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: "12px",
                width: "280px",
                zIndex: 1000,
                padding: "20px"
              }}
            >
              {/* Avatar y nombre */}
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    margin: "0 auto 10px",
                    borderRadius: "50%",
                    backgroundColor: "#e0e0e0",
                    color: "#2b6cb0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    fontWeight: "bold",
                    border: "2px solid #2b6cb0"
                  }}
                >
                  {getInitials(userName)}
                </div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{userName}</h3>
                <button
                  onClick={handleLogout}
                  style={{
                    marginTop: "10px",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: "#f9f9f9",
                    cursor: "pointer"
                  }}
                >
                  Cerrar sesión
                </button>
              </div>

              <hr style={{ margin: "16px 0", borderColor: "#ddd" }} />

              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={dropdownLinkStyle}><a href="#" onClick={goToSettings}>Perfil</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <img src="/logo.png" alt="KIA logo" className="logo" />
    </header>
  );
};

const dropdownLinkStyle = {
  padding: "8px 0",
  fontSize: "15px",
  borderBottom: "1px solid #eee"
};

export default Navbar;
