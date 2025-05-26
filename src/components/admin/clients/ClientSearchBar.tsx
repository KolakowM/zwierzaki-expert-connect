
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClientSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ClientSearchBar = ({ searchQuery, setSearchQuery }: ClientSearchBarProps) => {
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
    </div>
  );
};

export default ClientSearchBar;
