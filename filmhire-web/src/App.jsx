import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoleSelect from "./pages/auth/RoleSelect";
import CompleteProfile from "./pages/auth/CompleteProfile";
import DashboardRouter from "./pages/DashboardRouter";
import ClientDashboard from "./pages/client/ClientDashboard";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import PublicRoute from "./route/PublicRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import ClientRoute from "./route/ClientRoute";
import CreateJob from "./pages/client/CreateJob";
import MyJobs from "./pages/client/MyJobs"
import ProfessionalRoute from "./route/ProfessionalRoute";
import JobDetails from "./pages/client/JobDetails";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/select-role"
        element={
          <ProtectedRoute>
            <RoleSelect />
          </ProtectedRoute>
        }
      />

      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />


   /// Client Routes

      <Route
        path="/client/dashboard"
        element={
          <ClientRoute>
            <ClientDashboard />
          </ClientRoute>
        }
      />

      <Route
        path="/client/create-job"
        element={
          <ClientRoute>
            <CreateJob />
          </ClientRoute>
        }
      />

      <Route
        path="/client/jobs"
        element={
          <ClientRoute>
            <MyJobs />
          </ClientRoute>
        }
      />


      <Route
  path="/client/jobs/:id"
  element={
    <ClientRoute>
      <JobDetails />
    </ClientRoute>
  }
/>

/// Professinal Routes

      <Route
        path="/professional/dashboard"
        element={
          <ProfessionalRoute>
            <ProfessionalDashboard />
          </ProfessionalRoute>
        }
      />
    </Routes>
  );
}

export default App;
