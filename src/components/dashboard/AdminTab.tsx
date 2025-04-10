
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const AdminTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAssigning, setIsAssigning] = useState(false);
  const [unassignedCount, setUnassignedCount] = useState(0);

  useEffect(() => {
    // Check for unassigned clients
    const checkUnassignedClients = async () => {
      if (!user?.id) return;
      
      try {
        // Use a service role or direct database access to bypass RLS
        // This is just for display purposes, the actual assignment will be done via an admin function
        const { count, error } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .is('user_id', null);
        
        if (error) throw error;
        
        setUnassignedCount(count || 0);
      } catch (error) {
        console.error('Error checking unassigned clients:', error);
      }
    };
    
    checkUnassignedClients();
  }, [user]);

  const assignClientsToCurrentUser = async () => {
    if (!user?.id) return;
    
    try {
      setIsAssigning(true);
      
      // In a real-world scenario, you would likely want this to be a secure admin function
      // Here we're demonstrating the concept for the current user's profile
      
      // Update all clients that have no user_id to the current user
      // Fix: Using the more type-safe function call approach
      const { data, error } = await supabase
        .from('clients')
        .update({ user_id: user.id })
        .is('user_id', null)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Klienci przypisani",
        description: "Wszystkie niezaprisane rekordy zostały przypisane do Twojego konta",
      });
      
      // Refresh the count
      setUnassignedCount(0);
    } catch (error: any) {
      console.error('Error assigning clients:', error);
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się przypisać klientów",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (unassignedCount === 0) {
    return null; // Don't show this card if there are no unassigned clients
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administracja danymi</CardTitle>
        <CardDescription>
          Narzędzia do zarządzania danymi aplikacji
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Wykryto {unassignedCount} rekordów klientów bez przypisanego użytkownika. 
          Te rekordy nie będą widoczne w aplikacji z powodu zabezpieczeń Row Level Security.
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          Możesz przypisać te rekordy do swojego konta, aby uzyskać do nich dostęp.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={assignClientsToCurrentUser} 
          disabled={isAssigning}
        >
          {isAssigning ? "Przypisywanie..." : "Przypisz do mojego konta"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminTab;
