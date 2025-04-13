
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useSpecializations } from "@/hooks/useSpecializations";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface SpecializationCheckboxesProps {
  form: UseFormReturn<any>;
}

export function SpecializationCheckboxes({ form }: SpecializationCheckboxesProps) {
  const { user } = useAuth();
  const { specializations, isLoading, error } = useSpecializations();
  const { specializations: currentSpecializations, isLoading: isLoadingUserSpecializations } = 
    useSpecialistSpecializations(user?.id);
  
  // Use an effect to automatically check specializations from user's profile
  useEffect(() => {
    if (user?.id && specializations.length > 0) {
      // This will be handled by parent components that fetch the user's specializations
      // and pass them to the form
      console.log('Specializations loaded:', specializations.length);
    }
  }, [specializations, user?.id]);

  return (
    <FormField
      control={form.control}
      name="specializations"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">Specjalizacje</FormLabel>
            <FormDescription>
              Wybierz obszary, w których się specjalizujesz
            </FormDescription>
          </div>

          {/* Display current specializations */}
          {!isLoadingUserSpecializations && currentSpecializations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Twoje obecne specjalizacje:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentSpecializations.map((spec) => (
                  <Badge key={spec.id} variant="secondary">
                    {spec.name}
                  </Badge>
                ))}
              </div>
              <Alert className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Aby zaktualizować swoje specjalizacje, zaznacz wszystkie, które chcesz mieć przypisane do profilu (również te, które już posiadasz) i kliknij przycisk "Zapisz profil". Tylko zaznaczone specjalizacje będą przypisane do Twojego profilu.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {isLoading ? (
              // Loading state
              Array.from({ length: 6 }).map((_, index) => (
                <FormItem key={index} className="flex flex-row items-start space-x-3 space-y-0">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </FormItem>
              ))
            ) : error ? (
              <div className="col-span-2 text-destructive text-sm">
                Error loading specializations. Please try again.
              </div>
            ) : (
              specializations.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="specializations"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    field.value?.filter((value: string) => value !== item.id)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Helper hook to get the user's current specializations
function useSpecialistSpecializations(specialistId: string | undefined) {
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialistSpecializations = async () => {
      if (!specialistId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get the specializations related to this specialist via the junction table
        const { data, error } = await supabase
          .from('specialist_specializations')
          .select(`
            specialization_id,
            specializations:specialization_id (
              id, code, name, description
            )
          `)
          .eq('specialist_id', specialistId);
          
        if (error) throw error;
        
        // Extract specialization objects
        const specs = data?.map(item => item.specializations) || [];
        setSpecializations(specs);
        
        console.log('Current user specializations:', specs);
      } catch (err) {
        console.error('Error fetching specialist specializations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialistSpecializations();
  }, [specialistId]);

  return { specializations, isLoading, error };
}
