
import { supabase } from "@/integrations/supabase/client";

export const setupAuth = async () => {
  // This function can be used to set up initial auth settings 
  // like creating admin user, etc.
  console.log("Setting up auth...");
};

export const checkDatabaseSetup = async (): Promise<{
  tablesExist: boolean;
  clientsTableExists: boolean;
  petsTableExists: boolean;
  visitsTableExists: boolean;
  careProgramsTableExists: boolean;
}> => {
  try {
    // Check if the tables exist
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('count()')
      .limit(1);

    const { data: petsData, error: petsError } = await supabase
      .from('pets')
      .select('count()')
      .limit(1);

    const { data: visitsData, error: visitsError } = await supabase
      .from('visits')
      .select('count()')
      .limit(1);

    const { data: careProgramsData, error: careProgramsError } = await supabase
      .from('care_programs')
      .select('count()')
      .limit(1);

    return {
      tablesExist: !clientsError && !petsError && !visitsError && !careProgramsError,
      clientsTableExists: !clientsError,
      petsTableExists: !petsError,
      visitsTableExists: !visitsError,
      careProgramsTableExists: !careProgramsError,
    };
  } catch (error) {
    console.error("Error checking database setup:", error);
    return {
      tablesExist: false,
      clientsTableExists: false,
      petsTableExists: false,
      visitsTableExists: false,
      careProgramsTableExists: false,
    };
  }
};
