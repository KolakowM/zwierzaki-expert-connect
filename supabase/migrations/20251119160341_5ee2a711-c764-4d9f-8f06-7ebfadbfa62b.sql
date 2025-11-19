-- Usuń stary constraint (package_id, billing_period) - nie pozwala na historię
ALTER TABLE package_stripe_prices 
DROP CONSTRAINT IF EXISTS package_stripe_prices_package_id_billing_period_key;

-- Dodaj nowy constraint: unique tylko dla aktywnych rekordów
-- To pozwoli mieć wiele nieaktywnych rekordów (historia) ale tylko jeden aktywny
CREATE UNIQUE INDEX package_stripe_prices_active_unique 
ON package_stripe_prices (package_id, billing_period) 
WHERE is_active = true;

-- Teraz dezaktywuj stare Price IDs
UPDATE package_stripe_prices
SET 
  is_active = false,
  updated_at = now()
WHERE package_id IN (
  '4bd91835-0751-4790-9b5c-ca9c2f521314',
  '3d73a98e-9d72-47f6-b7c4-88167300b66c'
)
AND is_active = true;

-- Dodaj NOWE Price IDs (9,99 zł i 19,99 zł)
INSERT INTO package_stripe_prices (
  package_id,
  stripe_price_id,
  billing_period,
  is_active
) VALUES 
(
  '4bd91835-0751-4790-9b5c-ca9c2f521314',
  'price_1SVDeMH74CzZDu9dgCDGh6DQ',
  'monthly',
  true
),
(
  '3d73a98e-9d72-47f6-b7c4-88167300b66c',
  'price_1SVDelH74CzZDu9dmJ5euJWw',
  'monthly',
  true
);

-- Aktualizuj ceny w tabeli packages
UPDATE packages
SET 
  price_pln = 9.99,
  updated_at = now()
WHERE id = '4bd91835-0751-4790-9b5c-ca9c2f521314';

UPDATE packages
SET 
  price_pln = 19.99,
  updated_at = now()
WHERE id = '3d73a98e-9d72-47f6-b7c4-88167300b66c';