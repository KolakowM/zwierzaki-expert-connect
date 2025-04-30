
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Specialization } from "@/hooks/useSpecializations";

export function useSpecializationsData() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all specializations from the database - now publicly accessible
        const { data, error } = await supabase
          .from('specializations')
          .select('id, code, name, description');
          
        if (error) {
          throw error;
        }

        setSpecializations(data || []);
      } catch (err) {
        console.error("Error fetching specializations:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  return { specializations, isLoading, error };
}

// Add the missing function that's being imported in other files
export function useSpecialistSpecializationsManager(specialistId?: string) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to save specialist specializations
  const saveSpecializations = async (specializationIds: string[]) => {
    if (!specialistId) {
      return { success: false, error: "No specialist ID provided" };
    }

    try {
      setSaving(true);
      setError(null);
      
      console.log('Saving specializations for specialist:', specialistId);
      console.log('Specialization IDs to save:', specializationIds);
      
      // First delete existing specialization associations
      const { error: deleteError } = await supabase
        .from('specialist_specializations')
        .delete()
        .eq('specialist_id', specialistId);
        
      if (deleteError) throw deleteError;
      
      // Then insert new associations if we have any specializations to add
      if (specializationIds.length > 0) {
        // Create array of objects for insert
        const specializationsToInsert = specializationIds.map(specId => ({
          specialist_id: specialistId,
          specialization_id: specId
        }));
        
        const { error: insertError } = await supabase
          .from('specialist_specializations')
          .insert(specializationsToInsert);
          
        if (insertError) throw insertError;
      }
      
      console.log('Specializations saved successfully');
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error saving specializations:', err);
      setError(err.message || 'Unknown error');
      return { success: false, error: err.message || 'Unknown error' };
    } finally {
      setSaving(false);
    }
  };

  return {
    saveSpecializations,
    saving,
    error
  };
}
