
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDescription, FormLabel } from "@/components/ui/form";

interface ServicesFieldsArrayProps {
  services: string[];
  updateService: (index: number, value: string) => void;
  removeService: (index: number) => void;
  addService: () => void;
}

export function ServicesFieldsArray({
  services,
  updateService,
  removeService,
  addService,
}: ServicesFieldsArrayProps) {
  return (
    <div className="space-y-4">
      <FormLabel>Oferowane usługi</FormLabel>
      <FormDescription>
        Dodaj usługi, które oferujesz swoim klientom
      </FormDescription>
      
      {services.map((service, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="np. Konsultacja dietetyczna, Szkolenie indywidualne"
            value={service}
            onChange={(e) => updateService(index, e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => removeService(index)}
          >
            Usuń
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addService}
      >
        Dodaj usługę
      </Button>
    </div>
  );
}
