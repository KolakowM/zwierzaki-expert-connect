
import { Client, Pet, Visit, CareProgram } from "@/types";

export const mockClients: Client[] = [
  {
    id: "1",
    firstName: "Anna",
    lastName: "Kowalska",
    email: "anna.kowalska@example.com",
    phone: "+48 123 456 789",
    address: "ul. Kwiatowa 1",
    city: "Warszawa",
    postCode: "00-001",
    createdAt: "2023-01-15T10:30:00Z",
    notes: "Regularny klient, przychodzi co miesiąc."
  },
  {
    id: "2",
    firstName: "Piotr",
    lastName: "Nowak",
    email: "piotr.nowak@example.com",
    phone: "+48 987 654 321",
    address: "ul. Słoneczna 5",
    city: "Kraków",
    postCode: "30-001",
    createdAt: "2023-02-20T14:15:00Z",
    notes: "Dwóch psów i jeden kot."
  },
  {
    id: "3",
    firstName: "Magdalena",
    lastName: "Wiśniewska",
    email: "magda.wisniewska@example.com",
    phone: "+48 555 444 333",
    address: "ul. Lipowa 8",
    city: "Wrocław",
    postCode: "50-001",
    createdAt: "2023-03-05T09:00:00Z",
    notes: "Alergiczny na niektóre karmy dla psów. Kot ma specjalną dietę."
  }
];

export const mockPets: Pet[] = [
  {
    id: "1",
    clientId: "1",
    name: "Azor",
    species: "pies",
    breed: "Labrador",
    age: 3,
    weight: 28.5,
    sex: "samiec",
    neutered: true,
    medicalHistory: "Szczepienia aktualne, leczenie zgryzu w 2022",
    allergies: "Brak",
    dietaryRestrictions: "Dieta niskokaloryczna",
    behavioralNotes: "Przyjazny, dobrze socjalizowany",
    createdAt: "2023-01-15T10:35:00Z"
  },
  {
    id: "2",
    clientId: "2",
    name: "Max",
    species: "pies",
    breed: "Owczarek niemiecki",
    age: 5,
    weight: 32.2,
    sex: "samiec",
    neutered: false,
    medicalHistory: "Problemy ze stawami, suplementacja",
    allergies: "Kurczak",
    dietaryRestrictions: "Dieta bez kurczaka, suplementacja olejem rybim",
    behavioralNotes: "Lekko lękliwy przy nowych sytuacjach",
    createdAt: "2023-02-20T14:20:00Z"
  },
  {
    id: "3",
    clientId: "2",
    name: "Luna",
    species: "pies",
    breed: "Border Collie",
    age: 2,
    weight: 18.5,
    sex: "samica",
    neutered: true,
    medicalHistory: "Zdrowa, regularne szczepienia",
    allergies: "Brak",
    dietaryRestrictions: "Standardowa dieta",
    behavioralNotes: "Bardzo energiczna, potrzebuje dużo ruchu",
    createdAt: "2023-02-20T14:25:00Z"
  },
  {
    id: "4",
    clientId: "2",
    name: "Mruczek",
    species: "kot",
    breed: "Europejski",
    age: 4,
    weight: 5.2,
    sex: "samiec",
    neutered: true,
    medicalHistory: "Problemy z nerkami wykryte w 2022",
    allergies: "Brak",
    dietaryRestrictions: "Specjalna karma nerkowa",
    behavioralNotes: "Spokojny, domator",
    createdAt: "2023-02-20T14:30:00Z"
  },
  {
    id: "5",
    clientId: "3",
    name: "Fuks",
    species: "kot",
    breed: "Maine Coon",
    age: 3,
    weight: 7.8,
    sex: "samiec",
    neutered: true,
    medicalHistory: "Zdrowy, regularnie szczepiony",
    allergies: "Ryby morskie",
    dietaryRestrictions: "Dieta bez ryb morskich",
    behavioralNotes: "Towarzyski, lubi zabawę",
    createdAt: "2023-03-05T09:10:00Z"
  }
];

export const mockVisits: Visit[] = [
  {
    id: "1",
    petId: "1",
    clientId: "1",
    date: "2023-04-10T11:00:00Z",
    type: "Kontrola ogólna",
    notes: "Pies w dobrej kondycji, waga stabilna",
    recommendations: "Kontynuować obecną dietę, zwiększyć aktywność fizyczną",
    followUpNeeded: true,
    followUpDate: "2023-07-10T00:00:00Z"
  },
  {
    id: "2",
    petId: "2",
    clientId: "2",
    date: "2023-05-15T14:30:00Z",
    type: "Konsultacja ortopedyczna",
    notes: "Widoczna poprawa w poruszaniu się po suplementacji",
    recommendations: "Kontynuować suplementację, łagodne ćwiczenia rehabilitacyjne",
    followUpNeeded: true,
    followUpDate: "2023-06-15T00:00:00Z"
  },
  {
    id: "3",
    petId: "4",
    clientId: "2",
    date: "2023-05-20T10:00:00Z",
    type: "Badanie krwi - kontrola nerek",
    notes: "Parametry stabilne, ale wciąż podwyższone",
    recommendations: "Kontynuować dietę nerkową, zwiększyć nawodnienie",
    followUpNeeded: true,
    followUpDate: "2023-08-20T00:00:00Z"
  }
];

export const mockCarePrograms: CareProgram[] = [
  {
    id: "1",
    petId: "1",
    name: "Plan redukcji wagi",
    goal: "Zmniejszenie wagi o 2kg w ciągu 3 miesięcy",
    description: "Stopniowa redukcja kalorii i zwiększenie aktywności fizycznej",
    startDate: "2023-04-10T00:00:00Z",
    endDate: "2023-07-10T00:00:00Z",
    status: "aktywny",
    instructions: "1. Karma niskokaloryczna 2x dziennie po 100g\n2. Spacery min. 45 minut 2x dziennie\n3. Zakaz dodatkowych przysmaków",
    recommendations: "Cotygodniowe ważenie i zapisywanie postępów",
    createdAt: "2023-04-10T11:30:00Z"
  },
  {
    id: "2",
    petId: "2",
    name: "Program wsparcia stawów",
    goal: "Poprawa mobilności i zmniejszenie bólu stawów",
    description: "Suplementacja i ćwiczenia rehabilitacyjne",
    startDate: "2023-05-15T00:00:00Z",
    endDate: "2023-08-15T00:00:00Z",
    status: "aktywny",
    instructions: "1. Suplement na stawy 2x dziennie\n2. Olej rybi 1 łyżka dziennie\n3. Ćwiczenia rehabilitacyjne według załączonego schematu",
    recommendations: "Unikać skoków i intensywnej aktywności obciążającej stawy",
    createdAt: "2023-05-15T15:00:00Z"
  }
];
