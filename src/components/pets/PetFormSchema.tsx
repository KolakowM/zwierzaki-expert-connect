
import * as z from "zod";

// Define species and sex as enum for consistent typing
export const PET_SPECIES = ["pies", "kot", "gryzoń", "ptak", "gad", "płaz", "koń", "inne"] as const;
export const PET_SEX = ["samiec", "samica"] as const;

export type PetSpecies = typeof PET_SPECIES[number];
export type PetSex = typeof PET_SEX[number];

// Define the schema for pet validation
export const petFormSchema = z.object({
  name: z.string().min(2, "Imię musi zawierać conajmnie 2 znaki"),
  species: z.enum(PET_SPECIES),
  breed: z.string().min(1, "Rasa jest wymagana"),
  // Improve age handling - require as a number
  age: z.union([
    z.string().trim().min(1, "Wiek jest wymagany").transform(val => Number(val)),
    z.number()
  ])
  .refine(
    (val) => !isNaN(val),
    { message: "Wiek musi być liczbą" }
  ),
  // Improve weight handling - require as a number
  weight: z.union([
    z.string().trim().min(1, "Waga jest wymagana").transform(val => Number(val)),
    z.number()
  ])
  .refine(
    (val) => !isNaN(val),
    { message: "Waga musi być liczbą" }
  ),
  sex: z.enum(PET_SEX, {
    required_error: "Płeć jest wymagana"
  }),
  neutered: z.boolean().optional(),
  hasMicrochip: z.boolean().default(false),
  microchipNumber: z.string().max(15, "Numer mikrochipa może mieć maksymalnie 15 znaków")
    .optional()
    .refine(
      val => val === undefined || val === "" || /^[0-9]+$/.test(val),
      { message: "Numer mikrochipa powinien zawierać tylko cyfry" }
    ),
  vaccinationDescription: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  behavioralNotes: z.string().optional(),
});

// Define the actual form values type (before transformation)
export type PetFormValues = z.input<typeof petFormSchema>;
// Define the transformed output type (after zod transforms)
export type PetFormOutput = z.output<typeof petFormSchema>;
