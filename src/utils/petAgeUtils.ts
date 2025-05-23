
import { differenceInYears, differenceInMonths, parseISO, isValid } from 'date-fns';

export function getFormattedPetAge(dateOfBirth: string | Date | null | undefined): string {
  if (!dateOfBirth) {
    return "Brak danych o wieku"; // Default text if date of birth is unavailable
  }

  const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;

  if (!isValid(dob)) {
    console.error("Nieprawidłowa data urodzenia przekazana do getFormattedPetAge:", dateOfBirth);
    return "Błąd wieku";
  }

  const now = new Date();
  const years = differenceInYears(now, dob);
  const totalMonths = differenceInMonths(now, dob);
  const monthsRemaining = totalMonths % 12;

  let displayString = '';

  if (years > 0) {
    displayString += `${years} ${years === 1 ? 'rok' : (years >= 2 && years <= 4 ? 'lata' : 'lat')}`;
    if (monthsRemaining > 0) {
      displayString += ` i ${monthsRemaining} ${monthsRemaining === 1 ? 'miesiąc' : (monthsRemaining >= 2 && monthsRemaining <= 4 ? 'miesiące' : 'miesięcy')}`;
    }
  } else if (totalMonths > 0) {
    displayString += `${totalMonths} ${totalMonths === 1 ? 'miesiąc' : (totalMonths >= 2 && totalMonths <= 4 ? 'miesiące' : 'miesięcy')}`;
  } else {
    displayString = 'Mniej niż miesiąc';
  }

  return displayString;
}
