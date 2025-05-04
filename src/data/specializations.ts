
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

// Zaktualizowany manager specjalizacji specjalisty
export function useSpecialistSpecializationsManager(specialistId?: string) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja do zapisywania aktywnych specjalizacji specjalisty
  const saveSpecializations = async (selectedSpecializationIds: string[]) => {
    if (!specialistId) {
      return { success: false, error: "No specialist ID provided" };
    }

    try {
      setSaving(true);
      setError(null);
      
      console.log('Saving specializations for specialist:', specialistId);
      console.log('Selected specialization IDs:', selectedSpecializationIds);
      
      // Pobierz wszystkie obecne rekordy specialist_specializations dla użytkownika
      const { data: existingEntries, error: fetchError } = await supabase
        .from('specialist_specializations')
        .select('specialization_id, active')
        .eq('specialist_id', specialistId);
        
      if (fetchError) throw fetchError;
      
      console.log('Existing specialist_specializations entries:', existingEntries);
      
      // Zaktualizuj status active dla wszystkich specjalizacji
      const updates = [];
      
      for (const entry of existingEntries || []) {
        const isSelected = selectedSpecializationIds.includes(entry.specialization_id);
        const newActive = isSelected ? 'yes' : 'no';
        
        // Sprawdź czy status się zmienił
        if (entry.active !== newActive) {
          updates.push({
            specialist_id: specialistId,
            specialization_id: entry.specialization_id,
            active: newActive
          });
        }
      }
      
      console.log('Specialization updates to save:', updates);
      
      // Zapisz zmiany, jeśli są jakieś
      if (updates.length > 0) {
        const { error: updateError } = await supabase
          .from('specialist_specializations')
          .upsert(updates);
          
        if (updateError) throw updateError;
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
