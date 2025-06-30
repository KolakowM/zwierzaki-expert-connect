
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email:", { name, email, subject });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "PetsFlow <noreply@resend.dev>",
      to: [email],
      subject: "Dziękujemy za kontakt - PetsFlow",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Dziękujemy za kontakt!</h1>
          <p>Witaj ${name},</p>
          <p>Otrzymaliśmy Twoją wiadomość i skontaktujemy się z Tobą najszybciej jak to możliwe.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Twoja wiadomość:</h3>
            <p><strong>Temat:</strong> ${subject}</p>
            <p><strong>Treść:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>Pozdrawiamy,<br>Zespół PetsFlow</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            To jest automatyczna wiadomość potwierdzająca. Prosimy nie odpowiadać na ten email.
          </p>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "PetsFlow Contact <noreply@resend.dev>", 
      to: ["kontakt@petsflow.pl"],
      subject: `Nowa wiadomość kontaktowa: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Nowa wiadomość kontaktowa</h1>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Imię i nazwisko:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temat:</strong> ${subject}</p>
            <p><strong>Wiadomość:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px;">${message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Otrzymano: ${new Date().toLocaleString('pl-PL')}
          </p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { userEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ 
      success: true,
      message: "Wiadomość została wysłana pomyślnie"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Wystąpił błąd podczas wysyłania wiadomości",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
