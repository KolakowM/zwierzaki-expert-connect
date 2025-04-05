
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - in real implementation would connect to authentication service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just validate that fields aren't empty
      if (!email || !password) {
        throw new Error("Wszystkie pola są wymagane");
      }
      
      // Success toast
      toast({
        title: "Zalogowano pomyślnie",
        description: "Przekierowujemy do panelu specjalisty...",
      });
      
      // In a real app, would save auth token and redirect
      // For now, just reset form
      setEmail("");
      setPassword("");
    } catch (error) {
      toast({
        title: "Błąd logowania",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas logowania",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center py-16">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Logowanie</CardTitle>
              <CardDescription>
                Wprowadź swoje dane, aby zalogować się do platformy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Hasło</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Zapomniałem hasła
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logowanie..." : "Zaloguj się"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm">
                Nie masz konta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Zarejestruj się
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
