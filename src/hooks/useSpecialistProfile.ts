
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileFormValues, profileFormSchema } from "@/components/profile/SpecialistProfileTab";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialMediaLinks } from "@/types";

export const useSpecialistProfile = (initialProfileData: any = null) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(initialProfileData);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  // Create form with zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      title: "",
      description: "",
      specializations: [],
      services: [],
      education: [],
      experience: "",
      location: "",
      phoneNumber: "",
      email: "",
      website: "",
      socialMedia: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        twitch: ""
      }
    }
  });

  // Load existing profile data if available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      // If we already have profile data provided, use it
      if (initialProfileData) {
        populateFormWithProfileData(initialProfileData);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching specialist profile for user:', userId);
        
        // Get specialist profile
        const { data: profileData, error: profileError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileError) throw profileError;
        
        // Get user email from auth context instead of fetching from user_profiles
        const userEmail = user?.email || '';
          
        console.log('Profile data:', profileData);
        
        if (profileData) {
          populateFormWithProfileData(profileData, userEmail);
          setInitialData(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się załadować profilu",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, user?.email, form, toast, initialProfileData]);

  const populateFormWithProfileData = (profileData: any, userEmail?: string) => {
    // Initialize a default empty social media object
    const socialMediaDefault: SocialMediaLinks = {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
      twitch: ""
    };
    
    // Safely extract social media data with proper type checking
    let socialMedia: SocialMediaLinks = socialMediaDefault;
    
    if (profileData.social_media && typeof profileData.social_media === 'object' && !Array.isArray(profileData.social_media)) {
      const socialMediaObj = profileData.social_media as Record<string, unknown>;
      
      // Safely extract each property with type checking
      if (typeof socialMediaObj.facebook === 'string') socialMedia.facebook = socialMediaObj.facebook;
      if (typeof socialMediaObj.instagram === 'string') socialMedia.instagram = socialMediaObj.instagram;
      if (typeof socialMediaObj.twitter === 'string') socialMedia.twitter = socialMediaObj.twitter;
      if (typeof socialMediaObj.linkedin === 'string') socialMedia.linkedin = socialMediaObj.linkedin;
      if (typeof socialMediaObj.youtube === 'string') socialMedia.youtube = socialMediaObj.youtube;
      if (typeof socialMediaObj.tiktok === 'string') socialMedia.tiktok = socialMediaObj.tiktok;
      if (typeof socialMediaObj.twitch === 'string') socialMedia.twitch = socialMediaObj.twitch;
    }
    
    form.reset({
      title: profileData.title || "",
      description: profileData.description || "",
      specializations: profileData.specializations || [],
      services: profileData.services || [],
      education: profileData.education || [],
      experience: profileData.experience || "",
      location: profileData.location || "",
      phoneNumber: profileData.phone_number || "",
      email: userEmail || profileData.email || "",
      website: profileData.website || "",
      socialMedia: socialMedia
    });
  };

  return {
    form,
    loading,
    initialData,
    saveError,
    saveSuccess,
    setSaveError,
    setSaveSuccess,
    userId
  };
};
