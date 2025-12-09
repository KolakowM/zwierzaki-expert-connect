import { Helmet } from "react-helmet-async";
import MainLayout from "@/components/layout/MainLayout";
import LandingHero from "@/components/landing/LandingHero";
import ComparisonTable from "@/components/landing/ComparisonTable";
import ForSpecialists from "@/components/landing/ForSpecialists";
import ForOwners from "@/components/landing/ForOwners";
import PricingSimple from "@/components/landing/PricingSimple";
import TrustSection from "@/components/landing/TrustSection";
import LandingCTA from "@/components/landing/LandingCTA";

export default function Start() {
  return (
    <MainLayout>
      <Helmet>
        <title>PetsFlow - Profesjonalna dokumentacja dla specjalistów od zwierząt</title>
        <meta 
          name="description" 
          content="Dedykowane narzędzie do zarządzania dokumentacją pacjentów dla weterynarzy, behawiorystów, fizjoterapeutów i groomerów. Zacznij za darmo!" 
        />
        <meta 
          name="keywords" 
          content="dokumentacja weterynaryjna, kartoteka pacjentów, oprogramowanie dla weterynarzy, system dla behawiorysty, zarządzanie pacjentami, petsflow" 
        />
        <link rel="canonical" href="https://petsflow.pl/start" />
      </Helmet>

      <LandingHero />
      <ComparisonTable />
      <ForSpecialists />
      <ForOwners />
      <PricingSimple />
      <TrustSection />
      <LandingCTA />
    </MainLayout>
  );
}
