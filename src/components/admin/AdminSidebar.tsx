import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { cn } from "@/lib/utils";

// Import the correct icon names
import { Users, Home, Clipboard, Calendar, Cog, PawPrint, Brain, Database } from "lucide-react";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  admin?: boolean;
}

const AdminSidebar = () => {
  const { isAdmin } = useAuth();

  const sidebarItems: SidebarItemProps[] = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      admin: true,
    },
    {
      href: "/admin/users",
      label: "Użytkownicy",
      icon: <Users className="h-5 w-5" />,
      admin: true,
    },
    {
      href: "/admin/clients",
      label: "Klienci",
      icon: <Clipboard className="h-5 w-5" />,
      admin: true,
    },
    {
      href: "/admin/pets",
      label: "Zwierzęta",
      icon: <PawPrint className="h-5 w-5" />,
      admin: true,
    },
    {
      href: "/admin/visits",
      label: "Wizyty",
      icon: <Calendar className="h-5 w-5" />,
      admin: true,
    },
    {
      href: "/admin/specializations",
      label: "Specjalizacje",
      icon: <Brain className="h-5 w-5" />,
      admin: true,
    },
    {
      href: "/admin/settings",
      label: "Ustawienia",
      icon: <Cog className="h-5 w-5" />,
      admin: true,
    },
    {
      href: "/admin/database-audit",
      label: "Audyt bazy danych",
      icon: <Database className="h-5 w-5" />,
      admin: true,
    },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-700">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Panel Administratora
        </h2>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {sidebarItems.map((item) => {
          if (item.admin && !isAdmin()) {
            return null;
          }

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50",
                  isActive
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                    : "text-gray-700 dark:text-gray-400"
                )
              }
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
