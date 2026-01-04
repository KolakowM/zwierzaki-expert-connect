-- 1. Zmiana statusu roli na "zweryfikowany" dla obu użytkowników
UPDATE user_roles 
SET status = 'zweryfikowany' 
WHERE user_id IN (
  '944d8152-8dbc-4b7d-ba00-e3e8584caf2c',
  'a2abcccc-828f-4f4f-be72-651c35351017'
);

-- 2. Aktywacja subskrypcji dla admin@petsflow.pl
UPDATE user_subscriptions 
SET status = 'active' 
WHERE user_id = '944d8152-8dbc-4b7d-ba00-e3e8584caf2c';

-- 3. Aktualizacja profilu specialist_profiles dla admin@petsflow.pl
UPDATE specialist_profiles SET
  title = 'Behawiorysta i Trener Psów',
  location = 'Warszawa',
  description = 'Certyfikowany behawiorysta z 8-letnim doświadczeniem w pracy z psami problematycznymi. Specjalizuję się w korygowaniu zachowań lękowych i agresywnych. Absolwent Akademii Kynologicznej w Warszawie.',
  experience = '8 lat praktyki w behawiorystyce i treningu psów',
  phone_number = '+48 500 123 456',
  email = 'kontakt@petsflow.pl',
  website = 'https://petsflow.pl',
  services = ARRAY['Konsultacja behawioralna', 'Trening indywidualny', 'Socjalizacja szczeniąt', 'Praca z reaktywnymi psami'],
  education = ARRAY['Akademia Kynologiczna Warszawa 2016', 'Certyfikat COAPE 2018'],
  updated_at = now()
WHERE id = '944d8152-8dbc-4b7d-ba00-e3e8584caf2c';

-- 4. Aktualizacja profilu specialist_profiles dla amazonsklepp@gmail.com
UPDATE specialist_profiles SET
  title = 'Dietetyk i Fizjoterapeuta Zwierząt',
  location = 'Kraków',
  description = 'Specjalistka ds. żywienia i rehabilitacji zwierząt towarzyszących. Prowadzę kompleksowe plany żywieniowe i terapie ruchowe dla psów i kotów. Wieloletnie doświadczenie w pracy z pacjentami po urazach.',
  experience = '6 lat praktyki w dietetyce i fizjoterapii zwierząt',
  phone_number = '+48 600 789 012',
  email = 'anna.nowicka@example.pl',
  website = 'https://zwierzecadietetyka.pl',
  services = ARRAY['Konsultacja dietetyczna', 'Rehabilitacja pooperacyjna', 'Fizjoterapia', 'Masaż leczniczy'],
  education = ARRAY['SGGW Warszawa 2017', 'Kurs Fizjoterapii Zwierząt 2019'],
  updated_at = now()
WHERE id = 'a2abcccc-828f-4f4f-be72-651c35351017';

-- 5. Aktualizacja user_profiles dla amazonsklepp@gmail.com (zmiana imienia/nazwiska)
UPDATE user_profiles SET
  first_name = 'Anna',
  last_name = 'Nowicka',
  city = 'Kraków',
  updated_at = now()
WHERE id = 'a2abcccc-828f-4f4f-be72-651c35351017';

-- 6. Aktualizacja user_profiles dla admin@petsflow.pl
UPDATE user_profiles SET
  city = 'Warszawa',
  updated_at = now()
WHERE id = '944d8152-8dbc-4b7d-ba00-e3e8584caf2c';

-- 7. Usunięcie starych specjalizacji
DELETE FROM specialist_specializations 
WHERE specialist_id IN (
  '944d8152-8dbc-4b7d-ba00-e3e8584caf2c',
  'a2abcccc-828f-4f4f-be72-651c35351017'
);

-- 8. Dodanie specjalizacji dla admin@petsflow.pl (Behawiorysta + Trener psów)
INSERT INTO specialist_specializations (specialist_id, specialization_id, active) VALUES
  ('944d8152-8dbc-4b7d-ba00-e3e8584caf2c', 'eea0eb4e-7cd8-4341-97e8-4d0bb21dbff9', 'yes'),
  ('944d8152-8dbc-4b7d-ba00-e3e8584caf2c', '40409470-fd40-467d-b679-6102b985ab67', 'yes');

-- 9. Dodanie specjalizacji dla amazonsklepp@gmail.com (Dietetyk + Fizjoterapeuta)
INSERT INTO specialist_specializations (specialist_id, specialization_id, active) VALUES
  ('a2abcccc-828f-4f4f-be72-651c35351017', '49f7facb-be08-43be-a0b9-f927217044f1', 'yes'),
  ('a2abcccc-828f-4f4f-be72-651c35351017', '3451d571-76a7-4b4d-8488-86ec9e6a92eb', 'yes');