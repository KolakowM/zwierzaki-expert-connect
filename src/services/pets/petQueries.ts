
import { Pet } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbPetToPet } from "./mappers";

export const getPets = async (): Promise<Pet[]> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) return [];
    
    // Najpierw pobierz klientów zalogowanego użytkownika
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', authUser.user.id);
      
    if (clientsError || !clients || clients.length === 0) {
      console.error("Error fetching clients or no clients found:", clientsError);
      return [];
    }
    
    // Pobierz zwierzęta przypisane do klientów tego użytkownika
    const clientIds = clients.map(client => client.id);
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('*')
      .in('clientid', clientIds);
      
    if (petsError) {
      console.error("Error fetching pets:", petsError);
      return [];
    }
    
    return pets ? pets.map(mapDbPetToPet) : [];
  } catch (error) {
    console.error("Error in getPets:", error);
    return [];
  }
};

export const getPetById = async (petId: string): Promise<Pet | null> => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .single();
      
    if (error) {
      console.error("Error fetching pet by id:", error);
      return null;
    }
    
    return data ? mapDbPetToPet(data) : null;
  } catch (error) {
    console.error("Error in getPetById:", error);
    return null;
  }
};

export const getPetsByClientId = async (clientId: string): Promise<Pet[]> => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('clientid', clientId);
      
    if (error) {
      console.error("Error fetching pets by client id:", error);
      return [];
    }
    
    return data ? data.map(mapDbPetToPet) : [];
  } catch (error) {
    console.error("Error in getPetsByClientId:", error);
    return [];
  }
};

export const getVisitsByPetId = async (petId: string) => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('petid', petId);
      
    if (error) {
      console.error("Error fetching visits by pet id:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getVisitsByPetId:", error);
    return [];
  }
};
