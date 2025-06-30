
import { supabase } from "@/integrations/supabase/client";

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (emailData: ContactEmailData) => {
  try {
    console.log("Sending contact email:", emailData);
    
    const { data, error } = await supabase.functions.invoke('send-contact-email', {
      body: emailData
    });

    if (error) {
      console.error("Error invoking send-contact-email function:", error);
      throw new Error(error.message || "Błąd podczas wysyłania wiadomości");
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Error in sendContactEmail:", error);
    throw new Error(error.message || "Wystąpił błąd podczas wysyłania wiadomości");
  }
};
