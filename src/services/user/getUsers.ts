
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserData } from "./types";

export const getUsers = async (): Promise<UserData[]> => {
  try {
    // Pobierz profile użytkowników z bazy danych
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, updated_at, email');
      
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
      const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Użytkownik';
      const roleData = roleMap[profile.id] || { role: 'user' as AppRole, status: 'niezweryfikowany' };
      
      return {
        id: profile.id,
        name: name,
        email: profile.email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Użyj rzeczywistego maila jeśli jest dostępny
        role: roleData.role,
        status: roleData.status || 'niezweryfikowany',
        lastLogin: profile.updated_at // Użyj updated_at jako przybliżenie ostatniego logowania
      };
    });
  } catch (error) {
    console.error('Błąd podczas pobierania użytkowników:', error);
    throw error;
  }
};
