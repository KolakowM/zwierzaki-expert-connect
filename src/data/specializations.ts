
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
