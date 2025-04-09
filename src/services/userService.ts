
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from "@/components/admin/users/UserFormDialog";

// Create a new user
export const createUser = async (userData: UserFormValues) => {
  // In a real application, we would use Supabase Auth to create users
  // For this prototype, we'll just simulate the creation
  
  // Generate a random ID for the mock user
  const id = Math.random().toString(36).substring(2, 15);
  
  // Create a user object with the form data
  const newUser = {
    id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    status: userData.status,
    lastLogin: null
  };
  
  // In a real application, we would:
  // 1. Create the user in Supabase Auth
  // 2. Store additional user data in a profiles table or user_roles table
  
  console.log('User created:', newUser);
  
  // Return the new user
  return newUser;
};

// Update an existing user
export const updateUser = async (userId: string, userData: UserFormValues) => {
  // In a real application, we would update the user in Supabase
  // For this prototype, we'll just simulate the update
  
  // Create an updated user object
  const updatedUser = {
    id: userId,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    status: userData.status,
    // Preserve other fields that might be in the user object
  };
  
  // In a real application, we would:
  // 1. Update the user in Supabase Auth if necessary
  // 2. Update user data in profiles or user_roles tables
  
  console.log('User updated:', updatedUser);
  
  // Return the updated user
  return updatedUser;
};

// Delete a user
export const deleteUser = async (userId: string) => {
  // In a real application, we would delete the user from Supabase
  // For this prototype, we'll just simulate the deletion
  
  console.log('User deleted:', userId);
  
  // Return true to indicate success
  return true;
};

// Get a list of users
export const getUsers = async () => {
  // In a real application, we would fetch users from Supabase
  // For this prototype, we'll return mock data
  
  // Mock users (this would come from the database in a real app)
  const mockUsers = [
    {
      id: "1",
      name: "Anna Kowalska",
      email: "anna.kowalska@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2023-04-05T12:00:00Z"
    },
    {
      id: "2",
      name: "Jan Nowak",
      email: "jan.nowak@example.com",
      role: "specialist",
      status: "active",
      lastLogin: "2023-04-03T14:30:00Z"
    },
    {
      id: "3",
      name: "Maria Wiśniewska",
      email: "maria.wisniewska@example.com",
      role: "specialist",
      status: "inactive",
      lastLogin: "2023-03-25T09:15:00Z"
    },
    {
      id: "4",
      name: "Piotr Dąbrowski",
      email: "piotr.dabrowski@example.com",
      role: "user",
      status: "active",
      lastLogin: "2023-04-04T16:45:00Z"
    },
    {
      id: "5",
      name: "Aleksandra Lewandowska",
      email: "aleksandra.lewandowska@example.com",
      role: "user",
      status: "pending",
      lastLogin: null
    },
  ];
  
  return mockUsers;
};
