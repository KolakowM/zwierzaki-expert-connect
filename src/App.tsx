
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import SpecialistProfile from "./pages/SpecialistProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import PetProfile from "./pages/PetProfile";
import { AuthProvider } from "./contexts/AuthContext";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import BecomeSpecialist from "./pages/BecomeSpecialist";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Terms2 from "./pages/Terms2";
import AccountSettings from "./pages/AccountSettings";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminClients from "./pages/admin/AdminClients";
import AdminPets from "./pages/admin/AdminPets";
import AdminVisits from "./pages/admin/AdminVisits";
import AdminCarePrograms from "./pages/admin/AdminCarePrograms";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<SpecialistProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/pets/:id" element={<PetProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/become-specialist" element={<BecomeSpecialist />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/regulamin" element={<Terms2 />} />
        <Route path="/account" element={<AccountSettings />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="pets" element={<AdminPets />} />
          <Route path="visits" element={<AdminVisits />} />
          <Route path="care-programs" element={<AdminCarePrograms />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
