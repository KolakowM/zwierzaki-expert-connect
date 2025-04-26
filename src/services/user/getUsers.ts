
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserData } from "./types";

export const getUsers = async (): Promise<UserData[]> => {
  try {
    // Pobierz profile użytkowników z bazy danych
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, updated_at');
      
    if (profilesError) throw profilesError;
    
    // Pobierz dane użytkowników z auth.users dla pobrania adresów email
    // Ponieważ nie możemy bezpośrednio zapytać o auth.users, możemy użyć administratorskiego API
    // lub skorzystać z informacji użytkowników w tabelach posiłkowych
    
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
    
    // Pobieramy dane auth dla uzyskania emaili (możemy użyć alternatywnego źródła, jeśli istnieje)
    // W tym przykładzie, tworzymy tymczasowe adresy email na podstawie imienia i nazwiska
    // To tylko obejście - w prawdziwym projekcie powinieneś mieć dostęp do emaili z auth lub zapisać
    // je w tabeli user_profiles
    
    // Mapuj profile użytkowników do formatu oczekiwanego przez UI
    return (userProfiles || []).map(profile => {
      // Sprawdzamy, czy mamy profil i czy ma potrzebne pola
      if (!profile || !profile.id) return null;
      
      const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Użytkownik';
      const roleData = roleMap[profile.id] || { role: 'user' as AppRole, status: 'niezweryfikowany' };
      
      // Generujemy tymczasowy email na podstawie imienia i nazwiska
      const temporaryEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
      
      return {
        id: profile.id,
        name: name,
        email: temporaryEmail, // Docelowo powinien być pobrany z auth lub innej tabeli
        role: roleData.role,
        status: roleData.status || 'niezweryfikowany',
        lastLogin: profile.updated_at // Użyj updated_at jako przybliżenie ostatniego logowania
      };
    }).filter(Boolean) as UserData[]; // Filtrujemy null wartości
  } catch (error) {
    console.error('Błąd podczas pobierania użytkowników:', error);
    throw error;
  }
};
