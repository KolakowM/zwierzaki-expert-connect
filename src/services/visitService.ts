
import { Visit } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const getVisits = async (): Promise<Visit[]> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) return [];
    
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('user_id', authUser.user.id);
      
    if (error) {
      console.error("Error fetching visits:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getVisits:", error);
    return [];
  }
};

export const createVisit = async (visit: Omit<Visit, 'id' | 'createdAt'>): Promise<Visit> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) throw new Error("User not authenticated");
    
    const newVisit = {
      ...visit,
      user_id: authUser.user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('visits')
      .insert([newVisit])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating visit:", error);
    throw error;
  }
};
