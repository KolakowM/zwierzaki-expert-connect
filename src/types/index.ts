// Export all types from separate files
export * from './client';
export * from './pet';
export * from './visit';
export * from './care-program';
export * from './tables';
export * from './addon';

// Define social media types for consistency
export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  twitch?: string;
}

export interface SpecialistProfile {
  id: string;
  title?: string;
  description?: string;
  specializations?: string[];
  services?: string[];
  education?: string[];
  experience?: string;
  location?: string;
  phone_number?: string;
  email?: string; // Added email field
  website?: string;
  photo_url?: string;
  social_media?: SocialMediaLinks;
  updated_at?: string;
}
