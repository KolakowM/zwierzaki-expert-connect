
import { useState, useEffect } from 'react';
import { useSpecializations, Specialization, useSpecialistSpecializations } from '@/hooks/useSpecializations';
import { supabase } from '@/integrations/supabase/client';

// Hook to use specializations data
export function useSpecializationsData() {
  const { specializations, isLoading, error } = useSpecializations();
  
  return {
    specializations,
    isLoading,
    error
  };
}

// Hook to manage specialist specializations
export function useSpecialistSpecializationsManager(specialistId?: string) {
  const { specializations: allSpecializations, isLoading: isLoadingAll } = useSpecializations();
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
      console.log('Saving specializations with IDs:', selectedIds);
      
      // Validate that all IDs are valid UUIDs before proceeding
      const validUUIDs = selectedIds.filter(id => {
        // Simple UUID format validation
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      });
      
      if (validUUIDs.length !== selectedIds.length) {
        console.error('Invalid specialization IDs detected:', 
          selectedIds.filter(id => !validUUIDs.includes(id)));
        return { success: false, error: 'Invalid specialization IDs detected' };
      }
      
      // First, remove all existing specializations for this specialist
      const { error: deleteError } = await supabase
        .from('specialist_specializations')
        .delete()
        .eq('specialist_id', specialistId);
      
      if (deleteError) throw deleteError;
      
      // Then, insert the new selected specializations
      if (validUUIDs.length > 0) {
        const newSpecializations = validUUIDs.map(specId => ({
          specialist_id: specialistId,
          specialization_id: specId
        }));
        
        console.log('Inserting new specializations:', newSpecializations);
        
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
    allSpecializations,
    specialistSpecializations,
    selectedSpecializationIds: specializationIds,
    isLoading: isLoadingAll || isLoadingSpecialist,
    error,
    saveSpecializations
  };
}
