
-- Add column to store applicable Stripe price IDs for each coupon
ALTER TABLE public.coupons 
ADD COLUMN applicable_stripe_price_ids TEXT[];

-- Add a comment to explain the column
COMMENT ON COLUMN public.coupons.applicable_stripe_price_ids IS 'Array of Stripe price IDs that this coupon can be applied to. If NULL or empty, coupon applies to all products.';
