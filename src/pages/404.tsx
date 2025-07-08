
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Home, Users, Info, Mail, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const helpfulLinks = [
    {
      to: "/catalog",
      icon: Users,
      label: t("not_found.browse_specialists"),
    },
    {
      to: "/about",
      icon: Info,
      label: t("not_found.about_platform"),
    },
    {
      to: "/contact",
      icon: Mail,
      label: t("not_found.contact_us"),
    },
    {
      to: "/pricing",
      icon: DollarSign,
      label: t("not_found.pricing"),
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl text-center">
          <CardContent className="p-8 space-y-6">
            {/* Large 404 Number */}
            <div className="text-8xl font-bold text-primary/20 mb-4">
              404
            </div>
            
            {/* Title and Description */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">
                {t("not_found.title")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {t("not_found.description")}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("not_found.go_back")}
              </Button>
              
              <Button asChild className="flex items-center gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  {t("not_found.back_home")}
                </Link>
              </Button>
            </div>

            {/* Helpful Links Section */}
            <div className="pt-8 border-t">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                {t("not_found.helpful_links")}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {helpfulLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Button
                      key={link.to}
                      asChild
                      variant="ghost"
                      className="justify-start h-auto p-3 text-left"
                    >
                      <Link to={link.to} className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span>{link.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotFound;
