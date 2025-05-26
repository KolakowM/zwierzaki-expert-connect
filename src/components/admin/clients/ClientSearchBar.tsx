
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";
import { Client } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ClientSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ClientSearchBar = ({ searchQuery, setSearchQuery }: ClientSearchBarProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleClientSaved = (client: Omit<Client, 'id' | 'createdAt'>) => {
    // Invalidate clients query to refresh data after adding a new client
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    
    toast({
      title: "Klient dodany pomyślnie",
      description: `${client.firstName} ${client.lastName} został dodany do bazy klientów`
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj klientów..."
          className="pl-8 w-full sm:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ResponsiveClientForm
        buttonText="Dodaj Klienta"
        buttonVariant="default"
        onClientSaved={handleClientSaved}
      >
        <UserPlus className="mr-2 h-4 w-4" /> Dodaj Klienta
      </ResponsiveClientForm>
    </div>
  );
};

export default ClientSearchBar;
