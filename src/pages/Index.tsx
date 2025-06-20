
import MainLayout from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSpecialistsSection } from "@/components/home/FeaturedSpecialistsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <MainLayout>
      <h1 className="sr-only">
        PetsFlow - Platforma dla specjalistów ds. zwierząt. Znajdź najlepszego specjalistę dla swojego zwierzaka.
      </h1>
      <HeroSection />
      <FeaturedSpecialistsSection />
      <BenefitsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
