import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
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
        setUserName(res.data.usuario?.nombre || "Usuario");
        setUserRole(res.data.usuario?.cargo || "Rol no disponible");
      } catch (err) {
        console.error("No se pudo obtener el nombre del usuario:", err);
        setUserName("Usuario");
        setUserRole("Rol no disponible");
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
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <img src="/logo.png" alt="KIA logo" className="logo" />
      <nav className="nav-center">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/reporte" className="nav-link">Reporte</Link>
        <Link to="/graficos" className="nav-link">Gráficos</Link>
        <Link to="/ranking" className="nav-link">Ranking</Link>
        <Link to="/manifiesto" className="nav-link">Manifiesto</Link>
      </nav>
      <div className="nav-right">
        <div ref={dropdownRef} className="user-dropdown-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="nav-user-button"
            aria-label="User menu"
          >
            {getInitials(userName)}
          </button>

          {showDropdown && (
            <div className="nav-dropdown">
              <div className="nav-user-info">
                <div className="nav-avatar">{getInitials(userName)}</div>
                <h3 className="nav-user-name">{userName}</h3>
                <p className="nav-user-role">{userRole}</p>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>

              {userRole === "Admin" && (
                <>
                  <hr className="nav-dropdown-separator" />
                  <ul className="nav-dropdown-links">
                    <li>
                      <a href="#" onClick={goToSettings}>Perfil</a>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
