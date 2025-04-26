
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from "@/components/admin/users/UserFormDialog";
import { AppRole } from "./types";

export const updateUser = async (userId: string, userData: UserFormValues) => {
  try {
    // Aktualizuj metadane użytkownika w Supabase Auth
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      email: userData.email, // Dodajemy możliwość aktualizacji emaila
      user_metadata: {
        name: userData.name,
        status: userData.status
      }
    });
    
    if (authError) throw authError;

    // Aktualizuj profil użytkownika w tabeli user_profiles
    const names = userData.name.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: userData.email,
        updated_at: new Date().toISOString()
      });
      
    if (profileError) throw profileError;
    
    // Aktualizuj rolę użytkownika w tabeli user_roles
    if (userData.role) {
      // Najpierw sprawdź, czy rola istnieje dla tego użytkownika
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (existingRole) {
        // Aktualizuj istniejącą rolę - upewnij się, że używamy tylko poprawnych ról w bazie danych
        const dbRole = userData.role === 'specialist' ? 'user' : userData.role as AppRole;
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ 
            role: dbRole,
            status: userData.status
          })
          .eq('user_id', userId);
          
        if (roleError) throw roleError;
      } else {
        // Wstaw nową rolę - upewnij się, że używamy tylko poprawnych ról w bazie danych
        const dbRole = userData.role === 'specialist' ? 'user' : userData.role as AppRole;
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: dbRole,
            status: userData.status || 'niezweryfikowany'
          });
          
        if (roleError) throw roleError;
      }
    }
    
    // Zwróć zaktualizowanego użytkownika
    return {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
    };
  } catch (error) {
    console.error('Błąd podczas aktualizacji użytkownika:', error);
    throw error;
  }
};
