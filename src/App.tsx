import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Catalog from "@/pages/Catalog";
import Dashboard from "@/pages/Dashboard";
import AccountSettings from "@/pages/AccountSettings";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";
import { AuthProvider } from './contexts/AuthProvider';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="petsflow-theme">
      <AuthProvider>
        <SubscriptionProvider>
          <Router basename="/">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
