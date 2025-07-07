
-- Create addons table
CREATE TABLE public.addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  addon_type TEXT NOT NULL CHECK (addon_type IN ('clients', 'pets')),
  limit_increase INTEGER NOT NULL DEFAULT 0,
  price_pln INTEGER NOT NULL DEFAULT 0, -- Price in groszy (Polish currency subunit)
  stripe_price_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_addons table
CREATE TABLE public.user_addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  addon_id UUID NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create addon_audit table for tracking changes
CREATE TABLE public.addon_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  addon_id UUID NOT NULL,
  action TEXT NOT NULL,
  quantity_before INTEGER,
  quantity_after INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID DEFAULT auth.uid()
);

-- Enable Row Level Security
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for addons
CREATE POLICY "Anyone can view active addons" ON public.addons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify addons" ON public.addons
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ));

-- RLS Policies for user_addons
CREATE POLICY "Users can view their own addons" ON public.user_addons
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own addons" ON public.user_addons
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own addons" ON public.user_addons
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own addons" ON public.user_addons
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for addon_audit
CREATE POLICY "Users can view their own addon audit" ON public.addon_audit
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all addon audit" ON public.addon_audit
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ));

-- Create function to get user effective limits (including addons)
CREATE OR REPLACE FUNCTION public.get_user_effective_limits(p_user_id UUID)
RETURNS TABLE(
  max_clients INTEGER,
  max_pets INTEGER,
  max_services INTEGER,
  max_specializations INTEGER,
  can_access_carousel BOOLEAN,
  can_appear_in_catalog BOOLEAN
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  v_subscription RECORD;
  v_client_addons INTEGER := 0;
  v_pet_addons INTEGER := 0;
BEGIN
  -- Get base limits from active subscription
  SELECT * INTO v_subscription 
  FROM get_user_active_subscription(p_user_id) 
  LIMIT 1;
  
  -- If no active subscription, use trial limits
  IF v_subscription.subscription_id IS NULL THEN
    -- Calculate addon bonuses
    SELECT COALESCE(SUM(ua.quantity * a.limit_increase), 0) INTO v_client_addons
    FROM user_addons ua
    JOIN addons a ON ua.addon_id = a.id
    WHERE ua.user_id = p_user_id 
      AND ua.status = 'active'
      AND a.addon_type = 'clients';
      
    SELECT COALESCE(SUM(ua.quantity * a.limit_increase), 0) INTO v_pet_addons
    FROM user_addons ua
    JOIN addons a ON ua.addon_id = a.id
    WHERE ua.user_id = p_user_id 
      AND ua.status = 'active'
      AND a.addon_type = 'pets';
    
    RETURN QUERY SELECT 
      (5 + v_client_addons)::INTEGER as max_clients,
      (10 + v_pet_addons)::INTEGER as max_pets,
      3::INTEGER as max_services,
      2::INTEGER as max_specializations,
      false as can_access_carousel,
      true as can_appear_in_catalog;
    RETURN;
  END IF;
  
  -- Calculate addon bonuses for active subscription
  SELECT COALESCE(SUM(ua.quantity * a.limit_increase), 0) INTO v_client_addons
  FROM user_addons ua
  JOIN addons a ON ua.addon_id = a.id
  WHERE ua.user_id = p_user_id 
    AND ua.status = 'active'
    AND a.addon_type = 'clients';
    
  SELECT COALESCE(SUM(ua.quantity * a.limit_increase), 0) INTO v_pet_addons
  FROM user_addons ua
  JOIN addons a ON ua.addon_id = a.id
  WHERE ua.user_id = p_user_id 
    AND ua.status = 'active'
    AND a.addon_type = 'pets';
  
  RETURN QUERY SELECT 
    (v_subscription.max_clients + v_client_addons)::INTEGER as max_clients,
    (v_subscription.max_pets + v_pet_addons)::INTEGER as max_pets,
    v_subscription.max_services,
    v_subscription.max_specializations,
    v_subscription.can_access_carousel,
    v_subscription.can_appear_in_catalog;
END;
$$;

-- Insert some sample addons
INSERT INTO public.addons (name, description, addon_type, limit_increase, price_pln) VALUES
('Dodatkowi Klienci - Pakiet 5', 'Zwiększ limit klientów o 5', 'clients', 5, 1500),
('Dodatkowi Klienci - Pakiet 10', 'Zwiększ limit klientów o 10', 'clients', 10, 2800),
('Dodatkowe Zwierzęta - Pakiet 10', 'Zwiększ limit zwierząt o 10', 'pets', 10, 1200),
('Dodatkowe Zwierzęta - Pakiet 25', 'Zwiększ limit zwierząt o 25', 'pets', 25, 2500);
