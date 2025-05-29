import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => (
  <header className="navbar">
    <div className="nav-left">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/reporte">Reporte</Link>
      <Link to="/graficos">Gráficos</Link>
      <Link to="/ranking">Ranking</Link>
      <Link to="/manifiesto">Manifiesto</Link>
      <Link to="/usuario">👤</Link> 
    </div>
    <img src="/logo.png" alt="KIA logo" className="logo" />
  </header>
);

export default Navbar;
