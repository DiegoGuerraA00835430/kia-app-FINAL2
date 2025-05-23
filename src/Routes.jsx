import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reporte from "./pages/Reporte";
import Graficos from "./pages/Graficos";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Manifiesto from "./pages/Manifiesto";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reporte" element={<Reporte />} />
      <Route path="/graficos" element={<Graficos />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/manifiesto" element={<Manifiesto />} />
    </Routes>
  );
};

export default AppRoutes;
