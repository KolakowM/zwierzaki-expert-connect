
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Users, FileText, ChevronDown, PieChart, Settings, LogOut, PawPrint } from "lucide-react";
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
import { mockClients, mockPets, mockVisits } from "@/data/mockData";

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
      value: mockClients.length.toString(),
      description: "Zarejestrowanych klientów",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      link: "/clients"
    },
    {
      title: "Zwierzęta",
      value: mockPets.length.toString(),
      description: "Zarejestrowanych zwierząt",
      icon: <PawPrint className="h-4 w-4 text-muted-foreground" />,
      link: "/clients"
    },
    {
      title: "Wizyty",
      value: mockVisits.length.toString(),
      description: "Zaplanowane wizyty",
      icon: <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
      link: "/dashboard"
    },
    {
      title: "Plan",
      value: "Podstawowy",
      description: "Aktualny plan subskrypcji",
      icon: <PieChart className="h-4 w-4 text-muted-foreground" />,
      link: "/dashboard"
    }
  ];

  if (!isAuthenticated) {
    return <div />;
  }

  // Get recent visits
  const recentVisits = [...mockVisits].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);

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
            <TabsTrigger value="clients">
              <Link to="/clients" className="flex items-center">Klienci</Link>
            </TabsTrigger>
            <TabsTrigger value="animals">Zwierzęta</TabsTrigger>
            <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <Link to={stat.link}>
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
                  </Link>
                </Card>
              ))}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Nadchodzące wizyty</CardTitle>
                  <CardDescription>
                    {recentVisits.length > 0 
                      ? 'Twoje najbliższe zaplanowane wizyty' 
                      : 'Nie masz zaplanowanych wizyt na ten tydzień'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentVisits.length > 0 ? (
                    <div className="space-y-4">
                      {recentVisits.map(visit => {
                        const pet = mockPets.find(p => p.id === visit.petId);
                        const client = mockClients.find(c => c.id === visit.clientId);
                        return (
                          <div key={visit.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                            <div>
                              <p className="font-medium">{new Date(visit.date).toLocaleDateString('pl-PL')}, {new Date(visit.date).toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}</p>
                              <p className="text-sm text-muted-foreground">{visit.type} - {pet?.name} ({client?.firstName} {client?.lastName})</p>
                            </div>
                            <Button variant="outline" size="sm">Szczegóły</Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Kliknij "Kalendarz", aby zaplanować nową wizytę</p>
                      </div>
                    </div>
                  )}
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
              <CardContent className="flex flex-col items-center justify-center text-center p-4">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Przejdź do bazy klientów</p>
                <p className="text-sm text-muted-foreground mb-4">Przeglądaj, dodawaj i zarządzaj klientami oraz ich zwierzętami</p>
                <Button asChild>
                  <Link to="/clients">
                    <Users className="mr-2 h-4 w-4" />
                    Zarządzaj klientami
                  </Link>
                </Button>
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
                {mockPets.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-medium">Ostatnio dodane zwierzęta</p>
                      <Link to="/clients" className="text-sm text-primary hover:underline">
                        Zobacz wszystkie
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockPets.slice(0, 6).map(pet => {
                        const owner = mockClients.find(c => c.id === pet.clientId);
                        return (
                          <Card key={pet.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <PawPrint className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <h3 className="font-medium">{pet.name}</h3>
                                </div>
                                <span className="text-xs text-muted-foreground">{pet.species}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Właściciel: {owner?.firstName} {owner?.lastName}
                              </p>
                              <Button variant="outline" size="sm" asChild className="w-full">
                                <Link to={`/pets/${pet.id}`}>
                                  Zobacz profil
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Nie masz jeszcze żadnych zarejestrowanych zwierząt</p>
                      <Link to="/clients">
                        <Button size="sm" className="mt-4">Dodaj zwierzę</Button>
                      </Link>
                    </div>
                  </div>
                )}
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
