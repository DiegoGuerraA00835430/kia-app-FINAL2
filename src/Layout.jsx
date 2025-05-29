// src/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; // Crearás esto abajo

const Layout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <div className="page-container">
      {!hideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
};

export default Layout;
