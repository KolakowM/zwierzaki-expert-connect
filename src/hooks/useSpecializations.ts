
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Specialization {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

export const useSpecializations = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('specializations')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        setSpecializations(data || []);
        console.log('Fetched specializations:', data);
      } catch (err) {
        console.error('Error fetching specializations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  return { specializations, isLoading, error };
};

// Hook to fetch specialist's specializations from the junction table
export const useSpecialistSpecializations = (specialistId: string | undefined) => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [specializationIds, setSpecializationIds] = useState<string[]>([]);
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
        
        // Extract specialization objects and their IDs
        const specs = data?.map(item => item.specializations) || [];
        const specIds = specs.map(spec => spec.id);
        
        console.log('Fetched specialist specializations:', specs);
        console.log('Specialization IDs:', specIds);
        
        setSpecializations(specs);
        setSpecializationIds(specIds);
      } catch (err) {
        console.error('Error fetching specialist specializations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialistSpecializations();
  }, [specialistId]);

  return { specializations, specializationIds, isLoading, error };
};
