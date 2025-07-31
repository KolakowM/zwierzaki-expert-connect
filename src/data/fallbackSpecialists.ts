
import { Specialist } from "@/components/specialists/SpecialistCard";

export const fallbackSpecialists: Specialist[] = [
  {
    id: "fallback-1",
    name: "Anna Kowalska",
    title: "Dietetyk zwierzęcy",
    specializations: ["Dietetyka", "Żywienie psów", "Alergie pokarmowe"],
    location: "Warszawa",
    image: null,
    rating: 4.9,
    verified: true,
    role: "specialist",
    is_featured: true
  },
  {
    id: "fallback-2",
    name: "Piotr Nowak",
    title: "Behawiorysta psów",
    specializations: ["Behawiorystyka", "Terapia lękowa", "Agresja"],
    location: "Kraków",
    image: null,
    rating: 5.0,
    verified: true,
    role: "specialist",
    is_featured: false
  },
  {
    id: "fallback-3",
    name: "Magdalena Wiśniewska",
    title: "Fizjoterapeuta zwierzęcy",
    specializations: ["Rehabilitacja", "Fizjoterapia", "Masaż"],
    location: "Wrocław",
    image: null,
    rating: 4.8,
    verified: true,
    role: "specialist",
    is_featured: true
  },
  {
    id: "fallback-4",
    name: "Tomasz Kaczmarek",
    title: "Trener psów",
    specializations: ["Szkolenie podstawowe", "Posłuszeństwo", "Trick training"],
    location: "Poznań",
    image: null,
    rating: 4.7,
    verified: true,
    role: "specialist",
    is_featured: false
  },
  {
    id: "fallback-5",
    name: "Katarzyna Zielińska",
    title: "Weterynarz",
    specializations: ["Chirurgia", "Diagnostyka", "Medycyna wewnętrzna"],
    location: "Gdańsk",
    image: null,
    rating: 4.9,
    verified: true,
    role: "specialist",
    is_featured: true
  },
  {
    id: "fallback-6",
    name: "Michał Nowicki",
    title: "Groomer",
    specializations: ["Strzyżenie", "Pielęgnacja", "SPA dla zwierząt"],
    location: "Łódź",
    image: null,
    rating: 4.6,
    verified: true,
    role: "specialist",
    is_featured: false
  }
];
