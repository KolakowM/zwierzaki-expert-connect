
import { supabase } from "@/integrations/supabase/client";

/**
 * Funkcja pomocnicza do tworzenia funkcji SQL w bazie danych
 */
export const createCustomFunction = async (sql: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_query: sql
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
    
    // Korzystamy z bezpośredniego wywołania SQL przez supabase
    const { error } = await supabase.rpc('create_function', {
      sql: createFunctionSql
    });
    
    if (error) {
      if (error.message.includes('create_function') && error.message.includes('does not exist')) {
        // Potrzebujemy utworzyć funkcję create_function
        const { error: rawError } = await supabase
          .from('_raw_sql')
          .rpc('sql', {
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
          });
          
        if (rawError) {
          console.error('Błąd podczas tworzenia funkcji create_function:', rawError);
          return false;
        }
        
        // Spróbuj ponownie utworzyć execute_sql po utworzeniu create_function
        const { error: retryError } = await supabase.rpc('create_function', {
          sql: createFunctionSql
        });
        
        if (retryError) {
          console.error('Błąd podczas ponownej próby tworzenia funkcji execute_sql:', retryError);
          return false;
        }
      } else {
        console.error('Błąd podczas tworzenia funkcji execute_sql:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Nieoczekiwany błąd podczas tworzenia funkcji execute_sql:', error);
    return false;
  }
};

