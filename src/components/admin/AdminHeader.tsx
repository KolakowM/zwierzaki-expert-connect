
import { useAuth } from "@/contexts/AuthProvider"; // Updated import path
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

const AdminHeader = ({ title, description }: AdminHeaderProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <BellIcon className="h-4 w-4" />
          <span className="sr-only">Powiadomienia</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <span className="font-medium hidden md:block">{user?.firstName} {user?.lastName}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
