
import { supabase } from "@/integrations/supabase/client";

/**
 * Tworzy podstawowe polityki RLS dla wybranej tabeli
 * @param tableName Nazwa tabeli
 * @param userIdColumn Nazwa kolumny zawierającej ID użytkownika
 * @param enableRLS Czy włączyć RLS dla tabeli
 */
export const setupTableRLSPolicies = async (
  tableName: string, 
  userIdColumn: string, 
  enableRLS: boolean = true
): Promise<boolean> => {
  try {
    // 1. Włącz RLS dla tabeli
    if (enableRLS) {
      const rlsEnableSql = `ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;`;
      await supabase.rpc('execute_sql', { sql_query: rlsEnableSql });
    }
    
    // 2. Polityka SELECT - użytkownicy mogą widzieć tylko swoje dane
    const selectPolicySql = `
      CREATE POLICY "Users can view their own ${tableName}" 
      ON public.${tableName} 
      FOR SELECT 
      USING (auth.uid() = ${userIdColumn} OR 
            (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin');
    `;
    await supabase.rpc('execute_sql', { sql_query: selectPolicySql });
    
    // 3. Polityka INSERT - użytkownicy mogą dodawać tylko swoje dane
    const insertPolicySql = `
      CREATE POLICY "Users can insert their own ${tableName}" 
      ON public.${tableName} 
      FOR INSERT 
      WITH CHECK (auth.uid() = ${userIdColumn} OR 
                 (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin');
    `;
    await supabase.rpc('execute_sql', { sql_query: insertPolicySql });
    
    // 4. Polityka UPDATE - użytkownicy mogą aktualizować tylko swoje dane
    const updatePolicySql = `
      CREATE POLICY "Users can update their own ${tableName}" 
      ON public.${tableName} 
      FOR UPDATE 
      USING (auth.uid() = ${userIdColumn} OR 
            (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin');
    `;
    await supabase.rpc('execute_sql', { sql_query: updatePolicySql });
    
    // 5. Polityka DELETE - użytkownicy mogą usuwać tylko swoje dane
    const deletePolicySql = `
      CREATE POLICY "Users can delete their own ${tableName}" 
      ON public.${tableName} 
      FOR DELETE 
      USING (auth.uid() = ${userIdColumn} OR 
            (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin');
    `;
    await supabase.rpc('execute_sql', { sql_query: deletePolicySql });
    
    return true;
  } catch (error) {
    console.error(`Błąd podczas konfiguracji RLS dla tabeli ${tableName}:`, error);
    return false;
  }
};

/**
 * Dodaj indeks dla kolumny w tabeli
 * @param tableName Nazwa tabeli
 * @param columnName Nazwa kolumny
 * @param indexName Opcjonalna nazwa indeksu
 */
export const addTableIndex = async (
  tableName: string,
  columnName: string,
  indexName?: string
): Promise<boolean> => {
  try {
    const indexNameToUse = indexName || `idx_${tableName}_${columnName}`;
    const createIndexSql = `
      CREATE INDEX IF NOT EXISTS ${indexNameToUse}
      ON public.${tableName} (${columnName});
    `;
    
    await supabase.rpc('execute_sql', { sql_query: createIndexSql });
    return true;
  } catch (error) {
    console.error(`Błąd podczas dodawania indeksu dla kolumny ${columnName} w tabeli ${tableName}:`, error);
    return false;
  }
};

/**
 * Naprawia podstawowe problemy z bazą danych wykryte podczas audytu
 * @returns Informacja o powodzeniu operacji
 */
