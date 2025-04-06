
import { Link } from "react-router-dom";
import { Settings, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  firstName: string | undefined;
  lastName: string | undefined;
  onLogout: () => void;
}

const UserMenu = ({ firstName, lastName, onLogout }: UserMenuProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span className="mr-2">{firstName} {lastName}</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-4">
              <li>
                <Link to="/account">
                  <NavigationMenuLink
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      <div className="text-sm font-medium leading-none">Edytuj profil</div>
                    </div>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <NavigationMenuLink
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <div className="text-sm font-medium leading-none">Panel specjalisty</div>
                    </div>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-3"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Wyloguj</span>
                </Button>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UserMenu;
