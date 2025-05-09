
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
  // Improve age handling - parse as a number and allow empty string
  age: z.union([
    z.string().trim().transform(val => val === "" ? undefined : Number(val)),
    z.number().optional(),
    z.undefined()
  ])
  .refine(
    (val) => val === undefined || (typeof val === "number" && !isNaN(val)),
    { message: "Wiek musi być liczbą" }
  ),
  // Improve weight handling - parse as a number and allow empty string
  weight: z.union([
    z.string().trim().transform(val => val === "" ? undefined : Number(val)),
    z.number().optional(),
    z.undefined()
  ])
  .refine(
    (val) => val === undefined || (typeof val === "number" && !isNaN(val)),
    { message: "Waga musi być liczbą" }
  ),
  sex: z.enum(PET_SEX).optional(),
  neutered: z.boolean().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  behavioralNotes: z.string().optional(),
  // New fields for vaccination and microchip
  vaccinationDescription: z.string().optional(),
  hasMicrochip: z.boolean().default(false),
  microchipNumber: z.union([
    z.string().trim()
      .refine(val => val === "" || /^\d*$/.test(val), {
        message: "Numer mikrochipa może zawierać tylko cyfry"
      })
      .refine(val => val === "" || val.length <= 15, {
        message: "Numer mikrochipa nie może przekraczać 15 znaków"
      })
      .transform(val => val === "" ? undefined : val),
    z.undefined()
  ])
});

// Define the actual form values type (before transformation)
export type PetFormValues = z.input<typeof petFormSchema>;
// Define the transformed output type (after zod transforms)
export type PetFormOutput = z.output<typeof petFormSchema>;
