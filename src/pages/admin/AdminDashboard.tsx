
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Heart, 
  CalendarCheck, 
  ClipboardList, 
  ArrowUpCircle, 
  ArrowDownCircle 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getPets } from "@/services/petService";
import { getVisits } from "@/services/visitService";

const AdminDashboard = () => {
  const [timeRange] = useState("month"); // Could be "day", "week", "month", "year"
  
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  
  const { data: pets = [] } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });
  
  const { data: visits = [] } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
  });

  // These would be computed with real data in a production app
  const stats = [
    {
      title: "Klienci",
      icon: <Users className="h-5 w-5" />,
      value: clients.length,
      change: {
        value: "+12%",
        positive: true
      },
      description: `W tym ${timeRange}`
    },
    {
      title: "Zwierzęta",
      icon: <Heart className="h-5 w-5" />,
      value: pets.length,
      change: {
        value: "+8%",
        positive: true
      },
      description: `W tym ${timeRange}`
    },
    {
      title: "Wizyty",
      icon: <CalendarCheck className="h-5 w-5" />,
      value: visits.length,
      change: {
        value: "+20%",
        positive: true
      },
      description: `W tym ${timeRange}`
    },
    {
      title: "Programy Opieki",
      icon: <ClipboardList className="h-5 w-5" />,
      value: 24,
      change: {
        value: "-5%",
        positive: false
      },
      description: `W tym ${timeRange}`
    }
  ];

  const recentActivity = [
    { 
      type: "client", 
      action: "Nowy klient dodany", 
      name: "Anna Kowalska", 
      date: "2 godziny temu" 
    },
    { 
      type: "pet", 
      action: "Nowe zwierzę dodane", 
      name: "Max (pies)", 
      date: "3 godziny temu" 
    },
    { 
      type: "visit", 
      action: "Nowa wizyta", 
      name: "Wizyta kontrolna: Burek", 
      date: "5 godzin temu" 
    },
    { 
      type: "care", 
      action: "Nowy program opieki", 
      name: "Plan odchudzania: Filemon", 
      date: "1 dzień temu" 
    },
  ];

  return (
    <>
      <AdminHeader 
        title="Panel Administratora" 
        description="Przegląd statystyk i aktywności platformy"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded bg-primary/10 p-1 text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.change.positive ? 
                  <ArrowUpCircle className="mr-1 h-4 w-4 text-green-500" /> : 
                  <ArrowDownCircle className="mr-1 h-4 w-4 text-red-500" />
                }
                <span className={stat.change.positive ? "text-green-500" : "text-red-500"}>
                  {stat.change.value}
                </span>
                <span className="text-muted-foreground ml-1">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ostatnia Aktywność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    {activity.type === "client" && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === "pet" && <Heart className="h-4 w-4 text-primary" />}
                    {activity.type === "visit" && <CalendarCheck className="h-4 w-4 text-primary" />}
                    {activity.type === "care" && <ClipboardList className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status Systemu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Serwer API</p>
                <span className="flex items-center text-green-600 text-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-600"></span>
                  Aktywny
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Baza danych</p>
                <span className="flex items-center text-green-600 text-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-600"></span>
                  Aktywna
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">System płatności</p>
                <span className="flex items-center text-green-600 text-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-600"></span>
                  Aktywny
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Usługa powiadomień</p>
                <span className="flex items-center text-yellow-600 text-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-yellow-600"></span>
                  Częściowo dostępna
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Ostatnie odświeżenie</p>
                <p className="text-sm text-muted-foreground">2 minuty temu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
