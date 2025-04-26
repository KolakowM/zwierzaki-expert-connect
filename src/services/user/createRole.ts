
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserRoleData } from "./types";

export const createUserRole = async (userId: string, role: AppRole = 'user', status: string = 'niezweryfikowany'): Promise<UserRoleData | null> => {
  try {
    // Sprawdź, czy rola już istnieje dla tego użytkownika
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (existingRole) {
      console.log('Rola już istnieje dla tego użytkownika', existingRole);
      return existingRole as UserRoleData;
    }
    
    // Utwórz nową rolę dla użytkownika
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role,
        status: status
      })
      .select()
      .single();
      
    if (error) {
      console.error('Błąd podczas tworzenia roli użytkownika:', error);
      throw error;
    }
    
    console.log('Utworzono rolę użytkownika:', data);
    return data as UserRoleData;
  } catch (error) {
    console.error('Błąd podczas tworzenia roli użytkownika:', error);
    return null;
  }
};
