
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpecialistCard, Specialist } from "@/components/specialists/SpecialistCard";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";

// Sample data for the catalog
const allSpecialists: Specialist[] = [
  {
    id: "1",
    name: "Anna Kowalska",
    title: "Dietetyk zwierzęcy",
    specializations: ["Dietetyka", "Żywienie psów", "Alergie pokarmowe"],
    location: "Warszawa",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=2376&auto=format&fit=crop",
    rating: 4.9,
    verified: true,
  },
  {
    id: "2",
    name: "Piotr Nowak",
    title: "Behawiorysta psów",
    specializations: ["Behawiorystyka", "Terapia lękowa", "Agresja"],
    location: "Kraków",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2369&auto=format&fit=crop",
    rating: 5.0,
    verified: true,
  },
  {
    id: "3",
    name: "Magdalena Wiśniewska",
    title: "Fizjoterapeuta zwierzęcy",
    specializations: ["Rehabilitacja", "Fizjoterapia", "Masaż"],
    location: "Wrocław",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2374&auto=format&fit=crop",
    rating: 4.8,
    verified: true,
  },
  {
    id: "4",
    name: "Tomasz Kaczmarek",
    title: "Trener psów",
    specializations: ["Szkolenie podstawowe", "Posłuszeństwo", "Trick training"],
    location: "Poznań",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2368&auto=format&fit=crop",
    rating: 4.7,
    verified: true,
  },
  {
    id: "5",
    name: "Karolina Zielińska",
    title: "Groomer",
    specializations: ["Strzyżenie", "Pielęgnacja", "Kąpiele"],
    location: "Łódź",
    image: "https://images.unsplash.com/photo-1605464066904-b98ef4522ffc?q=80&w=2370&auto=format&fit=crop",
    rating: 4.5,
    verified: true,
  },
  {
    id: "6",
    name: "Marcin Lewandowski",
    title: "Weterynarz",
    specializations: ["Diagnostyka", "Stomatologia", "Chirurgia"],
    location: "Gdańsk",
    image: "https://images.unsplash.com/photo-1570824104453-508955ab713e?q=80&w=2311&auto=format&fit=crop",
    rating: 4.9,
    verified: true,
  },
  {
    id: "7",
    name: "Julia Dąbrowska",
    title: "Dietetyk kotów",
    specializations: ["Żywienie kotów", "BARF", "Choroby metaboliczne"],
    location: "Warszawa",
    image: "https://images.unsplash.com/photo-1615812214207-34e3be6812df?q=80&w=2370&auto=format&fit=crop",
    rating: 4.6,
    verified: true,
  },
  {
    id: "8",
    name: "Robert Szymański",
    title: "Behawiorysta kotów",
    specializations: ["Zaburzenia zachowania", "Socjalizacja", "Terapia lękowa"],
    location: "Kraków",
    image: "https://images.unsplash.com/photo-1492370284958-c20b15c692d2?q=80&w=2049&auto=format&fit=crop",
    rating: 4.8,
    verified: true,
  }
];

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [currentSpecialists, setCurrentSpecialists] = useState(allSpecialists);

  const handleSearch = () => {
    filterSpecialists({ searchTerm, ...activeFilters });
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    filterSpecialists({ searchTerm, ...filters });
  };

  const filterSpecialists = (filters: any) => {
    let filtered = [...allSpecialists];

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        specialist =>
          specialist.name.toLowerCase().includes(term) ||
          specialist.title.toLowerCase().includes(term) ||
          specialist.specializations.some(spec => spec.toLowerCase().includes(term))
      );
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(
        specialist => specialist.location.toLowerCase().includes(location)
      );
    }

    // Filter by specializations
    if (filters.specializations && filters.specializations.length > 0) {
      filtered = filtered.filter(specialist =>
        specialist.specializations.some(spec =>
          filters.specializations.some((filterSpec: string) =>
            spec.toLowerCase().includes(filterSpec.toLowerCase())
          )
        )
      );
    }

    setCurrentSpecialists(filtered);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Katalog Specjalistów</h1>
        
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex-grow">
            <Input
              placeholder="Szukaj specjalisty, specjalizacji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleSearch} className="md:w-auto">
            Szukaj
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside className="md:col-span-1">
            <CatalogFilter onFilterChange={handleFilterChange} />
          </aside>
          
          <div className="md:col-span-3">
            <div className="mb-4">
              <p className="text-muted-foreground">
                Znaleziono {currentSpecialists.length} specjalistów
              </p>
            </div>
            
            {currentSpecialists.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentSpecialists.map(specialist => (
                  <SpecialistCard specialist={specialist} key={specialist.id} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <h3 className="mb-2 text-lg font-medium">Brak wyników</h3>
                <p className="text-muted-foreground">
                  Nie znaleziono specjalistów spełniających podane kryteria. Spróbuj zmienić filtry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;
