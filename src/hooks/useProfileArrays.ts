
import { useState, useEffect } from "react";

export function useProfileArrays() {
  const [services, setServices] = useState<string[]>([""]);
  const [education, setEducation] = useState<string[]>([""]);

  // Log state changes only when the arrays change
  useEffect(() => {
    console.log('useProfileArrays - current state:', {
      services,
      education
    });
  }, [services, education]);

  // Add a new service input field
  const addService = () => {
    console.log("Adding new service, current services:", services);
    setServices(prevServices => [...prevServices, ""]);
  };

  // Update a service at specific index
  const updateService = (index: number, value: string) => {
    console.log(`Updating service at index ${index} with value:`, value);
    setServices(prevServices => {
      const updated = [...prevServices];
      if (index >= updated.length) {
        // If index is out of bounds, add new entries
        while (updated.length <= index) {
          updated.push("");
        }
      }
      updated[index] = value;
      return updated;
    });
  };

  // Remove a service at specific index
  const removeService = (index: number) => {
    console.log(`Removing service at index ${index}`);
    setServices(prevServices => {
      const updated = [...prevServices];
      updated.splice(index, 1);
      // Always ensure at least one field
      if (updated.length === 0) {
        updated.push("");
      }
      return updated;
    });
  };

  // Add a new education input field
  const addEducation = () => {
    console.log("Adding new education, current education:", education);
    setEducation(prevEducation => [...prevEducation, ""]);
  };

  // Update education at specific index
  const updateEducation = (index: number, value: string) => {
    console.log(`Updating education at index ${index} with value:`, value);
    setEducation(prevEducation => {
      const updated = [...prevEducation];
      if (index >= updated.length) {
        // If index is out of bounds, add new entries
        while (updated.length <= index) {
          updated.push("");
        }
      }
      updated[index] = value;
      return updated;
    });
  };

  // Remove education at specific index
  const removeEducation = (index: number) => {
    console.log(`Removing education at index ${index}`);
    setEducation(prevEducation => {
      const updated = [...prevEducation];
      updated.splice(index, 1);
      // Always ensure at least one field
      if (updated.length === 0) {
        updated.push("");
      }
      return updated;
    });
  };

  return {
    services,
    education,
    setServices,
    setEducation,
    addService,
    updateService,
    removeService,
    addEducation,
    updateEducation,
    removeEducation
  };
}
