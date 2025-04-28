
import { supabase } from "@/integrations/supabase/client";

/**
 * Funkcja pomocnicza do tworzenia funkcji SQL w bazie danych
 */
export const createCustomFunction = async (sql: string): Promise<boolean> => {
  try {
    // Metoda niestandardowa - używamy fetch bezpośrednio zamiast klienta Supabase
    // ponieważ typowanie w Supabase nie uwzględnia funkcji niestandardowych
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { sql_query: sql }
    });

    if (error) {
      console.error('Błąd podczas tworzenia funkcji SQL:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Nieoczekiwany błąd podczas tworzenia funkcji SQL:', error);
    return false;
  }
};

/**
 * Tworzy funkcję wykonującą dowolne zapytanie SQL
 */
export const setupExecuteSqlFunction = async (): Promise<boolean> => {
  try {
    const createFunctionSql = `
      CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
      
      -- Grant execute permissions
      GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;
    `;
    
    // Korzystamy z bezpośredniego wywołania funkcji pomocniczej
    const result = await createCustomFunction(createFunctionSql);
    
    if (!result) {
      // Próbujemy utworzyć funkcję create_function
      try {
        // Wywołujemy bezpośrednio z REST API
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/rpc/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`
          },
          body: JSON.stringify({
            query: `
              CREATE OR REPLACE FUNCTION public.create_function(sql text)
              RETURNS void
              LANGUAGE plpgsql
              SECURITY DEFINER
              AS $$
              BEGIN
                EXECUTE sql;
              END;
              $$;
              
              -- Grant execute permissions
              GRANT EXECUTE ON FUNCTION public.create_function TO authenticated;
            `
          })
        });
        
        if (!response.ok) {
          console.error('Błąd podczas tworzenia funkcji create_function:', await response.text());
          return false;
        }
        
        // Spróbuj ponownie utworzyć execute_sql po utworzeniu create_function
        const retryResult = await createCustomFunction(createFunctionSql);
        
        if (!retryResult) {
          console.error('Błąd podczas ponownej próby tworzenia funkcji execute_sql');
          return false;
        }
      } catch (error) {
        console.error('Błąd podczas tworzenia funkcji create_function:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Nieoczekiwany błąd podczas tworzenia funkcji execute_sql:', error);
    return false;
  }
};
