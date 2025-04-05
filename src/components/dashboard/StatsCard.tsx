
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  link: string;
  color?: "default" | "green" | "blue" | "amber" | "red";
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  link,
  color = "default" 
}: StatsCardProps) => {
  // Define color classes based on the color prop
  const colorClasses = {
    default: "",
    green: "text-green-500",
    blue: "text-blue-500",
    amber: "text-amber-500",
    red: "text-red-500"
  };

  const valueColorClass = colorClasses[color];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link to={link}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`${colorClasses[color]} p-2 rounded-md bg-muted/50`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${valueColorClass}`}>{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default StatsCard;
