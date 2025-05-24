
export interface Package {
  id: string;
  name: string;
  description: string | null;
  price_pln: number | null;
  interval_count: number | null;
  interval_unit: string | null;
  max_clients: number;
  max_pets: number;
  max_services: number;
  max_specializations: number;
  can_access_carousel: boolean;
  can_appear_in_catalog: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  package_id: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActiveSubscription {
  subscription_id: string;
  package_id: string;
  package_name: string;
  max_clients: number;
  max_pets: number;
  max_services: number;
  max_specializations: number;
  can_access_carousel: boolean;
  can_appear_in_catalog: boolean;
  end_date: string | null;
}

export interface PackageLimits {
  can_perform_action: boolean;
  current_count: number;
  max_allowed: number;
  package_name: string;
}

export interface UsageStats {
  clients_count: number;
  pets_count: number;
  services_count: number;
  specializations_count: number;
  active_visits_count: number;
}

export type ActionType = 'clients' | 'pets' | 'services' | 'specializations';
