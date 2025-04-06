
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

export default function Header() {
  const {
    isAuthenticated,
    logout
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Wylogowano pomyślnie",
      description: "Do zobaczenia wkrótce!"
    });
    navigate("/");
  };
  
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
        <nav className="hidden gap-6 md:flex">
          <Link to="/catalog" className="text-sm font-medium hover:text-primary">
            Katalog Specjalistów
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            O Platformie
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-primary">
            Cennik
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">
            Kontakt
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? <>
              <Link to="/account" className="flex items-center gap-1">
                <Button variant="outline" size="sm">
                  <UserCircle className="mr-1 h-4 w-4" />
                  Konto
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline">Panel Specjalisty</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Wyloguj
              </Button>
            </> : <>
              <Link to="/login">
                <Button variant="ghost">Logowanie</Button>
              </Link>
              <Link to="/register">
                <Button>Zarejestruj się</Button>
              </Link>
            </>}
        </div>
      </div>
    </header>;
}
