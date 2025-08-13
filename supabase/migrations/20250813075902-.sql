-- Ensure upsert compatibility for subscriptions and subscribers
-- 1) Deduplicate and add unique index on user_subscriptions.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'ux_user_subscriptions_user_id'
  ) THEN
    -- Keep the newest record per user_id
    WITH ranked AS (
      SELECT id, user_id, created_at,
             row_number() OVER (PARTITION BY user_id ORDER BY created_at DESC, id DESC) AS rn
      FROM public.user_subscriptions
    )
    DELETE FROM public.user_subscriptions us
    USING ranked r
    WHERE us.id = r.id AND r.rn > 1;

    CREATE UNIQUE INDEX ux_user_subscriptions_user_id 
      ON public.user_subscriptions(user_id);
  END IF;
END $$;

-- 2) Deduplicate and add unique index on subscribers.email (for safe upserts)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'ux_subscribers_email'
  ) THEN
    -- Keep the most recently updated record per email
    WITH ranked AS (
      SELECT id, email, updated_at,
             row_number() OVER (PARTITION BY email ORDER BY updated_at DESC, id DESC) AS rn
      FROM public.subscribers
    )
    DELETE FROM public.subscribers s
    USING ranked r
    WHERE s.id = r.id AND r.rn > 1;

    CREATE UNIQUE INDEX ux_subscribers_email 
      ON public.subscribers(email);
  END IF;
END $$;