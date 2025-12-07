
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/404';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Pets from './pages/Pets';
import PetProfile from './pages/PetProfile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import ProfileEditor from './pages/ProfileEditor';
import AccountSettings from './pages/AccountSettings';
import BecomeSpecialist from './pages/BecomeSpecialist';
import Catalog from './pages/Catalog';
import SpecialistProfile from './pages/SpecialistProfile';
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin routes
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClients from './pages/admin/AdminClients';
import AdminPets from './pages/admin/AdminPets';
import AdminVisits from './pages/admin/AdminVisits';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCarePrograms from './pages/admin/AdminCarePrograms';
import AdminBlog from './pages/admin/AdminBlog';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';

// Blog pages
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <AuthProvider>
              <Toaster position="top-right" />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/specialist/:id" element={<SpecialistProfile />} />
                <Route path="/become-specialist" element={<BecomeSpecialist />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/clients" element={
                  <ProtectedRoute>
                    <Clients />
                  </ProtectedRoute>
                } />
                <Route path="/clients/:id" element={
                  <ProtectedRoute>
                    <ClientDetails />
                  </ProtectedRoute>
                } />
                <Route path="/pets" element={
                  <ProtectedRoute>
                    <Pets />
                  </ProtectedRoute>
                } />
                <Route path="/pets/:id" element={
                  <ProtectedRoute>
                    <PetProfile />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfileEditor />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="clients" element={<AdminClients />} />
                  <Route path="pets" element={<AdminPets />} />
                  <Route path="visits" element={<AdminVisits />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="care-programs" element={<AdminCarePrograms />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="blog/new" element={<AdminBlogEditor />} />
                  <Route path="blog/:id/edit" element={<AdminBlogEditor />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
