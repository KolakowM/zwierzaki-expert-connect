
# PetsFlow - Platforma CRM dla Specjalistów ds. Zwierząt

**URL**: https://lovable.dev/projects/cfd3f4d1-d336-4d85-9e01-cd949eae4bc0

## O Projekcie

PetsFlow to nowoczesna platforma SaaS łącząca właścicieli zwierząt z wykwalifikowanymi specjalistami oraz oferująca zaawansowany system CRM dla specjalistów do zarządzania swoją praktyką. Aplikacja umożliwia specjalistom efektywne zarządzanie klientami, zwierzętami, wizytami i programami opieki, a właścicielom zwierząt łatwe znajdowanie odpowiednich specjalistów.

## Kluczowe Funkcjonalności

### 🐾 **Katalog Specjalistów**
- Publiczny katalog z filtrowaniem po specjalizacji i lokalizacji
- Profile specjalistów z opisem doświadczenia i kontaktami
- System weryfikacji i statusów specjalistów
- Karuzela polecanych specjalistów

### 👥 **System CRM**
- Zarządzanie klientami z pełnymi danymi kontaktowymi
- Profile zwierząt z historią medyczną, szczepieniami i pomiarami
- Kalendarz wizyt z notatkami i zaleceniami
- Programy opieki długoterminowej
- System notatek z załącznikami

### 💳 **Model Subskrypcji**
- **Pakiet Trial** (darmowy) - podstawowe funkcje do testowania
- **Pakiet Zaawansowany** (49 zł/mies) - dla rozwijających się praktyk
- **Pakiet Zawodowiec** (99 zł/mies) - dla profesjonalnych praktyk
- Kontrola limitów użycia według wykupionego pakietu
- Integracja z systemem płatności Stripe

### 🔧 **Panel Administratora**
- Zarządzanie wszystkimi danymi w systemie
- Audyt bezpieczeństwa bazy danych
- Zarządzanie użytkownikami i rolami
- Statystyki i raporty systemowe

## Technologie

### Frontend
- **React 18** z TypeScript
- **Tailwind CSS** + shadcn/ui
- **React Router Dom** - routing
- **React Hook Form** + Zod - formularze z walidacją
- **TanStack Query** - zarządzanie stanem i cache
- **i18next** - internacjonalizacja (PL, EN, DE, UK)
- **React Quill** - edytor tekstu sformatowanego
- **Embla Carousel** - karuzele z autoodtwarzaniem

### Backend & Usługi
- **Supabase** - baza danych PostgreSQL, autoryzacja, storage
- **Edge Functions** - logika biznesowa po stronie serwera
- **Stripe** - system płatności
- **Row Level Security** - bezpieczeństwo danych na poziomie bazy

## Jak Uruchomić Projekt Lokalnie

### Wymagania
- Node.js & npm - [zainstaluj z nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Kroki Instalacji

```sh
# 1. Klonowanie repozytorium
git clone <YOUR_GIT_URL>

# 2. Przejście do katalogu projektu
cd <YOUR_PROJECT_NAME>

# 3. Instalacja zależności
npm i

# 4. Uruchomienie serwera deweloperskiego
npm run dev
```

## Sposoby Edycji Kodu

### 🚀 **Lovable (Zalecane)**
Odwiedź [Projekt Lovable](https://lovable.dev/projects/cfd3f4d1-d336-4d85-9e01-cd949eae4bc0) i zacznij wprowadzać zmiany poprzez chat z AI.

### 💻 **Lokalne IDE**
Sklonuj repozytorium i wprowadzaj zmiany lokalnie. Zmiany będą automatycznie synchronizowane z Lovable.

### 🌐 **GitHub**
- Przejdź do żądanego pliku
- Kliknij "Edit" (ikona ołówka)
- Wprowadź zmiany i zatwierdź

### ☁️ **GitHub Codespaces**
- Kliknij "Code" > "Codespaces" > "New codespace"
- Edytuj pliki bezpośrednio w przeglądarce

## Deployment

### Publikacja przez Lovable
Otwórz [Lovable](https://lovable.dev/projects/cfd3f4d1-d336-4d85-9e01-cd949eae4bc0) i kliknij Share → Publish.

### Własna Domena
Aby podłączyć własną domenę:
1. Przejdź do Project > Settings > Domains
2. Kliknij Connect Domain
3. Postępuj zgodnie z instrukcjami

Więcej informacji: [Konfiguracja domeny](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Struktura Aplikacji

### Główne Strony
- **/** - Strona główna z karuzelą specjalistów
- **/catalog** - Katalog specjalistów z filtrowaniem
- **/pricing** - Cennik pakietów subskrypcji
- **/dashboard** - Panel CRM specjalisty
- **/clients** - Zarządzanie klientami
- **/pets** - Zarządzanie zwierzętami
- **/admin** - Panel administratora

### Kluczowe Komponenty
- **Responsive Design** - pełne wsparcie urządzeń mobilnych
- **Wielojęzyczność** - interfejs w 4 językach
- **System Ról** - użytkownicy, specjaliści, administratorzy
- **Bezpieczeństwo** - RLS, autoryzacja, walidacja

## Wsparcie i Dokumentacja

- 📖 [Dokumentacja Lovable](https://docs.lovable.dev/)
- 💬 [Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 🎥 [Tutorial YouTube](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)
- 🚀 [Przewodnik Quickstart](https://docs.lovable.dev/user-guides/quickstart)

## Licencja

© 2025 PetsFlow. Wszelkie prawa zastrzeżone.

---

**Kontakt**: kontakt@petsflow.pl | Warszawa, Polska
