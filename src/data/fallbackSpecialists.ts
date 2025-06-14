
import { Specialist } from "@/components/specialists/SpecialistCard";

export const fallbackSpecialists: Specialist[] = [
  {
    id: "fallback-1",
    name: "Anna Kowalska",
    title: "Dietetyk zwierzęcy",
    specializations: ["Dietetyka", "Żywienie psów", "Alergie pokarmowe"],
    location: "Warszawa",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=2376&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2369&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2374&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2368&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2374&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2370&auto=format&fit=crop",
    rating: 4.6,
    verified: true,
    role: "specialist",
    is_featured: false
  }
];
