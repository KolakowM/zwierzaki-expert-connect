
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CatalogSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export function CatalogSearch({ searchTerm, setSearchTerm, handleSearch }: CatalogSearchProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <div className="flex-grow">
        <Input
          placeholder="Szukaj użytkownika, specjalizacji..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <Button onClick={handleSearch} className="md:w-auto">
        <Search className="mr-2 h-4 w-4" />
        Szukaj
      </Button>
    </div>
  );
}
