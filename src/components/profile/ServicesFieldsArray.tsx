
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface ServicesFieldsArrayProps {
  services: string[];
  updateService: (index: number, value: string) => void;
  removeService: (index: number) => void;
  addService: () => void;
  maxAllowed: number;
  limitReached: boolean;
}

export function ServicesFieldsArray({ 
  services, 
  updateService, 
  removeService, 
  addService,
  maxAllowed,
  limitReached
}: ServicesFieldsArrayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Usługi</h3>
          <p className="text-xs text-muted-foreground">
            Opisz usługi, które oferujesz swoim klientom
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addService}
          disabled={limitReached}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Dodaj usługę
        </Button>
      </div>
      
      <div className="space-y-3">
        {services.map((service, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={service}
              onChange={(e) => updateService(index, e.target.value)}
              placeholder={`Usługa ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeService(index)}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {services.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Nie dodano jeszcze żadnych usług
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addService}
              disabled={limitReached}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj pierwszą usługę
            </Button>
          </div>
        )}
      </div>
      
      {limitReached && (
        <p className="text-xs text-muted-foreground">
          Osiągnięto maksymalną liczbę usług ({maxAllowed})
        </p>
      )}
    </div>
  );
}
