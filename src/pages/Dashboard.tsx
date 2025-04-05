import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Users, FileText, ChevronDown, PieChart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby zobaczyć ten panel",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Wylogowano pomyślnie",
      description: "Do zobaczenia wkrótce!",
    });
    navigate("/");
  };

  const stats = [
    {
      title: "Klienci",
      value: "0",
      description: "Zarejestrowanych klientów",
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Zwierzęta",
      value: "0",
      description: "Zarejestrowanych zwierząt",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Wizyty",
      value: "0",
      description: "Zaplanowane wizyty",
      icon: <CalendarIcon className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Plan",
      value: "Podstawowy",
      description: "Aktualny plan subskrypcji",
      icon: <PieChart className="h-4 w-4 text-muted-foreground" />
    }
  ];

  if (!isAuthenticated) {
    return <div />;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Panel Specjalisty</h1>
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <span className="mr-2">{user?.firstName} {user?.lastName}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-4">
                      <li>
                        <Link to="/dashboard/profile">
                          <NavigationMenuLink
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Ustawienia</div>
                            </div>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-3"
                          onClick={handleLogout}
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
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="clients">Klienci</TabsTrigger>
            <TabsTrigger value="animals">Zwierzęta</TabsTrigger>
            <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Nadchodzące wizyty</CardTitle>
                  <CardDescription>
                    Nie masz zaplanowanych wizyt na ten tydzień.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Kliknij "Kalendarz", aby zaplanować nową wizytę</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Status profilu</CardTitle>
                  <CardDescription>
                    Uzupełnij swój profil, aby był widoczny w katalogu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dane podstawowe</span>
                      <span className="text-xs text-amber-500 font-medium">Częściowo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Specjalizacje</span>
                      <span className="text-xs text-red-500 font-medium">Brak</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zdjęcie</span>
                      <span className="text-xs text-red-500 font-medium">Brak</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dane kontaktowe</span>
                      <span className="text-xs text-green-500 font-medium">Kompletne</span>
                    </div>
                    <Button size="sm" className="mt-2">
                      Edytuj profil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Baza klientów</CardTitle>
                <CardDescription>
                  Zarządzaj swoimi klientami
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <Users className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Nie masz jeszcze żadnych klientów</p>
                    <Button size="sm" className="mt-4">Dodaj klienta</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="animals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Zwierzęta</CardTitle>
                <CardDescription>
                  Zarządzaj profilami zwierząt swoich klientów
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Nie masz jeszcze żadnych zarejestrowanych zwierząt</p>
                    <Button size="sm" className="mt-4">Dodaj zwierzę</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kalendarz</CardTitle>
                <CardDescription>
                  Zarządzaj swoimi wizytami i konsultacjami
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Kalendarz zostanie zaimplementowany wkrótce</p>
                    <p className="text-xs text-muted-foreground mt-1">Funkcja dostępna w przyszłej aktualizacji</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
