
import { Pet } from '@/types';
import { createPet as originalCreatePet, updatePet } from '@/services/petService';
import { withPackageLimitValidation } from '@/services/packageLimitsService';

// Enhanced create pet with automatic limit validation
export const createPet = withPackageLimitValidation(
  async (petData: Omit<Pet, 'id' | 'createdat'> & { userId: string }) => {
    // Extract userId and pass the rest to the original function
    const { userId, ...restPetData } = petData;
    return await originalCreatePet(restPetData);
  },
  'pets'
);

// Re-export other functions as-is since they don't need limit checks
export { updatePet, getPets, getPetById, deletePet } from '@/services/petService';
