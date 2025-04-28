
import { supabase } from "@/integrations/supabase/client";

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
      const { data: columns, error: columnsError } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);

      result.tables[tableName] = {
        exists: !columnsError,
        name: tableName,
        description: getTableDescription(tableName),
      };

      if (columnsError) {
        result.recommendations.push(`Tabela '${tableName}' nie istnieje. Należy ją utworzyć.`);
      } else {
        // Pobierz informacje o kolumnach
        const { data: tableInfo } = await supabase.rpc('get_table_info', {
          table_name: tableName
        });
        
        if (tableInfo && tableInfo.length > 0) {
          result.tables[tableName].columns = {};
          tableInfo.forEach((column: any) => {
            result.tables[tableName].columns![column.column_name] = column.data_type;
          });
        }
      }
    }

    // 2. Sprawdź role użytkowników
    const { data: roleTypes } = await supabase.rpc('get_enum_values', {
      enum_name: 'app_role'
    });

    if (roleTypes) {
      result.roles.validRoleTypes = roleTypes;
      if (!roleTypes.includes('specialist')) {
        result.recommendations.push("Typ enum 'app_role' nie zawiera wartości 'specialist'.");
      }
    }

    // 3. Sprawdź triggery
    const { data: triggers } = await supabase.rpc('get_triggers');
    
    if (triggers) {
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

    // 4. Sprawdź indeksy
    const { data: indexes } = await supabase.rpc('get_table_indexes');
    
    if (indexes) {
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
          const columnsSet = new Set(required.columns);
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

    // 5. Sprawdź polityki bezpieczeństwa (RLS)
    const { data: policies } = await supabase.rpc('get_rls_policies');
    
    if (policies) {
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

    // 6. Sprawdź relacje między tabelami
    const { data: relations } = await supabase.rpc('get_foreign_keys');
    
    if (relations) {
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
      // Sprawdź czy funkcja już istnieje
      const { data, error } = await supabase.rpc(func.name);
      if (error && error.message.includes('function does not exist')) {
        // Wykonaj SQL aby utworzyć funkcję pomocniczą
        const { error: createError } = await supabase.rpc('create_function', {
          sql: func.sql
        });
        
        if (createError) {
          console.error(`Błąd podczas tworzenia funkcji ${func.name}:`, createError);
        } else {
          console.log(`Funkcja ${func.name} została utworzona`);
        }
      }
    } catch (error) {
      console.error(`Błąd podczas sprawdzania funkcji ${func.name}:`, error);
    }
  }
};

