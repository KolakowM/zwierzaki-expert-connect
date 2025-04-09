
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthProvider } from "./contexts/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Terms2 from "./pages/Terms2";
import Catalog from "./pages/Catalog";
import BecomeSpecialist from "./pages/BecomeSpecialist";
import ProfileEditor from "./pages/ProfileEditor";
import SpecialistProfile from "./pages/SpecialistProfile";
import AccountSettings from "./pages/AccountSettings";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Pets from "./pages/Pets";
import PetProfile from "./pages/PetProfile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClients from "./pages/admin/AdminClients";
import AdminPets from "./pages/admin/AdminPets";
import AdminVisits from "./pages/admin/AdminVisits";
import AdminCarePrograms from "./pages/admin/AdminCarePrograms";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/terms2" element={<Terms2 />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/become-specialist" element={<BecomeSpecialist />} />
              <Route path="/specialist/:id" element={<SpecialistProfile />} />
              
              {/* Authenticated routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileEditor />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientDetails />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/pets/:id" element={<PetProfile />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/admin/pets" element={<AdminPets />} />
              <Route path="/admin/visits" element={<AdminVisits />} />
              <Route path="/admin/care-programs" element={<AdminCarePrograms />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
