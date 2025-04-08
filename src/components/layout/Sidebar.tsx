
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Calendar, 
  Settings, 
  PawPrint, 
  File, 
  FileCog, 
  Mail, 
  Bell, 
  ChevronRight, 
  CircleDollarSign, 
  LogOut 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className={cn("pb-12 min-h-screen flex flex-col", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Panel Specjalisty
          </h2>
          <div className="space-y-1">
            <Button 
              variant={location.pathname === "/dashboard" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              asChild
            >
              <NavLink to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Panel Główny
              </NavLink>
            </Button>
            
            <Button 
              variant={location.pathname.startsWith("/clients") ? "secondary" : "ghost"} 
              className="w-full justify-start"
              asChild
            >
              <NavLink to="/clients">
                <Users className="mr-2 h-4 w-4" />
                Klienci
              </NavLink>
            </Button>
            
            <Button 
              variant={location.pathname.startsWith("/pets") ? "secondary" : "ghost"} 
              className="w-full justify-start"
              asChild
            >
              <NavLink to="/pets">
                <PawPrint className="mr-2 h-4 w-4" />
                Zwierzęta
              </NavLink>
            </Button>

            <Button 
              variant={location.pathname === "/calendar" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              asChild
            >
              <NavLink to="/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Kalendarz
              </NavLink>
            </Button>
          </div>
        </div>
        
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Narzędzia
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Komunikacja
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileCog className="mr-2 h-4 w-4" />
              Dokumenty
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Płatności
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Zarządzanie
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <NavLink to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Ustawienia
              </NavLink>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <NavLink to="/profile">
                <File className="mr-2 h-4 w-4" />
                Profil
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2 mt-auto border-t">
        <div className="space-y-1 pt-2">
          <Button variant="ghost" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />
            Powiadomienia
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
