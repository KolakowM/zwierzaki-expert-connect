
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Pets from './pages/Pets';
import PetProfile from './pages/PetProfile';
import Terms from './pages/Terms';
import Terms2 from './pages/Terms2';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import ProfileEditor from './pages/ProfileEditor';
import AccountSettings from './pages/AccountSettings';
import BecomeSpecialist from './pages/BecomeSpecialist';
import Catalog from './pages/Catalog';
import SpecialistProfile from './pages/SpecialistProfile';
import { AuthProvider } from './contexts/AuthProvider';

// Admin routes
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';  // Dodana strona AdminUsers
import AdminClients from './pages/admin/AdminClients';
import AdminPets from './pages/admin/AdminPets';
import AdminVisits from './pages/admin/AdminVisits';
import AdminSettings from './pages/admin/AdminSettings';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientDetails />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/pets/:id" element={<PetProfile />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/terms2" element={<Terms2 />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/profile" element={<ProfileEditor />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/become-specialist" element={<BecomeSpecialist />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/specialist/:id" element={<SpecialistProfile />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} /> {/* Dodana ścieżka */}
                <Route path="clients" element={<AdminClients />} />
                <Route path="pets" element={<AdminPets />} />
                <Route path="visits" element={<AdminVisits />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
