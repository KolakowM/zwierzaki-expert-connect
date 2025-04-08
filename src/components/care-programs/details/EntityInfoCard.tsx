
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoItem {
  label: string;
  value: string | undefined | null;
}

interface EntityInfoCardProps {
  title: string;
  Icon: LucideIcon;
  infoItems: InfoItem[];
  emptyMessage?: string;
}

const EntityInfoCard = ({ 
  title, 
  Icon, 
  infoItems, 
  emptyMessage = "Dane niedostępne" 
}: EntityInfoCardProps) => {
  const hasData = infoItems.some(item => item.value);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {hasData ? (
          <div className="space-y-2">
            {infoItems.map((item, index) => (
              item.value && (
                <div key={index} className="flex justify-between">
                  <span className="font-medium">{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityInfoCard;
