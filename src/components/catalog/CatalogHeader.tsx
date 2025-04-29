
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CatalogHeaderProps {
  onSearch: (searchTerm: string) => void;
}

export function CatalogHeader({ onSearch }: CatalogHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Katalog Użytkowników</h1>
      
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
          Szukaj
        </Button>
      </div>
    </>
  );
}