export const fixCommonDatabaseIssues = async (): Promise<{
  success: boolean;
  fixedIssues: string[];
  errors: string[];
}> => {
  const result = {
    success: true,
    fixedIssues: [] as string[],
    errors: [] as string[]
  };
  
  try {
    // 1. Sprawdź i dodaj wartość 'specialist' do typu enum app_role, jeśli nie istnieje
    try {
      await supabase.rpc('execute_sql', { 
        sql_query: "ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'specialist';" 
      });
      result.fixedIssues.push("Dodano wartość 'specialist' do typu enum app_role");
    } catch (error: any) {
      result.errors.push("Nie udało się dodać wartości 'specialist' do enum app_role: " + error.message);
      result.success = false;
    }
    
    // 2. Popraw trigger dla profili specjalistów, jeśli nie istnieje
    try {
      const createTriggerSql = `
        -- Funkcja obsługująca tworzenie profili specjalistów
        CREATE OR REPLACE FUNCTION public.handle_specialist_profile()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Sprawdź, czy użytkownik ma rolę specialist
            IF EXISTS (
                SELECT 1 FROM user_roles 
                WHERE user_id = NEW.id AND role = 'specialist'
            ) THEN
                -- Sprawdź czy nie istnieje już profil dla tego użytkownika
                IF NOT EXISTS (SELECT 1 FROM specialist_profiles WHERE id = NEW.id) THEN
                    -- Utwórz nowy profil specjalisty
                    INSERT INTO specialist_profiles (
                        id, 
                        title, 
                        description, 
                        location, 
                        updated_at
                    ) VALUES (
                        NEW.id, 
                        'Specjalista', 
                        'Opis profilu specjalisty...', 
                        'Polska',
                        now()
                    );
                END IF;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Trigger do automatycznego tworzenia profili specjalistów
        DROP TRIGGER IF EXISTS create_specialist_profile ON public.user_profiles;
        
        CREATE TRIGGER create_specialist_profile
        AFTER INSERT ON public.user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_specialist_profile();
      `;
      
      await supabase.rpc('execute_sql', { sql_query: createTriggerSql });
      result.fixedIssues.push("Utworzono trigger 'create_specialist_profile' dla tabeli 'user_profiles'");
    } catch (error: any) {
      result.errors.push("Nie udało się utworzyć triggera dla profili specjalistów: " + error.message);
      result.success = false;
    }
    
    // 3. Dodaj brakujące indeksy
    try {
      await addTableIndex('user_roles', 'user_id');
      result.fixedIssues.push("Dodano indeks dla kolumny 'user_id' w tabeli 'user_roles'");
      
      await addTableIndex('clients', 'user_id');
      result.fixedIssues.push("Dodano indeks dla kolumny 'user_id' w tabeli 'clients'");
      
      // Indeks złożony dla specialist_specializations
      const compoundIndexSql = `
        CREATE INDEX IF NOT EXISTS idx_spec_specializations_composite
        ON public.specialist_specializations (specialist_id, specialization_id);
      `;
      await supabase.rpc('execute_sql', { sql_query: compoundIndexSql });
      result.fixedIssues.push("Dodano złożony indeks dla kolumn 'specialist_id, specialization_id' w tabeli 'specialist_specializations'");
    } catch (error: any) {
      result.errors.push("Wystąpił problem podczas dodawania indeksów: " + error.message);
      result.success = false;
    }
    
    // 4. Ustaw RLS dla głównych tabel, jeśli nie są skonfigurowane
    const tablesToSecure = [
      { name: 'clients', userIdColumn: 'user_id' },
      { name: 'specialist_profiles', userIdColumn: 'id' },
      { name: 'pets', userIdColumn: '(SELECT user_id FROM clients WHERE id = clientid)' }
    ];
    
    for (const table of tablesToSecure) {
      try {
        await setupTableRLSPolicies(table.name, table.userIdColumn);
        result.fixedIssues.push(`Skonfigurowano polityki RLS dla tabeli '${table.name}'`);
      } catch (error: any) {
        result.errors.push(`Nie udało się skonfigurować RLS dla tabeli '${table.name}': ` + error.message);
        result.success = false;
      }
    }
    
    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push("Wystąpił nieoczekiwany błąd: " + error.message);
    return result;
  }
};
