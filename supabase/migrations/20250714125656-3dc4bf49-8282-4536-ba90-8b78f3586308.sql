
-- Remove coupon-related tables
DROP TABLE IF EXISTS public.coupon_usage CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;

-- Remove applicable_stripe_price_ids column that was added for coupon restrictions
-- Note: This column might not exist if it was added specifically for coupons
-- The ALTER TABLE will fail silently if column doesn't exist due to IF EXISTS
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'packages' 
        AND column_name = 'applicable_stripe_price_ids'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.packages DROP COLUMN applicable_stripe_price_ids;
    END IF;
END $$;
