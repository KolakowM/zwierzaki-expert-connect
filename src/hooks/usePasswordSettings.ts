
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateUserPassword } from "@/services/authService";
import { PasswordFormValues } from "./useAccountSettings";

export function usePasswordSettings() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onPasswordSubmit(values: PasswordFormValues, resetForm: () => void) {
    try {
      setIsSubmitting(true);
      
      await updateUserPassword(values.currentPassword, values.newPassword);
      
      toast({
        title: "Hasło zostało zmienione",
        description: "Twoje hasło zostało pomyślnie zaktualizowane."
      });
      
      resetForm();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Błąd zmiany hasła",
        description: error.message || "Wystąpił błąd podczas zmiany hasła.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    onPasswordSubmit
  };
}
