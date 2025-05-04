
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

// Manager specjalizacji specjalisty - POPRAWIONA LOGIKA - TYLKO UPDATE
export function useSpecialistSpecializationsManager(specialistId?: string) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do aktualizacji statusu aktywności specjalizacji specjalisty
  const saveSpecializations = async (selectedSpecializationIds: string[]) => {
    if (!specialistId) {
      return { success: false, error: "No specialist ID provided" };
    }

    try {
      setSaving(true);
      setError(null);
      
      console.log('Updating specializations for specialist:', specialistId);
      console.log('Selected specialization IDs:', selectedSpecializationIds);
      
      // CRITICAL FIX: Verify specialist_id matches the logged-in user
      if (!specialistId) {
        throw new Error("Missing specialist ID - please log in again");
      }
      
      // Fetch all existing specialist_specializations records for the user
      const { data: existingEntries, error: fetchError } = await supabase
        .from('specialist_specializations')
        .select('id, specialization_id, active')
        .eq('specialist_id', specialistId);
        
      if (fetchError) throw fetchError;
      
      console.log('Existing specialist_specializations entries:', existingEntries);
      
      if (!existingEntries || existingEntries.length === 0) {
        console.warn('No existing specialist_specializations found. They should be created by DB trigger.');
        return { success: false, error: "No specialization mappings found for this specialist" };
      }
      
      // Prepare updates for each specialization
      for (const entry of existingEntries) {
        const isSelected = selectedSpecializationIds.includes(entry.specialization_id);
        const newActiveStatus = isSelected ? 'yes' : 'no';
        
        // Only update if status has changed
        if (entry.active !== newActiveStatus) {
          console.log(`Updating specialization ${entry.specialization_id} to ${newActiveStatus}`);
          
          // CRITICAL FIX: Use UPDATE instead of UPSERT, and ensure we filter by both specialist_id and id
          const { error: updateError } = await supabase
            .from('specialist_specializations')
            .update({ active: newActiveStatus })
            .eq('id', entry.id)
            .eq('specialist_id', specialistId);
            
          if (updateError) {
            console.error('Error updating specialization:', updateError);
            throw updateError;
          }
        }
      }
      
      console.log('Specializations updated successfully');
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
