import * as z from "zod";
import { isValid, parseISO } from "date-fns";

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
  
  // Replace age field with dateOfBirth
  dateOfBirth: z.preprocess(
    (val) => {
      // Handle empty strings
      if (typeof val === 'string' && val.trim() === '') return undefined;
      // Parse date from YYYY-MM-DD format (from input type="date")
      const parsedDate = typeof val === 'string' ? parseISO(val) : val;
      // Return valid date or undefined
      return isValid(parsedDate) ? parsedDate : undefined;
    },
    z.date({
      required_error: "Data urodzenia jest wymagana",
      invalid_type_error: "Nieprawidłowa data urodzenia",
    }).optional()
  ),
  
  // Keep weight as string for form input, but validate and transform to number
  weight: z.string().trim().min(1, "Waga jest wymagana").transform(val => {
    const numVal = Number(val.replace(',', '.'));
    if (isNaN(numVal)) {
      throw new Error("Waga musi być liczbą");
    }
    return numVal;
  }),
  
  sex: z.enum(PET_SEX, {
    required_error: "Płeć jest wymagana"
  }),
  neutered: z.boolean().optional(),
  
  // Add neuteringDate field
  neuteringDate: z.preprocess(
    (val) => {
      // Handle empty strings
      if (typeof val === 'string' && val.trim() === '') return undefined;
      // Parse date from YYYY-MM-DD format (from input type="date")
      const parsedDate = typeof val === 'string' ? parseISO(val) : val;
      // Return valid date or undefined
      return isValid(parsedDate) ? parsedDate : undefined;
    },
    z.date({
      invalid_type_error: "Nieprawidłowa data sterylizacji",
    }).optional()
  ),
  
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
})
.refine(
  (data) => {
    // Conditional validation: if neutered is true, neuteringDate must be provided
    if (data.neutered === true) {
      return data.neuteringDate !== undefined && data.neuteringDate !== null;
    }
    // Otherwise validation passes
    return true;
  },
  {
    message: "Data sterylizacji jest wymagana, jeśli zwierzę jest sterylizowane.",
    path: ["neuteringDate"], // Point the error to the neuteringDate field
  }
);

// Define the actual form values type (before transformation)
export type PetFormValues = z.input<typeof petFormSchema>;
// Define the transformed output type (after zod transforms)
export type PetFormOutput = z.output<typeof petFormSchema>;

// Keep the old exports for backward compatibility
export { petFormSchema as PetFormSchema };
