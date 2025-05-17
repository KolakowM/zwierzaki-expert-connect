
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useSpecializations, useSpecialistSpecializations } from "@/hooks/useSpecializations";
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
  const { specializations, loading: isLoading, error } = useSpecializations();
  const [userSpecializations, setUserSpecializations] = useState<any[]>([]);
  const [loadingUserSpecializations, setLoadingUserSpecializations] = useState(true);
  
  // Fetch all user specializations with their active status
  useEffect(() => {
    const fetchUserSpecializations = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingUserSpecializations(true);
        
        const { data, error } = await supabase
          .from('specialist_specializations')
          .select(`
            id,
            specialization_id,
            active,
            specializations:specialization_id (
              id, code, name, description
            )
          `)
          .eq('specialist_id', user.id);
          
        if (error) throw error;
        
        // Create mapping of specializations to active status
        const specializationMapping = data?.reduce((acc: Record<string, string>, item) => {
          acc[item.specialization_id] = item.active;
          return acc;
        }, {}) || {};
        
        // Get IDs of all active specializations
        const activeSpecIds = data
          ?.filter(item => item.active === 'yes')
          .map(item => item.specialization_id) || [];
        
        // Set the form field value to contain all active specialization IDs
        form.setValue('specializations', activeSpecIds);
        
        setUserSpecializations(data
          ?.filter(item => item.active === 'yes')
          .map(item => ({
            id: item.specialization_id,
            name: item.specializations.name,
            active: item.active
          })) || []);
        
        console.log('User specializations loaded:', data);
        console.log('Active user specializations:', activeSpecIds);
        console.log('Setting form specializations value:', activeSpecIds);
      } catch (error) {
        console.error('Error fetching user specializations:', error);
      } finally {
        setLoadingUserSpecializations(false);
      }
    };
    
    fetchUserSpecializations();
  }, [user?.id, form]);

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
          {!loadingUserSpecializations && userSpecializations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Twoje obecne specjalizacje:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {userSpecializations.map((spec) => (
                  <Badge key={spec.id} variant="secondary">
                    {spec.name}
                  </Badge>
                ))}
              </div>
              <Alert className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Zaznacz specjalizacje, w których się specjalizujesz i kliknij przycisk "Zapisz profil". 
                  Zaznaczone specjalizacje będą wyświetlane na Twoim profilu jako aktywne.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {isLoading || loadingUserSpecializations ? (
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
              specializations
                .slice() // Create a shallow copy
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                .map((item) => (
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
