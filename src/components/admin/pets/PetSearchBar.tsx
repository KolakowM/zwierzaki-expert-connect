
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CardHeader } from "@/components/ui/card";

interface PetSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PetSearchBar = ({ searchQuery, setSearchQuery }: PetSearchBarProps) => {
  return (
    <CardHeader>
      <div className="flex items-center w-full max-w-sm space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Szukaj zwierząt..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default PetSearchBar;
