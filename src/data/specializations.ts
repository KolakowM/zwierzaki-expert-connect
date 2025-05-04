
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

// Manager specjalizacji specjalisty
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
      
      // CRITICAL FIX: Double-check specialist_id matches the logged-in user
      if (!specialistId) {
        throw new Error("Missing specialist ID - please log in again");
      }
      
      // Pobierz wszystkie rekordy specialist_specializations dla użytkownika
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
      
      // Przygotuj aktualizacje dla każdej specjalizacji
      const updates = [];
      
      for (const entry of existingEntries) {
        const isSelected = selectedSpecializationIds.includes(entry.specialization_id);
        const newActiveStatus = isSelected ? 'yes' : 'no';
        
        // Sprawdź czy status się zmienił i tylko wtedy aktualizuj
        if (entry.active !== newActiveStatus) {
          updates.push({
            id: entry.id, // Używamy ID rekordu, aby jednoznacznie go zidentyfikować
            active: newActiveStatus,
            // Nie zmieniamy specialist_id ani specialization_id - te wartości są stałe
          });
        }
      }
      
      console.log('Specialization status updates to save:', updates);
      
      // Zapisz zmiany, jeśli są jakieś
      if (updates.length > 0) {
        const { error: updateError } = await supabase
          .from('specialist_specializations')
          .upsert(updates);
          
        if (updateError) throw updateError;
      } else {
        console.log('No specialization status changes detected');
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
