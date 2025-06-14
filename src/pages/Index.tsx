
import MainLayout from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSpecialistsSection } from "@/components/home/FeaturedSpecialistsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedSpecialistsSection />
      <BenefitsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
