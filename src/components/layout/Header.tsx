
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // List of navigation links
  const navLinks = [
    { title: "Strona główna", href: "/" },
    { title: "O nas", href: "/about" },
    { title: "Cennik", href: "/pricing" },
    { title: "Blog", href: "/blog" }, // Added blog link
    { title: "Kontakt", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-2 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl">
              <span className="text-primary">Pets</span>Flow
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        
        {/* Right Side - Auth and Language */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <div className="relative flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-sm font-medium"
              >
                Dashboard
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                variant="outline"
                onClick={handleLogout}
                size="sm"
              >
                Wyloguj
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-sm font-medium"
              >
                Zaloguj
              </Button>
              
              <Button
                onClick={() => navigate("/register")}
                size="sm"
              >
                Rejestracja
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 z-50 bg-background p-6 pb-20 shadow-md flex flex-col",
          isMenuOpen ? "flex animate-in fade-in-0 slide-in-from-top-5" : "hidden"
        )}
      >
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-lg font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              {link.title}
            </Link>
          ))}
          
          {/* Only show these links on mobile when not logged in */}
          {!isAuthenticated && (
            <>
              <Separator className="my-2" />
              <Link
                to="/login"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Zaloguj
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center justify-center rounded-md bg-primary px-4 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                onClick={toggleMenu}
              >
                Rejestracja
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
