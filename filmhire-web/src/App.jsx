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
import ClientJobDetails from "./pages/client/JobDetails";
import ProfessionalJobDetails from "./pages/professional/JobDetails";
import { NotFoundPage } from "./pages/NotFound";
import ApplicationsPage from "./pages/client/ApplicationsPage";
import ClientWorkspacePage from "./pages/client/ClientWorkspacePage";
import ProfileViewPage from "./pages/ProfileViewPage";
import ConnectionRequests from "./components/common/ConnectionRequests";


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
      <ClientJobDetails />
    </ClientRoute>
  }
/>


<Route
  path="/client/applications"
  element={
    <ClientRoute>
      <ApplicationsPage />
    </ClientRoute>
  }
/>

<Route
  path="/client/workspaces"
  element={
    <ClientRoute>
      <ClientWorkspacePage />
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

            <Route
        path="/professional/jobs/:jobId"
        element={
            <ProfessionalJobDetails />
        }
      />

      <Route
  path="/client/connections"
  element={<ConnectionRequests />}
/>

      <Route path="/profile/:id" element={<ProfileViewPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
