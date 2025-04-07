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
        }
        Relationships: []
      }
      pets: {
        Row: {
          age: number | null
          allergies: string | null
          behavioralnotes: string | null
          breed: string | null
          clientid: string
          createdat: string
          dietaryrestrictions: string | null
          id: string
          medicalhistory: string | null
          name: string
          neutered: boolean | null
          sex: string | null
          species: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string | null
          behavioralnotes?: string | null
          breed?: string | null
          clientid: string
          createdat?: string
          dietaryrestrictions?: string | null
          id?: string
          medicalhistory?: string | null
          name: string
          neutered?: boolean | null
          sex?: string | null
          species: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string | null
          behavioralnotes?: string | null
          breed?: string | null
          clientid?: string
          createdat?: string
          dietaryrestrictions?: string | null
          id?: string
          medicalhistory?: string | null
          name?: string
          neutered?: boolean | null
          sex?: string | null
          species?: string
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
