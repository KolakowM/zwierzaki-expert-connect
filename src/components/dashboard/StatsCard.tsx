
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  link: string;
}

const StatsCard = ({ title, value, description, icon, link }: StatsCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link to={link}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default StatsCard;
