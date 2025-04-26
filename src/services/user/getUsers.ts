
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserData } from "./types";

export const getUsers = async (): Promise<UserData[]> => {
  try {
    // Pobierz profile użytkowników z bazy danych
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, email, updated_at');
      
    if (profilesError) throw profilesError;
    
    // Pobierz role użytkowników
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role, status');
      
    if (rolesError) throw rolesError;
    
    // Utwórz mapę ról użytkowników
    const roleMap = userRoles?.reduce((map, item) => {
      map[item.user_id] = { role: item.role, status: item.status };
      return map;
    }, {} as Record<string, { role: AppRole, status: string }>) || {};
    
    // Mapuj profile użytkowników do formatu oczekiwanego przez UI
    return (userProfiles || []).map(profile => {
      if (!profile || !profile.id) return null;
      
      const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Użytkownik';
      const roleData = roleMap[profile.id] || { role: 'user' as AppRole, status: 'niezweryfikowany' };
      
      return {
        id: profile.id,
        name: name,
        email: profile.email || '',
        role: roleData.role,
        status: roleData.status || 'niezweryfikowany',
        lastLogin: profile.updated_at
      };
    }).filter(Boolean) as UserData[];
  } catch (error) {
    console.error('Błąd podczas pobierania użytkowników:', error);
    throw error;
  }
};
