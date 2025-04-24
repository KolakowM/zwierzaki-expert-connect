
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { resetPassword } from "@/services/authService";
import MainLayout from "@/components/layout/MainLayout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Wprowadź poprawny adres email" }),
});

type FormValues = z.infer<typeof formSchema>;

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      await resetPassword(values.email);
      
      setEmailSent(true);
      toast({
        title: "Link do resetowania hasła wysłany",
        description: "Sprawdź swoją skrzynkę email, aby zresetować hasło",
      });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zresetować hasła. " + (error.message || "Spróbuj ponownie później."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl">Resetowanie hasła</CardTitle>
              <CardDescription>
                {emailSent 
                  ? "Wysłaliśmy instrukcje resetowania hasła na Twój adres e-mail."
                  : "Wprowadź swój adres e-mail, aby zresetować hasło"}
              </CardDescription>
            </CardHeader>
            
            {!emailSent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField 
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="nazwa@przyklad.pl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Wysyłanie..." : "Zresetuj hasło"}
                    </Button>
                    
                    <div className="text-center text-sm">
                      <Link to="/login" className="text-primary hover:underline">
                        Powrót do logowania
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            ) : (
              <CardContent className="space-y-4 text-center pb-8">
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                
                <p className="text-muted-foreground">
                  Jeśli konto istnieje, to wkrótce otrzymasz email z instrukcjami do zresetowania hasła.
                </p>
                
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/login">Powrót do logowania</Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
