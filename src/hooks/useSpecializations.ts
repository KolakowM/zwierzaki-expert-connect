
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Specialization {
  id: string;
  code: string;
  name: string;
  description?: string;
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
      
      // Get specialization IDs for the specialist
      const { data: specialistSpecs, error } = await supabase
        .from('specialist_specializations')
        .select('specialization_id')
        .eq('specialist_id', specialistId);
        
      if (error) throw error;
      
      if (!specialistSpecs || specialistSpecs.length === 0) {
        setSelectedSpecializations([]);
        return [];
      }
      
      const specIds = specialistSpecs.map(spec => spec.specialization_id);
      console.log("Specialization IDs:", specIds);
      
      setSelectedSpecializations(specIds);
      
      // Get the actual specialization details
      const { data: specs, error: specsError } = await supabase
        .from('specializations')
        .select('id, code, name, description')
        .in('id', specIds);
        
      if (specsError) throw specsError;
      
      console.log("Fetched specialist specializations:", specs);
      
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
        
        // Extract specialization objects and IDs
        const specIds = data?.map(item => item.specialization_id) || [];
        const specs = data?.map(item => item.specializations) || [];
        
        setSpecializations(specs);
        setSpecializationIds(specIds);
        
        console.log('Current user specializations:', specs);
        console.log('Current user specialization IDs:', specIds);
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
