
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useSpecializationsData, useSpecialistSpecializationsManager } from "@/data/specializations";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface SpecializationCheckboxesProps {
  form: UseFormReturn<any>;
}

export function SpecializationCheckboxes({ form }: SpecializationCheckboxesProps) {
  const { user } = useAuth();
  const { specializations, isLoading, error } = useSpecializationsData();
  const {
    selectedSpecializationIds,
    isLoading: isLoadingSpecialist
  } = useSpecialistSpecializationsManager(user?.id);

  // Set the initial form values when specializations are loaded
  useEffect(() => {
    if (!isLoadingSpecialist && selectedSpecializationIds.length > 0) {
      form.setValue('specializations', selectedSpecializationIds);
    }
  }, [selectedSpecializationIds, isLoadingSpecialist, form]);

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(isLoading || isLoadingSpecialist) ? (
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
                          {item.label}
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
