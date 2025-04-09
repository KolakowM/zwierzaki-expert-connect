
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { migrateExistingClientsToCurrentUser } from './services/migrationService';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';
import Visits from './pages/Visits';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClients from './pages/admin/AdminClients';
import AdminPets from './pages/admin/AdminPets';
import AdminVisits from './pages/admin/AdminVisits';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Run migration when user logs in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      migrateExistingClientsToCurrentUser().catch(error => {
        console.error("Failed to migrate clients:", error);
      });
    }
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients"
          element={isAuthenticated ? <Clients /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients/:id"
          element={isAuthenticated ? <ClientDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/pets"
          element={isAuthenticated ? <Pets /> : <Navigate to="/login" />}
        />
        <Route
          path="/pets/:id"
          element={isAuthenticated ? <PetDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/visits"
          element={isAuthenticated ? <Visits /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/clients"
          element={isAuthenticated ? <AdminClients /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/pets"
          element={isAuthenticated ? <AdminPets /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/visits"
          element={isAuthenticated ? <AdminVisits /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
