import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoleSelect from "./pages/auth/RoleSelect";
import CompleteProfile from "./pages/auth/CompleteProfile";
import DashboardRouter from "./pages/DashboardRouter";
import ClientDashboard from "./pages/client/ClientDashboard";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/select-role" element={<RoleSelect />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      <Route path="/dashboard" element={<DashboardRouter />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      <Route
        path="/professional/dashboard"
        element={<ProfessionalDashboard />}
      />
    </Routes>
  );
}

export default App;