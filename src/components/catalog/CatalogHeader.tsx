
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface CatalogHeaderProps {
  onSearch: (searchTerm: string) => void;
}

export function CatalogHeader({ onSearch }: CatalogHeaderProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">{t('catalog.title')}</h1>
      
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="flex-grow">
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>
        <Button onClick={handleSearch} className="md:w-auto">
          {t('common.search')}
        </Button>
      </div>
    </>
  );
}
