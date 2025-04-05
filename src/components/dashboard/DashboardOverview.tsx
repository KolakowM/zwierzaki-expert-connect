
import { Users, PawPrint, CalendarIcon, PieChart } from "lucide-react";
import StatsCard from "./StatsCard";
import UpcomingVisits from "./UpcomingVisits";
import ProfileStatus from "./ProfileStatus";
import { Client, Pet, Visit } from "@/types";

interface DashboardOverviewProps {
  clients: Client[];
  pets: Pet[];
  visits: Visit[];
}

const DashboardOverview = ({ clients, pets, visits }: DashboardOverviewProps) => {
  const stats = [
    {
      title: "Klienci",
      value: clients.length.toString(),
      description: "Zarejestrowanych klientów",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      link: "/clients"
    },
    {
      title: "Zwierzęta",
      value: pets.length.toString(),
      description: "Zarejestrowanych zwierząt",
      icon: <PawPrint className="h-4 w-4 text-muted-foreground" />,
      link: "/clients"
    },
    {
      title: "Wizyty",
      value: visits.length.toString(),
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

  // Get recent visits
  const recentVisits = [...visits].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            link={stat.link}
          />
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UpcomingVisits visits={recentVisits} pets={pets} clients={clients} />
        <ProfileStatus />
      </div>
    </div>
  );
};

export default DashboardOverview;
