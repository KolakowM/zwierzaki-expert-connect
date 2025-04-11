
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
