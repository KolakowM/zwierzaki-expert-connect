
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

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    console.log("Processing contact form submission:", { name, email, subject });

    // Send notification email to your team
    const notificationResponse = await resend.emails.send({
      from: "PetsFlow Kontakt <admin@petsflow.pl>",
      to: ["kontakt@PetsFlow.pl"], // Your contact email
      subject: `Nowa wiadomość: ${subject}`,
      html: `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Od:</strong> ${name} (${email})</p>
        <p><strong>Temat:</strong> ${subject}</p>
        <p><strong>Wiadomość:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Ta wiadomość została wysłana przez formularz kontaktowy na stronie PetsFlow.
        </p>
      `,
    });

    // Send confirmation email to the user
    const confirmationResponse = await resend.emails.send({
      from: "PetsFlow <admin@petsflow.pl>",
      to: [email],
      subject: "Potwierdzenie - otrzymaliśmy Twoją wiadomość",
      html: `
        <h1>Dziękujemy za kontakt, ${name}!</h1>
        <p>Otrzymaliśmy Twoją wiadomość dotyczącą: <strong>${subject}</strong></p>
        <p>Odpowiemy najszybciej jak to możliwe, zazwyczaj w ciągu 24 godzin.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Twoja wiadomość:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>W międzyczasie zapraszamy do zapoznania się z naszą <a href="https://petsflow.pl/faq">sekcją FAQ</a>, gdzie znajdziesz odpowiedzi na najczęściej zadawane pytania.</p>
        
        <p>Pozdrawiamy,<br>
        Zespół PetsFlow</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Ta wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten email.
        </p>
      `,
    });

    console.log("Emails sent successfully:", { notificationResponse, confirmationResponse });

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
