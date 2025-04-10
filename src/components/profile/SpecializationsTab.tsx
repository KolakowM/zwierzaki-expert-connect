
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpecializationCheckboxes } from "./SpecializationCheckboxes";
import { ServicesFieldsArray } from "./ServicesFieldsArray";
import { UseFormReturn } from "react-hook-form";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Specjalizacje i usługi</CardTitle>
        <CardDescription>
          Wybierz swoje specjalizacje i opisz oferowane usługi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Specializations */}
        <SpecializationCheckboxes form={form} />
        
        {/* Services */}
        <ServicesFieldsArray
          services={services}
          updateService={updateService}
          removeService={removeService}
          addService={addService}
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
