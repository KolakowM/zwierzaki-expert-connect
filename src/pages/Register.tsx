
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    termsAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialization: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.specialization
      ) {
        throw new Error("Wszystkie pola są wymagane");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Hasła nie są identyczne");
      }

      if (!formData.termsAccepted) {
        throw new Error("Musisz zaakceptować warunki korzystania z serwisu");
      }

      // Success toast
      toast({
        title: "Rejestracja zakończona pomyślnie",
        description: "Twoje konto zostało utworzone. Na Twój email wysłaliśmy link weryfikacyjny.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        termsAccepted: false,
      });
    } catch (error) {
      toast({
        title: "Błąd rejestracji",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas rejestracji",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center py-12">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Rejestracja specjalisty</CardTitle>
              <CardDescription>
                Utwórz konto, aby korzystać z platformy ExpertZwierzaki
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Jan"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Kowalski"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Główna specjalizacja</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz specjalizację" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dietetyk">Dietetyk zwierzęcy</SelectItem>
                      <SelectItem value="behawiorysta">Behawiorysta</SelectItem>
                      <SelectItem value="fizjoterapeuta">Fizjoterapeuta</SelectItem>
                      <SelectItem value="trener">Trener zwierząt</SelectItem>
                      <SelectItem value="groomer">Groomer</SelectItem>
                      <SelectItem value="weterynarz">Weterynarz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Hasło</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Powtórz hasło</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Akceptuję{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      regulamin
                    </Link>{" "}
                    oraz{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      politykę prywatności
                    </Link>
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Rejestracja..." : "Zarejestruj się"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm">
                Masz już konto?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Zaloguj się
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
