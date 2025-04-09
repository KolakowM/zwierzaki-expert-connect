
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/dashboard/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/5bdd954f-63dd-4a66-8c3f-96d62e366662.png" 
              alt="PetsFlow Logo" 
              className="h-8 w-8" 
            />
            <span className="ml-2 text-xl font-bold">PetsFlow</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/clients">
                <Button variant="ghost" size="sm">
                  Klienci
                </Button>
              </Link>
              <Link to="/pets">
                <Button variant="ghost" size="sm">
                  Zwierzęta
                </Button>
              </Link>
              <Link to="/visits">
                <Button variant="ghost" size="sm">
                  Wizyty
                </Button>
              </Link>
              <UserMenu 
                firstName={user?.firstName} 
                lastName={user?.lastName}
                onLogout={logout} 
              />
            </>
          ) : (
            <>
              <Link to="/register">
                <Button variant="ghost" size="sm">
                  Rejestracja
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm">Logowanie</Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>PetsFlow</SheetTitle>
                <SheetDescription>
                  System do zarządzania gabinetem weterynaryjnym
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/clients">
                      <Button variant="ghost" className="w-full justify-start">
                        Klienci
                      </Button>
                    </Link>
                    <Link to="/pets">
                      <Button variant="ghost" className="w-full justify-start">
                        Zwierzęta
                      </Button>
                    </Link>
                    <Link to="/visits">
                      <Button variant="ghost" className="w-full justify-start">
                        Wizyty
                      </Button>
                    </Link>
                    <Link to="/settings">
                      <Button variant="ghost" className="w-full justify-start">
                        Ustawienia
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start mt-4"
                      onClick={logout}
                    >
                      Wyloguj
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button variant="outline" className="w-full">
                        Rejestracja
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button className="w-full">Logowanie</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
