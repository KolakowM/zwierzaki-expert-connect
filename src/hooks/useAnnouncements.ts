
import { useState, useCallback } from "react";

export function useAnnouncements() {
  const [announcement, setAnnouncement] = useState<string>("");

  const announce = useCallback((message: string, level: "polite" | "assertive" = "polite") => {
    // Clear previous announcement
    setAnnouncement("");
    
    // Set new announcement after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);

    // Clear announcement after it's been read
    setTimeout(() => {
      setAnnouncement("");
    }, 3000);
  }, []);

  return { announcement, announce };
}
