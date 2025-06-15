
import { Visit } from '@/types';
import { createVisit as originalCreateVisit, updateVisit } from '@/services/visitService';
import { withPackageLimitValidation } from '@/services/packageLimitsService';

// Enhanced create visit with automatic limit validation for pets
export const createVisit = withPackageLimitValidation(
  async (visitData: Omit<Visit, 'id'> & { userId: string }) => {
    // Extract userId and pass the rest to the original function
    const { userId, ...restVisitData } = visitData;
    return await originalCreateVisit(restVisitData);
  },
  'pets' // Visits are limited by pet count
);

// Re-export other functions as-is
export { updateVisit, getVisits, getVisitById, deleteVisit } from '@/services/visitService';
