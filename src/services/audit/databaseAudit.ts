
import { supabase } from "@/integrations/supabase/client";
import { createCustomFunction } from "./createCustomFunction";

// Get Supabase URL and key for direct API access
const SUPABASE_URL = "https://wrftbhmnqrdogomhvomr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZnRiaG1ucXJkb2dvbWh2b21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MzYzNDcsImV4cCI6MjA1OTUxMjM0N30.S7MaDuJnQcXXTZBKbYYeo2jrknbB3eejGn3Z6Fkxarc";

export interface TableDetails {
  exists: boolean;
  name: string;
  description: string;
  columns?: Record<string, string>;
  foreignKeys?: string[];
}

export interface TableRelationship {
  table: string;
  column: string;
  referencedTable: string;
  referencedColumn: string;
}

export interface AuditResult {
  tables: Record<string, TableDetails>;
  relationships: TableRelationship[];
  roles: {
    userRolesExists: boolean;
    validRoleTypes: string[];
    rolesTriggerExists: boolean;
  };
  specialistProfiles: {
    exists: boolean;
    triggerExists: boolean;
  };
  security: {
    rlsPoliciesExist: Record<string, boolean>;
  };
  recommendations: string[];
}

/**
 * Przeprowadza audyt struktury bazy danych
 */
