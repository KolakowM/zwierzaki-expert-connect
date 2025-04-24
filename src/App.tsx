
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// Regular pages
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Protected pages
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Pets from "./pages/Pets";
import PetProfile from "./pages/PetProfile";
import Catalog from "./pages/Catalog";
import SpecialistProfile from "./pages/SpecialistProfile";
import ProfileEditor from "./pages/ProfileEditor";
import AccountSettings from "./pages/AccountSettings";
import BecomeSpecialist from "./pages/BecomeSpecialist";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClients from "./pages/admin/AdminClients";
import AdminPets from "./pages/admin/AdminPets";
import AdminVisits from "./pages/admin/AdminVisits";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCarePrograms from "./pages/admin/AdminCarePrograms";
import AdminSettings from "./pages/admin/AdminSettings";

import DatabaseSetupChecker from "@/components/setup/DatabaseSetupChecker";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route wrapper that uses the AuthContext
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin route wrapper that uses the AuthContext
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DatabaseSetupChecker />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            
            <Route 
              path="/clients" 
              element={<ProtectedRoute><Clients /></ProtectedRoute>}
            />
            
            <Route 
              path="/clients/:id" 
              element={<ProtectedRoute><ClientDetails /></ProtectedRoute>}
            />
            
            <Route 
              path="/pets" 
              element={<ProtectedRoute><Pets /></ProtectedRoute>}
            />
            
            <Route 
              path="/pets/:id" 
              element={<ProtectedRoute><PetProfile /></ProtectedRoute>}
            />

            <Route 
              path="/catalog" 
              element={<Catalog />}
            />

            <Route 
              path="/specialist/:id" 
              element={<SpecialistProfile />}
            />

            <Route 
              path="/profile/edit" 
              element={<ProtectedRoute><ProfileEditor /></ProtectedRoute>}
            />
            
            <Route 
              path="/account" 
              element={<ProtectedRoute><AccountSettings /></ProtectedRoute>}
            />
            
            <Route 
              path="/become-specialist" 
              element={<ProtectedRoute><BecomeSpecialist /></ProtectedRoute>}
            />

            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={<AdminRoute><AdminDashboard /></AdminRoute>}
            />
            
            <Route 
              path="/admin/clients" 
              element={<AdminRoute><AdminClients /></AdminRoute>}
            />
            
            <Route 
              path="/admin/pets" 
              element={<AdminRoute><AdminPets /></AdminRoute>}
            />
            
            <Route 
              path="/admin/visits" 
              element={<AdminRoute><AdminVisits /></AdminRoute>}
            />
            
            <Route 
              path="/admin/users" 
              element={<AdminRoute><AdminUsers /></AdminRoute>}
            />
            
            <Route 
              path="/admin/care-programs" 
              element={<AdminRoute><AdminCarePrograms /></AdminRoute>}
            />
            
            <Route 
              path="/admin/settings" 
              element={<AdminRoute><AdminSettings /></AdminRoute>}
            />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
