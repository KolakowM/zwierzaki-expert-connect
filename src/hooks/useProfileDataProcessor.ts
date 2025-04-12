
export function useProfileDataProcessor() {
  // Process form data for saving to database
  const processFormData = (formData: any, userId: string | undefined, photoUrl: string | null = null) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    console.log("Processing form data:", formData);
    
    // Filter out empty strings from services and education
    const cleanedServices = Array.isArray(formData.services) 
      ? formData.services.filter((service: string) => service.trim() !== "")
      : [];
      
    const cleanedEducation = Array.isArray(formData.education)
      ? formData.education.filter((edu: string) => edu.trim() !== "")
      : [];
    
    // Filter out empty social media links
    const socialMedia: Record<string, string> = {};
    if (formData.socialMedia) {
      Object.entries(formData.socialMedia).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim() !== '') {
          socialMedia[key] = value.trim();
        }
      });
    }
    
    // Create the payload without specializations (they're now in the junction table)
    return {
      id: userId,
      title: formData.title,
      description: formData.description,
      services: cleanedServices,
      education: cleanedEducation,
      experience: formData.experience,
      location: formData.location,
      phone_number: formData.phoneNumber,
      website: formData.website,
      social_media: socialMedia,
      photo_url: photoUrl,
      updated_at: new Date().toISOString()
    };
  };

  return {
    processFormData
  };
}
