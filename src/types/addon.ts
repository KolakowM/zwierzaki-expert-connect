
export interface Addon {
  id: string;
  name: string;
  description: string | null;
  addon_type: 'clients' | 'pets';
  limit_increase: number;
  price_pln: number;
  stripe_price_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAddon {
  id: string;
  user_id: string;
  addon_id: string;
  quantity: number;
  purchase_date: string;
  status: 'active' | 'expired' | 'cancelled';
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
  addon?: Addon;
}

export interface AddonAudit {
  id: string;
  user_id: string;
  addon_id: string;
  action: string;
  quantity_before: number | null;
  quantity_after: number | null;
  created_at: string;
  created_by: string | null;
}

export interface EffectiveLimits {
  max_clients: number;
  max_pets: number;
  max_services: number;
  max_specializations: number;
  can_access_carousel: boolean;
  can_appear_in_catalog: boolean;
}
