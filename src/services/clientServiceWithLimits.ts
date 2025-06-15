
import { Client } from '@/types';
import { createClient as originalCreateClient, updateClient } from '@/services/clientService';
import { withPackageLimitValidation } from '@/services/packageLimitsService';

// Enhanced create client with automatic limit validation
export const createClient = withPackageLimitValidation(
  async (clientData: Omit<Client, 'id' | 'createdat'> & { userId: string }) => {
    // Extract userId and pass the rest to the original function
    const { userId, ...restClientData } = clientData;
    return await originalCreateClient(restClientData);
  },
  'clients'
);

// Re-export other functions as-is since they don't need limit checks
export { updateClient, getClients, getClientById, deleteClient } from '@/services/clientService';
