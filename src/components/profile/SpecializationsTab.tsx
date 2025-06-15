
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpecializationCheckboxes } from "./SpecializationCheckboxes";
import { ServicesFieldsArray } from "./ServicesFieldsArray";
import { UseFormReturn } from "react-hook-form";
import { useCanPerformAction } from "@/hooks/usePackageLimits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface SpecializationsTabProps {
  form: UseFormReturn<any>;
  services: string[];
  updateService: (index: number, value: string) => void;
  removeService: (index: number) => void;
  addService: () => void;
  isSubmitting: boolean;
}

export function SpecializationsTab({
  form,
  services,
  updateService,
  removeService,
  addService,
  isSubmitting
}: SpecializationsTabProps) {
  // Check package limits for services and specializations
  const { 
    canPerform: canAddServices, 
    currentCount: servicesCount, 
    maxAllowed: maxServices, 
    packageName: servicesPackage 
  } = useCanPerformAction('services');

  const { 
    canPerform: canAddSpecializations, 
    currentCount: specializationsCount, 
    maxAllowed: maxSpecializations, 
    packageName: specializationsPackage 
  } = useCanPerformAction('specializations');

  // Get current specializations from form
  const currentSpecializations = form.watch('specializations') || [];
  const specializationLimitReached = currentSpecializations.length >= maxSpecializations;
  const serviceLimitReached = services.length >= maxServices;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specjalizacje i usługi</CardTitle>
        <CardDescription>
          Wybierz swoje specjalizacje i opisz oferowane usługi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Specializations limit info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Specjalizacje</h3>
            <span className="text-xs text-muted-foreground">
              {currentSpecializations.length}/{maxSpecializations}
            </span>
          </div>
          
          {specializationLimitReached && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Osiągnięto limit specjalizacji ({maxSpecializations}) w pakiecie {specializationsPackage}. 
                Odznacz specjalizację, aby wybrać inną, lub ulepsz pakiet.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Specializations */}
        <SpecializationCheckboxes 
          form={form} 
          maxAllowed={maxSpecializations}
          currentCount={currentSpecializations.length}
        />
        
        {/* Services limit info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Usługi</h3>
            <span className="text-xs text-muted-foreground">
              {services.length}/{maxServices}
            </span>
          </div>
          
          {serviceLimitReached && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Osiągnięto limit usług ({maxServices}) w pakiecie {servicesPackage}. 
                Usuń usługę, aby dodać nową, lub ulepsz pakiet.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Services */}
        <ServicesFieldsArray
          services={services}
          updateService={updateService}
          removeService={removeService}
          addService={addService}
          maxAllowed={maxServices}
          limitReached={serviceLimitReached}
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : "Zapisz profil"}
        </Button>
      </CardFooter>
    </Card>
  );
}
