import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, UserPlus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, updateUser } from "@/services/userService";

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Imię i nazwisko jest wymagane" }),
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  role: z.string().min(1, { message: "Rola jest wymagana" }),
  status: z.string().min(1, { message: "Status jest wymagany" }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserData {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string | null;
}

interface UserFormDialogProps {
  user?: UserData;
  onUserSaved?: (user: UserData) => void;
  isEditing?: boolean;
}

const UserFormDialog = ({
  user,
  onUserSaved,
  isEditing = false,
}: UserFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      : {
          name: "",
          email: "",
          role: "user",
          status: "active",
        },
  });

  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && user?.id) {
        const updatedUser = await updateUser(user.id, values);
        toast({
          title: "Użytkownik zaktualizowany",
          description: `Dane użytkownika ${values.name} zostały zaktualizowane`
        });
        
        if (onUserSaved) {
          onUserSaved(updatedUser);
        }
      } else {
        const newUser = await createUser(values);
        toast({
          title: "Użytkownik dodany",
          description: `Użytkownik ${values.name} został dodany do systemu`
        });
        
        if (onUserSaved) {
          onUserSaved(newUser);
        }
      }
      
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas zapisywania użytkownika",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditing ? "ghost" : "default"} size={isEditing ? "icon" : "default"}>
          {isEditing ? <User className="h-4 w-4" /> : <><UserPlus className="mr-2 h-4 w-4" /> Dodaj Użytkownika</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edytuj użytkownika" : "Dodaj nowego użytkownika"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię i Nazwisko</FormLabel>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="jan.kowalski@example.com" 
                      type="email"
                      {...field}
                      readOnly={isEditing && !user?.id}
                      className={isEditing && !user?.id ? "bg-gray-100" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rola</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz rolę" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="specialist">Specjalista</SelectItem>
                      <SelectItem value="user">Użytkownik</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Aktywny</SelectItem>
                      <SelectItem value="inactive">Nieaktywny</SelectItem>
                      <SelectItem value="pending">Oczekujący</SelectItem>
                      <SelectItem value="niezweryfikowany">Niezweryfikowany</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Anuluj
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Zapisywanie..." : "Zapisz"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
