
  -- 1) Usuń duplikaty w user_subscriptions – zostaw najnowszy wpis na użytkownika
  WITH ranked AS (
    SELECT
      id,
      user_id,
      created_at,
      ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
    FROM public.user_subscriptions
  )
  DELETE FROM public.user_subscriptions us
  USING ranked r
  WHERE us.id = r.id
    AND r.rn > 1;

  -- 2) Dodaj unikalny constraint na user_id dla user_subscriptions
  ALTER TABLE public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_user_id_unique UNIQUE (user_id);
  