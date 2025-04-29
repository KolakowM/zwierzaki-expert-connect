
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppRole } from "@/services/user/types";

export interface CatalogUser {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  location: string;
  image: string;
  rating?: number;
  verified: boolean;
  role: AppRole; // Updated from string to AppRole
}

export function useCatalogData() {
  const [users, setUsers] = useState<CatalogUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CatalogUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Fetching all users from database');
        
        // 1. Fetch all user profiles
        const { data: userProfiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name, email');
          
        if (profileError) {
          throw profileError;
        }
        
        if (!userProfiles || userProfiles.length === 0) {
          console.log('No users found');
          setUsers([]);
          setFilteredUsers([]);
          setLoading(false);
          return;
        }
        
        // 2. Get all user IDs to fetch related data
        const userIds = userProfiles.map(profile => profile.id);
        
        // 3. Fetch user roles to identify specialists, admins, etc.
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role, status')
          .in('user_id', userIds);
          
        if (rolesError) {
          throw rolesError;
        }
        
        // 4. Fetch specialist profiles for users with specialist role
        const { data: specialistProfiles, error: specialistsError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .in('id', userIds);
          
        if (specialistsError) {
          throw specialistsError;
        }
        
        // 5. Fetch specialist specializations
        const { data: specialistSpecs, error: specsError } = await supabase
          .from('specialist_specializations')
          .select('specialist_id, specialization_id')
          .in('specialist_id', userIds);
          
        if (specsError) {
          throw specsError;
        }
        
        // Create maps for easier lookup
        const roleMap = new Map();
        userRoles?.forEach(role => {
          roleMap.set(role.user_id, {role: role.role, status: role.status});
        });
        
        const specializationsBySpecialist: Record<string, string[]> = {};
        specialistSpecs?.forEach(spec => {
          if (!specializationsBySpecialist[spec.specialist_id]) {
            specializationsBySpecialist[spec.specialist_id] = [];
          }
          specializationsBySpecialist[spec.specialist_id].push(spec.specialization_id);
        });
        
        // 6. Combine all data for each user
        const catalogUsers: CatalogUser[] = userProfiles.map(userProfile => {
          const userId = userProfile.id;
          const userRole = roleMap.get(userId) || { role: 'user' as AppRole, status: 'niezweryfikowany' };
          const specialistProfile = specialistProfiles?.find(p => p.id === userId);
          
          let name = "Użytkownik";
          if (userProfile) {
            name = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
            if (!name) name = "Użytkownik";
          }
          
          // Define title based on role and specialist profile
          let title = "Użytkownik systemu";
          if (userRole.role === 'specialist' && specialistProfile?.title) {
            title = specialistProfile.title;
          } else if (userRole.role === 'admin') {
            title = "Administrator";
          }
          
          return {
            id: userId,
            name: name,
            title: title,
            specializations: userRole.role === 'specialist' ? 
              specializationsBySpecialist[userId] || [] : [],
            location: specialistProfile?.location || "Polska",
            image: specialistProfile?.photo_url || "/placeholder.svg",
            rating: 4.5, // Default rating
            verified: userRole.status === 'verified',
            role: userRole.role as AppRole
          };
        });
        
        setUsers(catalogUsers);
        setFilteredUsers(catalogUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać listy użytkowników",
          variant: "destructive"
        });
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  const filterUsers = (filters: any) => {
    let filtered = [...users];

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(term) ||
          user.title.toLowerCase().includes(term)
      );
    }

    // Filter by user role if specified
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Filter by location (mainly for specialists)
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(
        user => user.location.toLowerCase().includes(location)
      );
    }

    // Filter by specializations (only applicable to specialists)
    if (filters.specializations && filters.specializations.length > 0) {
      filtered = filtered.filter(user =>
        user.role === 'specialist' && 
        Array.isArray(user.specializations) && 
        user.specializations.some(specId =>
          filters.specializations.includes(specId)
        )
      );
    }

    return filtered;
  };

  return {
    users,
    filteredUsers,
    setFilteredUsers,
    loading,
    filterUsers
  };
}
