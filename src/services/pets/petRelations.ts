
import { supabase } from "@/integrations/supabase/client";

export const getRelatedEntitiesCount = async (petId: string): Promise<{ visits: number, carePrograms: number }> => {
  try {
    const [visitsResult, careProgramsResult] = await Promise.all([
      supabase.from('visits').select('id', { count: 'exact' }).eq('petid', petId),
      supabase.from('care_programs').select('id', { count: 'exact' }).eq('petid', petId)
    ]);
    
    return {
      visits: visitsResult.count || 0,
      carePrograms: careProgramsResult.count || 0
    };
  } catch (error) {
    console.error("Error counting related entities:", error);
    return { visits: 0, carePrograms: 0 };
  }
};
