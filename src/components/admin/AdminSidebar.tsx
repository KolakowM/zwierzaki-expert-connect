
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    toast({
      title: "Wylogowano pomyślnie",
    });
    navigate("/");
  };

  const navItems = [
    {
      name: "Panel Główny",
      path: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Użytkownicy",
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Klienci",
      path: "/admin/clients",
      icon: <User className="h-5 w-5" />
    },
    {
      name: "Zwierzęta",
      path: "/admin/pets",
      icon: <Heart className="h-5 w-5" />
    },
    {
      name: "Wizyty",
      path: "/admin/visits",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Programy Opieki",
      path: "/admin/care-programs",
      icon: <ClipboardList className="h-5 w-5" />
    },
    {
      name: "Ustawienia",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300",
      expanded ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {expanded && (
            <Link to="/admin" className="flex items-center">
              <img 
                src="/lovable-uploads/5bdd954f-63dd-4a66-8c3f-96d62e366662.png" 
                alt="Pets Flow Logo" 
                className="w-8 h-8"
              />
              <span className="ml-2 text-xl font-bold text-primary">Admin</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(!expanded)}
            className="ml-auto"
          >
            {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex flex-col flex-grow p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors",
                location.pathname === item.path && "bg-primary/10 text-primary font-medium"
              )}
            >
              {item.icon}
              {expanded && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-200 p-4">
          {expanded && (
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
              !expanded && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {expanded && <span className="ml-2">Wyloguj</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
