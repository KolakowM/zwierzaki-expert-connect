
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { AccessibleImage } from "@/components/ui/accessible-image";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    toast({
      title: t("auth.logout_success"),
      description: t("auth.logout_goodbye")
    });
    navigate("/");
  };

  const navigationLinks = [
    {
      to: "/catalog",
      label: t("header.catalog")
    },
    {
      to: "/about",
      label: t("header.about")
    },
    {
      to: "/pricing",
      label: t("header.pricing")
    },
    {
      to: "/contact",
      label: t("header.contact")
    }
  ];

  const renderDesktopNavigation = () => (
    <nav id="navigation" className="hidden gap-6 lg:flex" role="navigation" aria-label="Nawigacja główna">
      {navigationLinks.map(link => (
        <Link key={link.to} to={link.to} className="text-sm font-medium hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1">
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const renderMobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="lg:hidden"
          aria-label="Otwórz menu nawigacji"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" aria-label="Menu nawigacji mobilnej">
        <nav className="flex flex-col gap-4 mt-8" role="navigation" aria-label="Nawigacja mobilna">
          {navigationLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-base font-medium hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm py-2">
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-base font-medium hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm py-2">
                {t("header.dashboard")}
              </Link>
              <Link to="/settings" className="text-base font-medium hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm py-2">
                {t("header.settings")}
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="justify-start px-0"
                aria-label="Wyloguj się z konta"
              >
                {t("header.logout")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-base font-medium hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm py-2">
                {t("header.login")}
              </Link>
              <Link to="/register" className="text-base font-medium hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm py-2">
                {t("header.register")}
              </Link>
            </>
          )}
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="w-full border-b" role="banner">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm">
            <AccessibleImage 
              src="/lovable-uploads/5bdd954f-63dd-4a66-8c3f-96d62e366662.png" 
              alt="PetsFlow - logo platformy dla specjalistów zwierząt" 
              className="w-8 h-8" 
            />
            <span className="font-bold text-xl md:text-2xl">
              <span className="text-primary">Pets</span>Flow
            </span>
          </Link>
        </div>
        
        {renderDesktopNavigation()}
        
        <div className="flex items-center gap-2">
          {window.innerWidth < 1024 ? (
            renderMobileNavigation()
          ) : (
            <>
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline">{t("header.dashboard")}</Button>
                  </Link>
                  <Link to="/settings">
                    <Button variant="outline">
                      <UserCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      {t("header.settings")}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    aria-label="Wyloguj się z konta"
                  >
                    {t("header.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">{t("header.login")}</Button>
                  </Link>
                  <Link to="/register">
                    <Button>{t("header.register")}</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
