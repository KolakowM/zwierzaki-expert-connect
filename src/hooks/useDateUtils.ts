
import { isSameDay, parseISO, isValid } from "date-fns";

export const useDateUtils = () => {
  /**
   * Safely converts various date formats to Date object
   */
  const safeParseDate = (dateInput: Date | string | null | undefined): Date | null => {
    if (!dateInput) return null;
    
    try {
      if (dateInput instanceof Date) {
        return isValid(dateInput) ? dateInput : null;
      }
      
      if (typeof dateInput === 'string') {
        const parsed = parseISO(dateInput);
        return isValid(parsed) ? parsed : null;
      }
      
      return null;
    } catch (error) {
      console.warn('Error parsing date:', dateInput, error);
      return null;
    }
  };

  /**
   * Safely compares two dates for same day
   */
  const isSameDaySafe = (date1: Date | string | null | undefined, date2: Date | string | null | undefined): boolean => {
    const parsedDate1 = safeParseDate(date1);
    const parsedDate2 = safeParseDate(date2);
    
    if (!parsedDate1 || !parsedDate2) return false;
    
    try {
      return isSameDay(parsedDate1, parsedDate2);
    } catch (error) {
      console.warn('Error comparing dates:', date1, date2, error);
      return false;
    }
  };

  /**
   * Formats date safely with fallback
   */
  const formatDateSafe = (dateInput: Date | string | null | undefined, fallback = "Nieprawidłowa data"): string => {
    const parsed = safeParseDate(dateInput);
    if (!parsed) return fallback;
    
    try {
      return parsed.toLocaleDateString('pl-PL');
    } catch (error) {
      console.warn('Error formatting date:', dateInput, error);
      return fallback;
    }
  };

  return {
    safeParseDate,
    isSameDaySafe,
    formatDateSafe
  };
};
