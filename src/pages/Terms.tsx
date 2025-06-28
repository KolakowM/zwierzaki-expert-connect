
import MainLayout from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";
import GeneralProvisionsSection from "@/components/terms/GeneralProvisionsSection";
import DefinitionsSection from "@/components/terms/DefinitionsSection";
import ServiceConditionsSection from "@/components/terms/ServiceConditionsSection";
import AccountManagementSection from "@/components/terms/AccountManagementSection";
import SubscriptionSection from "@/components/terms/SubscriptionSection";
import SpecialistVerificationSection from "@/components/terms/SpecialistVerificationSection";
import DataProtectionSection from "@/components/terms/DataProtectionSection";
import LiabilitySection from "@/components/terms/LiabilitySection";
import DisputeResolutionSection from "@/components/terms/DisputeResolutionSection";
import FinalProvisionsSection from "@/components/terms/FinalProvisionsSection";

export default function Terms() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Regulamin Serwisu PetsFlow</h1>
          </div>

          <p className="text-muted-foreground">Ostatnia aktualizacja: 28 czerwca 2025</p>
          
          <div className="space-y-8 pt-4">
            <GeneralProvisionsSection />
            <DefinitionsSection />
            <ServiceConditionsSection />
            <AccountManagementSection />
            <SubscriptionSection />
            <SpecialistVerificationSection />
            <DataProtectionSection />
            <LiabilitySection />
            <DisputeResolutionSection />
            <FinalProvisionsSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
