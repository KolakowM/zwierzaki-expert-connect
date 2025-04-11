
import { useState, useEffect } from 'react';
import { useSpecializations, Specialization, useSpecialistSpecializations } from '@/hooks/useSpecializations';

// Legacy specializations data structure (fallback)
const FALLBACK_SPECIALIZATIONS = [
  { 
    id: "diet", 
    label: "Dietetyk zwierzęcy",
    description: "Specjalista zajmujący się żywieniem i dietą zwierząt" 
  },
  { 
    id: "behavior", 
    label: "Behawiorysta",
    description: "Specjalista zajmujący się zachowaniem zwierząt" 
  },
  { 
    id: "physio", 
    label: "Fizjoterapeuta",
    description: "Specjalista zajmujący się rehabilitacją i fizjoterapią zwierząt" 
  },
  { 
    id: "training", 
    label: "Trener",
    description: "Specjalista zajmujący się treningiem i szkoleniem zwierząt" 
  },
  { 
    id: "groomer", 
    label: "Groomer",
    description: "Specjalista zajmujący się pielęgnacją i strzyżeniem zwierząt" 
  },
  { 
    id: "vet", 
    label: "Weterynarz",
    description: "Specjalista zajmujący się leczeniem zwierząt" 
  },
  { 
    id: "alternative", 
    label: "Medycyna alternatywna",
    description: "Specjalista zajmujący się alternatywnymi metodami leczenia zwierząt" 
  }
];

// In-memory cache for specializations mapping
let specializationsCache: Map<string, string> | null = null;

// Function to get specialization label by code
export function getSpecializationLabel(code: string): string {
  if (!specializationsCache) {
    // If cache is not initialized, use fallback
    const specialization = FALLBACK_SPECIALIZATIONS.find(spec => spec.id === code);
    return specialization?.label || code;
  }
  
  return specializationsCache.get(code) || code;
}

// Function to get specialization ID by code
export function getSpecializationId(label: string): string | undefined {
  if (!specializationsCache) {
    // If cache is not initialized, use fallback
    const specialization = FALLBACK_SPECIALIZATIONS.find(spec => spec.label === label);
    return specialization?.id;
  }
  
  // Search through cache for the code with this label
  for (const [code, name] of specializationsCache.entries()) {
    if (name === label) return code;
  }
  
  return undefined;
}

// Function to map codes to labels
export function mapSpecializationIdsToLabels(codes: string[]): string[] {
  return codes.map(code => getSpecializationLabel(code));
}

// Function to map labels to codes
export function mapSpecializationLabelsToIds(labels: string[]): string[] {
  return labels
    .map(label => getSpecializationId(label))
    .filter((id): id is string => id !== undefined);
}

// Updated hook to use specializations data
export function useSpecializationsData() {
  const { specializations, isLoading, error } = useSpecializations();
  
  // Initialize and update the cache when specializations are loaded
  useEffect(() => {
    if (specializations.length > 0 && !specializationsCache) {
      specializationsCache = new Map();
      specializations.forEach(spec => {
        specializationsCache!.set(spec.code, spec.name);
      });
    }
  }, [specializations]);
  
  return {
    specializations: specializations.map(spec => ({
      id: spec.code,
      label: spec.name,
      description: spec.description || undefined
    })),
    isLoading,
    error
  };
}

// New hook to manage specialist specializations
export function useSpecialistSpecializationsManager(specialistId?: string) {
  const { specializations, isLoading: isLoadingAll } = useSpecializations();
  const { 
    specializations: specialistSpecializations, 
    specializationIds,
    isLoading: isLoadingSpecialist, 
    error 
  } = useSpecialistSpecializations(specialistId);

  // Function to save specializations for a specialist
  const saveSpecializations = async (selectedIds: string[]) => {
    if (!specialistId) return { success: false, error: 'No specialist ID provided' };
    
    try {
      // First, remove all existing specializations for this specialist
      const { error: deleteError } = await supabase
        .from('specialist_specializations')
        .delete()
        .eq('specialist_id', specialistId);
      
      if (deleteError) throw deleteError;
      
      // Then, insert the new selected specializations
      if (selectedIds.length > 0) {
        const newSpecializations = selectedIds.map(specId => ({
          specialist_id: specialistId,
          specialization_id: specId
        }));
        
        const { error: insertError } = await supabase
          .from('specialist_specializations')
          .insert(newSpecializations);
        
        if (insertError) throw insertError;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving specializations:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };
  
  return {
    allSpecializations: specializations,
    specialistSpecializations,
    selectedSpecializationIds: specializationIds,
    isLoading: isLoadingAll || isLoadingSpecialist,
    error,
    saveSpecializations
  };
}
