export interface Package {
  id: string;
  name: string;
  description?: string;
  price_pln?: number;
  max_clients: number;
  max_pets: number;
  max_services: number;
  max_specializations: number;
  can_access_carousel: boolean;
  can_appear_in_catalog: boolean;
}

export interface ActiveSubscription {
  id?: string;
  package_name?: string;
  subscription_id?: string;
  status?: string;
  end_date?: string;
  max_clients?: number;
  max_pets?: number;
  max_services?: number;
  max_specializations?: number;
  can_access_carousel?: boolean;
  can_appear_in_catalog?: boolean;
}

export interface ValidationResult {
  canUpgrade: boolean;
  issues: string[];
}