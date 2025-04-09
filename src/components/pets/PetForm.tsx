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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define species and sex as enum for consistent typing
export const PET_SPECIES = ["pies", "kot", "królik", "chomik", "świnka morska", "inne"] as const;
export const PET_SEX = ["samiec", "samica"] as const;

export type PetSpecies = typeof PET_SPECIES[number];
export type PetSex = typeof PET_SEX[number];

// Define the schema for pet validation
const petFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  species: z.enum(PET_SPECIES),
  breed: z.string().optional(),
  // Parse age as a number (integer)
  age: z.string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) => val === undefined || !isNaN(val),
      { message: "Wiek musi być liczbą" }
    ),
  // Parse weight as a number (can be decimal)
  weight: z.string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) => val === undefined || !isNaN(val),
      { message: "Waga musi być liczbą" }
    ),
  sex: z.enum(PET_SEX).optional(),
  neutered: z.boolean().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  behavioralNotes: z.string().optional(),
});

// Define the actual form values type (before transformation)
export type PetFormValues = z.input<typeof petFormSchema>;
// Define the transformed output type (after zod transforms)
export type PetFormOutput = z.output<typeof petFormSchema>;

interface PetFormProps {
  clientId: string;
  defaultValues?: Partial<PetFormValues>;
  onSubmit: (data: PetFormOutput) => void;
  isSubmitting?: boolean;
}

const PetForm = ({ clientId, defaultValues, onSubmit, isSubmitting = false }: PetFormProps) => {
  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: "pies",
      breed: "",
      age: "",
      weight: "",
      sex: undefined,
      neutered: false,
      medicalHistory: "",
      allergies: "",
      dietaryRestrictions: "",
      behavioralNotes: "",
      ...defaultValues,
    },
  });

  // Pass form data through the schema's transform to convert string values to numbers
  const handleSubmit = (values: PetFormValues) => {
    const result = petFormSchema.safeParse(values);
    if (result.success) {
      onSubmit(result.data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię zwierzaka*</FormLabel>
              <FormControl>
                <Input placeholder="Azor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gatunek*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz gatunek" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pies">Pies</SelectItem>
                    <SelectItem value="kot">Kot</SelectItem>
                    <SelectItem value="królik">Królik</SelectItem>
                    <SelectItem value="chomik">Chomik</SelectItem>
                    <SelectItem value="świnka morska">Świnka morska</SelectItem>
                    <SelectItem value="inne">Inne</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rasa</FormLabel>
                <FormControl>
                  <Input placeholder="np. Labrador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wiek (lata)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    inputMode="decimal"
                    min="0" 
                    step="1" 
                    placeholder="np. 3" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waga (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    inputMode="decimal"
                    min="0" 
                    step="0.1" 
                    placeholder="np. 15" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Płeć</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="samiec" id="samiec" />
                    <Label htmlFor="samiec">Samiec</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="samica" id="samica" />
                    <Label htmlFor="samica">Samica</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neutered"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Sterylizowany/kastrowany
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medicalHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Historia medyczna</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Wcześniejsze choroby, zabiegi, operacje..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergie</FormLabel>
              <FormControl>
                <Textarea placeholder="Znane alergie..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ograniczenia dietetyczne</FormLabel>
              <FormControl>
                <Textarea placeholder="Specjalna dieta, ograniczenia żywieniowe..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="behavioralNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uwagi dotyczące zachowania</FormLabel>
              <FormControl>
                <Textarea placeholder="Informacje o zachowaniu zwierzaka..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz dane zwierzaka"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PetForm;
