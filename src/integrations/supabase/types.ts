export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addon_audit: {
        Row: {
          action: string
          addon_id: string
          created_at: string
          created_by: string | null
          id: string
          quantity_after: number | null
          quantity_before: number | null
          user_id: string
        }
        Insert: {
          action: string
          addon_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          quantity_after?: number | null
          quantity_before?: number | null
          user_id: string
        }
        Update: {
          action?: string
          addon_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          quantity_after?: number | null
          quantity_before?: number | null
          user_id?: string
        }
        Relationships: []
      }
      addons: {
        Row: {
          addon_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          limit_increase: number
          name: string
          price_pln: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          addon_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          limit_increase?: number
          name: string
          price_pln?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          addon_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          limit_increase?: number
          name?: string
          price_pln?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      care_programs: {
        Row: {
          createdat: string
          description: string | null
          enddate: string | null
          goal: string
          id: string
          instructions: string | null
          name: string
          petid: string
          recommendations: string | null
          startdate: string
          status: string
        }
        Insert: {
          createdat?: string
          description?: string | null
          enddate?: string | null
          goal: string
          id?: string
          instructions?: string | null
          name: string
          petid: string
          recommendations?: string | null
          startdate: string
          status: string
        }
        Update: {
          createdat?: string
          description?: string | null
          enddate?: string | null
          goal?: string
          id?: string
          instructions?: string | null
          name?: string
          petid?: string
          recommendations?: string | null
          startdate?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_programs_petid_fkey"
            columns: ["petid"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          createdat: string
          email: string
          firstname: string
          id: string
          lastname: string
          notes: string | null
          phone: string | null
          postcode: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          createdat?: string
          email: string
          firstname: string
          id?: string
          lastname: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          createdat?: string
          email?: string
          firstname?: string
          id?: string
          lastname?: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          id: string
          stripe_session_id: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          stripe_session_id?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          stripe_session_id?: string | null
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_usage: number | null
          stripe_coupon_id: string | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_usage?: number | null
          stripe_coupon_id?: string | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_usage?: number | null
          stripe_coupon_id?: string | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      package_stripe_prices: {
        Row: {
          billing_period: string
          created_at: string
          id: string
          is_active: boolean
          package_id: string
          stripe_price_id: string
          updated_at: string
        }
        Insert: {
          billing_period: string
          created_at?: string
          id?: string
          is_active?: boolean
          package_id: string
          stripe_price_id: string
          updated_at?: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          id?: string
          is_active?: boolean
          package_id?: string
          stripe_price_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_stripe_prices_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          can_access_carousel: boolean
          can_appear_in_catalog: boolean
          created_at: string
          description: string | null
          id: string
          interval_count: number | null
          interval_unit: string | null
          is_active: boolean
          max_clients: number
          max_pets: number
          max_services: number
          max_specializations: number
          name: string
          price_pln: number | null
          updated_at: string
        }
        Insert: {
          can_access_carousel?: boolean
          can_appear_in_catalog?: boolean
          created_at?: string
          description?: string | null
          id?: string
          interval_count?: number | null
          interval_unit?: string | null
          is_active?: boolean
          max_clients: number
          max_pets: number
          max_services: number
          max_specializations: number
          name: string
          price_pln?: number | null
          updated_at?: string
        }
        Update: {
          can_access_carousel?: boolean
          can_appear_in_catalog?: boolean
          created_at?: string
          description?: string | null
          id?: string
          interval_count?: number | null
          interval_unit?: string | null
          is_active?: boolean
          max_clients?: number
          max_pets?: number
          max_services?: number
          max_specializations?: number
          name?: string
          price_pln?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_logs: {
        Row: {
          amount_cents: number | null
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          package_id: string | null
          status: string
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          package_id?: string | null
          status: string
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          package_id?: string | null
          status?: string
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_note_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          note_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          note_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          note_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_note_attachments_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "pet_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          pet_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          pet_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          pet_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_notes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number | null
          allergies: string | null
          behavioralnotes: string | null
          breed: string | null
          clientid: string
          createdat: string
          date_of_birth: string | null
          dietaryrestrictions: string | null
          has_microchip: boolean
          id: string
          medicalhistory: string | null
          microchip_number: string | null
          name: string
          neutered: boolean | null
          neutering_date: string | null
          sex: string | null
          species: string
          vaccination_description: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string | null
          behavioralnotes?: string | null
          breed?: string | null
          clientid: string
          createdat?: string
          date_of_birth?: string | null
          dietaryrestrictions?: string | null
          has_microchip?: boolean
          id?: string
          medicalhistory?: string | null
          microchip_number?: string | null
          name: string
          neutered?: boolean | null
          neutering_date?: string | null
          sex?: string | null
          species: string
          vaccination_description?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string | null
          behavioralnotes?: string | null
          breed?: string | null
          clientid?: string
          createdat?: string
          date_of_birth?: string | null
          dietaryrestrictions?: string | null
          has_microchip?: boolean
          id?: string
          medicalhistory?: string | null
          microchip_number?: string | null
          name?: string
          neutered?: boolean | null
          neutering_date?: string | null
          sex?: string | null
          species?: string
          vaccination_description?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_clientid_fkey"
            columns: ["clientid"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      specialist_profiles: {
        Row: {
          description: string | null
          education: string[] | null
          email: string | null
          experience: string | null
          id: string
          location: string | null
          phone_number: string | null
          photo_url: string | null
          services: string[] | null
          social_media: Json | null
          specializations: string[] | null
          title: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          description?: string | null
          education?: string[] | null
          email?: string | null
          experience?: string | null
          id: string
          location?: string | null
          phone_number?: string | null
          photo_url?: string | null
          services?: string[] | null
          social_media?: Json | null
          specializations?: string[] | null
          title?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          description?: string | null
          education?: string[] | null
          email?: string | null
          experience?: string | null
          id?: string
          location?: string | null
          phone_number?: string | null
          photo_url?: string | null
          services?: string[] | null
          social_media?: Json | null
          specializations?: string[] | null
          title?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      specialist_specializations: {
        Row: {
          active: Database["public"]["Enums"]["specialist_specializations_inactive"]
          created_at: string
          id: string
          specialist_id: string
          specialization_id: string
        }
        Insert: {
          active?: Database["public"]["Enums"]["specialist_specializations_inactive"]
          created_at?: string
          id?: string
          specialist_id: string
          specialization_id: string
        }
        Update: {
          active?: Database["public"]["Enums"]["specialist_specializations_inactive"]
          created_at?: string
          id?: string
          specialist_id?: string
          specialization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialist_specializations_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specialist_specializations_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      specializations: {
        Row: {
          active: Database["public"]["Enums"]["specializations_inactive"]
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: Database["public"]["Enums"]["specializations_inactive"]
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: Database["public"]["Enums"]["specializations_inactive"]
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_audit: {
        Row: {
          action: string
          created_at: string | null
          created_by: string | null
          id: string
          metadata: Json | null
          new_package_id: string | null
          old_package_id: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          new_package_id?: string | null
          old_package_id?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          new_package_id?: string | null
          old_package_id?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_audit_new_package_id_fkey"
            columns: ["new_package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_audit_old_package_id_fkey"
            columns: ["old_package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_audit_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addons: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          purchase_date: string
          quantity: number
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          purchase_date?: string
          quantity?: number
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          purchase_date?: string
          quantity?: number
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          city: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          package_id: string
          payment_id: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          package_id: string
          payment_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          package_id?: string
          payment_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_subscriptions_package_id"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          clientid: string
          date: string
          followupdate: string | null
          followupneeded: boolean | null
          id: string
          notes: string | null
          petid: string
          recommendations: string | null
          status: string | null
          time: string | null
          type: string
        }
        Insert: {
          clientid: string
          date: string
          followupdate?: string | null
          followupneeded?: boolean | null
          id?: string
          notes?: string | null
          petid: string
          recommendations?: string | null
          status?: string | null
          time?: string | null
          type: string
        }
        Update: {
          clientid?: string
          date?: string
          followupdate?: string | null
          followupneeded?: boolean | null
          id?: string
          notes?: string | null
          petid?: string
          recommendations?: string | null
          status?: string | null
          time?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_clientid_fkey"
            columns: ["clientid"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_petid_fkey"
            columns: ["petid"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_unassigned_clients_to_user: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      check_package_limits: {
        Args:
          | { p_user_id: string; p_action_type: string }
          | { p_user_id: string; p_action_type: string; p_soft_check?: boolean }
        Returns: {
          can_perform_action: boolean
          current_count: number
          max_allowed: number
          package_name: string
          usage_percentage: number
          is_at_soft_limit: boolean
          error_message: string
        }[]
      }
      get_catalog_data: {
        Args: {
          p_search_term?: string
          p_location?: string
          p_specializations?: string[]
          p_roles?: Database["public"]["Enums"]["app_role"][]
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          id: string
          name: string
          title: string
          specializations: string[]
          location: string
          image: string
          email: string
          rating: number
          verified: boolean
          role: Database["public"]["Enums"]["app_role"]
          total_count: number
        }[]
      }
      get_catalog_specialists: {
        Args: {
          p_search_term?: string
          p_location?: string
          p_specializations?: string[]
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          id: string
          name: string
          title: string
          specializations: string[]
          location: string
          image: string
          email: string
          rating: number
          verified: boolean
          role: Database["public"]["Enums"]["app_role"]
          is_featured: boolean
          total_count: number
        }[]
      }
      get_user_active_subscription: {
        Args: { p_user_id: string }
        Returns: {
          subscription_id: string
          package_id: string
          package_name: string
          status: string
          max_clients: number
          max_pets: number
          max_services: number
          max_specializations: number
          can_access_carousel: boolean
          can_appear_in_catalog: boolean
          end_date: string
        }[]
      }
      get_user_effective_limits: {
        Args: { p_user_id: string }
        Returns: {
          max_clients: number
          max_pets: number
          max_services: number
          max_specializations: number
          can_access_carousel: boolean
          can_appear_in_catalog: boolean
        }[]
      }
      get_user_usage_stats: {
        Args: { p_user_id: string }
        Returns: {
          clients_count: number
          pets_count: number
          services_count: number
          specializations_count: number
          active_visits_count: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      initialize_missing_specialist_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      initialize_specialist_specializations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "specialist"
      app_status_user: "active"
      specialist_specializations_inactive: "yes" | "no"
      specializations_inactive: "yes" | "no"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "specialist"],
      app_status_user: ["active"],
      specialist_specializations_inactive: ["yes", "no"],
      specializations_inactive: ["yes", "no"],
    },
  },
} as const
