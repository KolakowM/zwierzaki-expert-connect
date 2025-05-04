
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Specialization {
  id: string;
  code: string;
  name: string;
  description?: string;
  active?: 'yes' | 'no'; // Dodane pole active
}

export function useSpecializations() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available specializations
  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('specializations')
        .select('id, code, name, description');
        
      if (error) throw error;
      
      console.log("Fetched specializations:", data);
      setSpecializations(data || []);
      
      return data;
    } catch (error: any) {
      console.error("Error fetching specializations:", error);
      setError(error.message || "Nie udało się pobrać specjalizacji");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch specializations for a specific specialist
  const fetchSpecialistSpecializations = async (specialistId: string) => {
    if (!specialistId) return [];
    
    try {
      setLoading(true);
      setError(null);
      
      // Pobierz wszystkie specjalizacje dla specjalisty wraz z informacją active
      const { data: specialistSpecs, error } = await supabase
        .from('specialist_specializations')
        .select(`
          specialization_id,
          active,
          specializations:specialization_id (
            id, code, name, description
          )
        `)
        .eq('specialist_id', specialistId);
        
      if (error) throw error;
      
      if (!specialistSpecs || specialistSpecs.length === 0) {
        setSelectedSpecializations([]);
        return [];
      }
      
      // Pobierz tylko aktywne specjalizacje do stanu selectedSpecializations
      const activeSpecIds = specialistSpecs
        .filter(spec => spec.active === 'yes')
        .map(spec => spec.specialization_id);
      
      console.log("Active specialization IDs:", activeSpecIds);
      
      setSelectedSpecializations(activeSpecIds);
      
      // Mapuj dane do formatu Specialization z dodanym polem active
      const specs = specialistSpecs.map(item => ({
        ...item.specializations,
        active: item.active
      }));
      
      console.log("Fetched specialist specializations with active status:", specs);
      
      return specs || [];
    } catch (error: any) {
      console.error("Error fetching specialist specializations:", error);
      setError(error.message || "Nie udało się pobrać specjalizacji specjalisty");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Handle selection changes
  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    setSelectedSpecializations(prevSelected => {
      if (checked && !prevSelected.includes(specializationId)) {
        return [...prevSelected, specializationId];
      } else if (!checked) {
        return prevSelected.filter(id => id !== specializationId);
      }
      return prevSelected;
    });
  };

  // Initialize specializations
  useEffect(() => {
    fetchSpecializations();
  }, []);

  return {
    specializations,
    selectedSpecializations,
    setSelectedSpecializations,
    handleSpecializationChange,
    fetchSpecializations,
    fetchSpecialistSpecializations,
    loading,
    error,
    isLoading: loading // Added alias for compatibility
  };
}

// Export useSpecialistSpecializations hook
export function useSpecialistSpecializations(specialistId?: string) {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [specializationIds, setSpecializationIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialistSpecializations = async () => {
      if (!specialistId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Pobierz specjalizacje związane z tym specjalistą wraz z informacją active
        const { data, error } = await supabase
          .from('specialist_specializations')
          .select(`
            specialization_id,
            active,
            specializations:specialization_id (
              id, code, name, description
            )
          `)
          .eq('specialist_id', specialistId);
          
        if (error) throw error;
        
        // Ekstrahuj obiekty specjalizacji i ID tylko dla aktywnych specjalizacji
        const activeEntries = data?.filter(item => item.active === 'yes') || [];
        const specIds = activeEntries.map(item => item.specialization_id);
        const specs = activeEntries.map(item => ({
          ...item.specializations,
          active: item.active
        }));
        
        setSpecializations(specs);
        setSpecializationIds(specIds);
        
        console.log('Current active user specializations:', specs);
        console.log('Current active user specialization IDs:', specIds);
      } catch (err: any) {
        console.error('Error fetching specialist specializations:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialistSpecializations();
  }, [specialistId]);

  return { 
    specializations, 
    specializationIds, 
    isLoading: loading, 
    error 
  };
}
