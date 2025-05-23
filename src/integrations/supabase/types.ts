export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
