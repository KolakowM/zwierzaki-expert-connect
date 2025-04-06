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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
              <path d="M14.5 5.173c0-1.39 1.577-2.493 3.5-2.173 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5" />
              <path d="M8 14v.5" />
              <path d="M16 14v.5" />
              <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
            </svg>
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