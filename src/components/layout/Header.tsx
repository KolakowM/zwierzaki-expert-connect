
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const {
    isAuthenticated,
    logout
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Wylogowano pomyślnie",
      description: "Do zobaczenia wkrótce!"
    });
    navigate("/");
  };

  const navigationLinks = [
    { to: "/catalog", label: "Katalog Specjalistów" },
    { to: "/about", label: "O Platformie" },
    { to: "/pricing", label: "Cennik" },
    { to: "/contact", label: "Kontakt" }
  ];
  
  const renderDesktopNavigation = () => (
    <nav className="hidden gap-6 md:flex">
      {navigationLinks.map((link) => (
        <Link key={link.to} to={link.to} className="text-sm font-medium hover:text-primary">
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const renderMobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          {navigationLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="text-base font-medium hover:text-primary py-2"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-base font-medium hover:text-primary py-2">
                Panel Specjalisty
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="justify-start px-0">
                Wyloguj
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-base font-medium hover:text-primary py-2">
                Logowanie
              </Link>
              <Link to="/register" className="text-base font-medium hover:text-primary py-2">
                Zarejestruj się
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
  
  return <header className="w-full border-b">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/5bdd954f-63dd-4a66-8c3f-96d62e366662.png" 
              alt="Pets Flow Logo" 
              className="w-8 h-8"
            />
            <span className="ml-2 text-xl font-bold text-primary">Pets Flow</span>
          </Link>
        </div>
        
        {renderDesktopNavigation()}
        
        <div className="flex items-center gap-2">
          {isMobile ? (
            renderMobileNavigation()
          ) : (
            <>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline">Panel Specjalisty</Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout}>
                    Wyloguj
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Logowanie</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Zarejestruj się</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>;
}
