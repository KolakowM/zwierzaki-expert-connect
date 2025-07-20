
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().email("Wprowadź poprawny adres email"),
  subject: z.string().min(3, "Temat musi mieć co najmniej 3 znaki"),
  message: z.string().min(10, "Wiadomość musi mieć co najmniej 10 znaków")
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting contact form:", values);
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: values
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Email sent successfully:", data);

      toast({
        title: "Wiadomość wysłana",
        description: "Dziękujemy za kontakt! Odpowiemy najszybciej jak to możliwe."
      });

      form.reset();
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Kontakt</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Masz pytania dotyczące platformy PetsFlow? Skontaktuj się z nami, a nasz zespół z przyjemnością odpowie na wszystkie Twoje pytania.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex flex-col items-center space-y-3 text-center">
                {/* <div className="rounded-full bg-primary/10 p-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>*/}
                <h3 className="text-xl font-medium"> </h3>
                <p className="text-muted-foreground"> </p>
                <p> </p>
                <p className="text-sm text-muted-foreground"> </p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Email</h3>
                <p className="text-muted-foreground">Wyślij nam wiadomość email</p>
                <p>kontakt@PetsFlow.pl</p>
                <p className="text-sm text-muted-foreground">Odpowiadamy w ciągu 24h</p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center space-y-3 text-center">
                {/*} <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div> */}
                <h3 className="text-xl font-medium"> </h3>
                <p className="text-muted-foreground"> </p>
                <p> </p>
                <p> </p>
              </div>
            </Card>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-2xl font-bold">Wyślij wiadomość</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField 
                    control={form.control} 
                    name="name" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imię i nazwisko</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan Kowalski" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="email" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres email</FormLabel>
                        <FormControl>
                          <Input placeholder="jan.kowalski@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                
                <FormField 
                  control={form.control} 
                  name="subject" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temat</FormLabel>
                      <FormControl>
                        <Input placeholder="Temat twojej wiadomości" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="message" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wiadomość</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Twoja wiadomość..." className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
