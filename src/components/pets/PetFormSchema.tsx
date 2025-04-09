
import * as z from "zod";

// Define species and sex as enum for consistent typing
export const PET_SPECIES = ["pies", "kot", "królik", "chomik", "świnka morska", "inne"] as const;
export const PET_SEX = ["samiec", "samica"] as const;

export type PetSpecies = typeof PET_SPECIES[number];
export type PetSex = typeof PET_SEX[number];

// Define the schema for pet validation
export const petFormSchema = z.object({
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