export const auditDatabase = async (): Promise<AuditResult> => {
  try {
    // Inicjalizacja wyniku
    const result: AuditResult = {
      tables: {},
      relationships: [],
      roles: {
        userRolesExists: false,
        validRoleTypes: [],
        rolesTriggerExists: false
      },
      specialistProfiles: {
        exists: false,
        triggerExists: false
      },
      security: {
        rlsPoliciesExist: {}
      },
      recommendations: []
    };

    // 1. Sprawdź tabele
    const expectedTables = [
      'user_profiles',
      'user_roles',
      'specialist_profiles',
      'specialist_specializations',
      'specializations',
      'clients',
      'pets',
      'visits',
      'care_programs',
      'pet_notes',
      'pet_note_attachments'
    ];

    for (const tableName of expectedTables) {
      try {
        // Używamy metody SELECT z limitem 0 aby sprawdzić czy tabela istnieje
        // Bezpośrednie użycie known table names z typowanego klienta
        const { error: tableError } = await supabase
          .from(tableName as any)
          .select('*')
          .limit(0);

        result.tables[tableName] = {
          exists: !tableError,
          name: tableName,
          description: getTableDescription(tableName),
        };

        if (tableError) {
          result.recommendations.push(`Tabela '${tableName}' nie istnieje. Należy ją utworzyć.`);
        } else {
          // Pobierz informacje o kolumnach za pomocą REST API
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_table_info`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ table_name: tableName })
          });
          
          if (response.ok) {
            const tableInfo = await response.json();
            
            if (tableInfo && Array.isArray(tableInfo) && tableInfo.length > 0) {
              result.tables[tableName].columns = {};
              tableInfo.forEach((column: any) => {
                if (result.tables[tableName].columns) {
                  result.tables[tableName].columns![column.column_name] = column.data_type;
                }
              });
            }
          }
        }
      } catch (error) {
        console.error(`Błąd sprawdzania tabeli ${tableName}:`, error);
        result.tables[tableName] = {
          exists: false,
          name: tableName,
          description: getTableDescription(tableName)
        };
        result.recommendations.push(`Tabela '${tableName}' nie istnieje lub jest niedostępna. Należy ją utworzyć.`);
      }
    }

    // 2. Sprawdź role użytkowników
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_enum_values`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ enum_name: 'app_role' })
      });
      
      if (response.ok) {
        const roleTypes = await response.json();
        
        if (roleTypes && Array.isArray(roleTypes)) {
          result.roles.validRoleTypes = roleTypes;
          if (!roleTypes.includes('specialist')) {
            result.recommendations.push("Typ enum 'app_role' nie zawiera wartości 'specialist'.");
          }
        }
      }
    } catch (error) {
      console.error("Błąd podczas pobierania typów ról:", error);
      result.recommendations.push("Nie udało się pobrać typów ról. Sprawdź czy typ enum 'app_role' istnieje.");
    }

    // 3. Sprawdź triggery
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_triggers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        const triggers = await response.json();
        
        if (triggers && Array.isArray(triggers)) {
          const specialistTrigger = triggers.find((t: any) => 
            t.trigger_name === 'create_specialist_profile' && 
            t.event_object_table === 'user_profiles'
          );
          
          result.specialistProfiles.triggerExists = !!specialistTrigger;
          
          if (!specialistTrigger) {
            result.recommendations.push("Brak triggera 'create_specialist_profile' dla tabeli 'user_profiles'.");
          }

          const newUserTrigger = triggers.find((t: any) => 
            t.trigger_name === 'on_auth_user_created'
          );
          
          result.roles.rolesTriggerExists = !!newUserTrigger;
          
          if (!newUserTrigger) {
            result.recommendations.push("Brak triggera 'on_auth_user_created' dla obsługi nowych użytkowników.");
          }
        }
      }
    } catch (error) {
      console.error("Błąd podczas pobierania triggerów:", error);
      result.recommendations.push("Nie udało się pobrać triggerów. Sprawdź konfigurację bazy danych.");
    }

    // 4. Sprawdź indeksy
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_table_indexes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        const indexes = await response.json();
        
        if (indexes && Array.isArray(indexes)) {
          // Sprawdź brakujące indeksy
          const requiredIndexes = [
            { table: 'user_roles', column: 'user_id' },
            { table: 'clients', column: 'user_id' },
            { table: 'specialist_specializations', columns: ['specialist_id', 'specialization_id'] }
          ];
          
          for (const required of requiredIndexes) {
            let indexExists = false;
            
            if ('column' in required) {
              indexExists = indexes.some((idx: any) => 
                idx.table_name === required.table && 
                idx.column_names.includes(required.column)
              );
              
              if (!indexExists) {
                result.recommendations.push(`Brakujący indeks dla kolumny '${required.column}' w tabeli '${required.table}'.`);
              }
            } else if ('columns' in required) {
              // Złożony indeks
              indexExists = indexes.some((idx: any) => 
                idx.table_name === required.table && 
                required.columns.every(col => idx.column_names.includes(col))
              );
              
              if (!indexExists) {
                result.recommendations.push(`Brakujący złożony indeks dla kolumn '${required.columns.join(', ')}' w tabeli '${required.table}'.`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Błąd podczas pobierania indeksów:", error);
      result.recommendations.push("Nie udało się pobrać informacji o indeksach. Sprawdź konfigurację bazy danych.");
    }

    // 5. Sprawdź polityki bezpieczeństwa (RLS)
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_rls_policies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        const policies = await response.json();
        
        if (policies && Array.isArray(policies)) {
          const tableNeedingRLS = [
            'clients', 'pets', 'visits', 'care_programs', 
            'specialist_profiles', 'pet_notes', 'pet_note_attachments'
          ];
          
          for (const table of tableNeedingRLS) {
            const hasRLS = policies.some((p: any) => p.table_name === table);
            result.security.rlsPoliciesExist[table] = hasRLS;
            
            if (!hasRLS) {
              result.recommendations.push(`Brak polityk RLS dla tabeli '${table}'.`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Błąd podczas pobierania polityk RLS:", error);
      result.recommendations.push("Nie udało się pobrać informacji o politykach RLS. Sprawdź konfigurację bazy danych.");
    }

    // 6. Sprawdź relacje między tabelami
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_foreign_keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        const relations = await response.json();
        
        if (relations && Array.isArray(relations)) {
          const expectedRelations = [
            { table: 'pets', column: 'clientid', referencedTable: 'clients', referencedColumn: 'id' },
            { table: 'visits', column: 'petid', referencedTable: 'pets', referencedColumn: 'id' },
            { table: 'visits', column: 'clientid', referencedTable: 'clients', referencedColumn: 'id' },
            { table: 'care_programs', column: 'petid', referencedTable: 'pets', referencedColumn: 'id' },
            { table: 'pet_notes', column: 'pet_id', referencedTable: 'pets', referencedColumn: 'id' },
            { table: 'pet_note_attachments', column: 'note_id', referencedTable: 'pet_notes', referencedColumn: 'id' },
            { table: 'specialist_specializations', column: 'specialist_id', referencedTable: 'specialist_profiles', referencedColumn: 'id' },
            { table: 'specialist_specializations', column: 'specialization_id', referencedTable: 'specializations', referencedColumn: 'id' }
          ];
          
          result.relationships = relations.map((r: any) => ({
            table: r.table_name,
            column: r.column_name,
            referencedTable: r.foreign_table_name,
            referencedColumn: r.foreign_column_name
          }));
          
          for (const expected of expectedRelations) {
            const relationExists = relations.some((r: any) => 
              r.table_name === expected.table && 
              r.column_name === expected.column &&
              r.foreign_table_name === expected.referencedTable &&
              r.foreign_column_name === expected.referencedColumn
            );
            
            if (!relationExists) {
              result.recommendations.push(`Brakująca relacja: ${expected.table}.${expected.column} -> ${expected.referencedTable}.${expected.referencedColumn}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Błąd podczas pobierania relacji między tabelami:", error);
      result.recommendations.push("Nie udało się pobrać informacji o relacjach między tabelami. Sprawdź konfigurację bazy danych.");
    }

    return result;
  } catch (error) {
    console.error('Błąd podczas audytu bazy danych:', error);
    throw error;
  }
};

/**
 * Zwraca opis tabeli na podstawie jej nazwy
 */
function getTableDescription(tableName: string): string {
  const descriptions: Record<string, string> = {
    'user_profiles': 'Profile użytkowników zawierające dane osobowe',
    'user_roles': 'Role użytkowników w systemie',
    'specialist_profiles': 'Profile specjalistów z dodatkowymi informacjami',
    'specialist_specializations': 'Tabela łącząca specjalistów ze specjalizacjami',
    'specializations': 'Specjalizacje dostępne w systemie',
    'clients': 'Klienci (właściciele zwierząt)',
    'pets': 'Zwierzęta przypisane do klientów',
    'visits': 'Wizyty zwierząt u specjalistów',
    'care_programs': 'Programy opieki dla zwierząt',
    'pet_notes': 'Notatki dotyczące zwierząt',
    'pet_note_attachments': 'Załączniki do notatek o zwierzętach'
  };
  
  return descriptions[tableName] || `Tabela ${tableName}`;
}

/**
 * Uzupełnia brakujące funkcje SQL dla audytu
 */
export const setupAuditFunctions = async (): Promise<void> => {
  const functions = [
    {
      name: 'get_table_info',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_table_info(table_name text)
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY
          SELECT json_build_object(
            'column_name', columns.column_name,
            'data_type', columns.data_type,
            'is_nullable', columns.is_nullable
          )
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = $1;
        END;
        $$ LANGUAGE plpgsql;
      `
    },
    {
      name: 'get_enum_values',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_enum_values(enum_name text)
        RETURNS SETOF text AS $$
        BEGIN
          RETURN QUERY
          SELECT enumlabel::text
          FROM pg_enum
          JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
          WHERE pg_type.typname = $1;
        END;
        $$ LANGUAGE plpgsql;
      `
    },
    {
      name: 'get_triggers',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_triggers()
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY
          SELECT json_build_object(
            'trigger_name', pg_trigger.tgname,
            'event_object_table', pg_class.relname,
            'action_statement', pg_proc.prosrc
          )
          FROM pg_trigger
          JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
          JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
          JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
          WHERE pg_namespace.nspname = 'public';
        END;
        $$ LANGUAGE plpgsql;
      `
    },
    {
      name: 'get_table_indexes',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_table_indexes()
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY
          SELECT json_build_object(
            'table_name', pg_class.relname,
            'index_name', i.relname,
            'column_names', array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum))
          )
          FROM pg_index ix
          JOIN pg_class i ON i.oid = ix.indexrelid
          JOIN pg_class pg_class ON pg_class.oid = ix.indrelid
          JOIN pg_namespace n ON n.oid = pg_class.relnamespace
          JOIN pg_attribute a ON a.attrelid = pg_class.oid AND a.attnum = ANY(ix.indkey)
          WHERE n.nspname = 'public'
          GROUP BY pg_class.relname, i.relname;
        END;
        $$ LANGUAGE plpgsql;
      `
    },
    {
      name: 'get_rls_policies',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_rls_policies()
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY
          SELECT json_build_object(
            'policy_name', pg_policy.polname,
            'table_name', pg_class.relname,
            'cmd', pg_policy.polcmd,
            'roles', pg_policy.polroles
          )
          FROM pg_policy
          JOIN pg_class ON pg_policy.polrelid = pg_class.oid
          JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
          WHERE pg_namespace.nspname = 'public';
        END;
        $$ LANGUAGE plpgsql;
      `
    },
    {
      name: 'get_foreign_keys',
      sql: `
        CREATE OR REPLACE FUNCTION public.get_foreign_keys()
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY
          SELECT json_build_object(
            'table_name', cl.relname,
            'column_name', att.attname,
            'foreign_table_name', clf.relname,
            'foreign_column_name', attf.attname
          )
          FROM pg_constraint con
          JOIN pg_class cl ON cl.oid = con.conrelid
          JOIN pg_namespace nsp ON nsp.oid = cl.relnamespace
          JOIN pg_attribute att ON att.attrelid = cl.oid AND att.attnum = ANY(con.conkey)
          JOIN pg_class clf ON clf.oid = con.confrelid
          JOIN pg_namespace nspf ON nspf.oid = clf.relnamespace
          JOIN pg_attribute attf ON attf.attrelid = clf.oid AND attf.attnum = ANY(con.confkey)
          WHERE con.contype = 'f'
          AND nsp.nspname = 'public';
        END;
        $$ LANGUAGE plpgsql;
      `
    }
  ];
  
  for (const func of functions) {
    try {
      await createCustomFunction(func.sql);
      console.log(`Funkcja ${func.name} została utworzona lub już istnieje`);
    } catch (error) {
      console.error(`Błąd podczas sprawdzania funkcji ${func.name}:`, error);
    }
  }
};
