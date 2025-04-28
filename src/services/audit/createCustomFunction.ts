
import { supabase } from "@/integrations/supabase/client";

// Get Supabase URL from the environment or the client
const SUPABASE_URL = "https://wrftbhmnqrdogomhvomr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZnRiaG1ucXJkb2dvbWh2b21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MzYzNDcsImV4cCI6MjA1OTUxMjM0N30.S7MaDuJnQcXXTZBKbYYeo2jrknbB3eejGn3Z6Fkxarc";

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
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
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
