export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string
          phone?: string
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      lookbook_campaigns: {
        Row: {
          cover_image: string
          created_at: string
          description: string
          id: string
          published: boolean
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          cover_image?: string
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          slug: string
          sort_order?: number
          title: string
        }
        Update: {
          cover_image?: string
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      lookbook_images: {
        Row: {
          campaign_id: string
          caption: string
          id: string
          image_url: string
          product_id: string | null
          sort_order: number
        }
        Insert: {
          campaign_id: string
          caption?: string
          id?: string
          image_url: string
          product_id?: string | null
          sort_order?: number
        }
        Update: {
          campaign_id?: string
          caption?: string
          id?: string
          image_url?: string
          product_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "lookbook_images_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "lookbook_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lookbook_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      mtm_requests: {
        Row: {
          bust: string
          created_at: string
          email: string
          height: string
          hip: string
          id: string
          image_url: string | null
          length: string
          name: string
          notes: string
          phone: string
          product_id: string | null
          shoulder: string
          status: string
          waist: string
        }
        Insert: {
          bust?: string
          created_at?: string
          email: string
          height?: string
          hip?: string
          id?: string
          image_url?: string | null
          length?: string
          name: string
          notes?: string
          phone: string
          product_id?: string | null
          shoulder?: string
          status?: string
          waist?: string
        }
        Update: {
          bust?: string
          created_at?: string
          email?: string
          height?: string
          hip?: string
          id?: string
          image_url?: string | null
          length?: string
          name?: string
          notes?: string
          phone?: string
          product_id?: string | null
          shoulder?: string
          status?: string
          waist?: string
        }
        Relationships: [
          {
            foreignKeyName: "mtm_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          image_url: string | null
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          size: string
          unit_price: number
        }
        Insert: {
          id?: string
          image_url?: string | null
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          size: string
          unit_price: number
        }
        Update: {
          id?: string
          image_url?: string | null
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_line: string
          city: string
          courier_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_guest: boolean
          order_number: string
          phone: string
          pincode: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          shipping_fee: number
          state: string
          status: string
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_line: string
          city: string
          courier_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_guest?: boolean
          order_number: string
          phone: string
          pincode: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipping_fee?: number
          state: string
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_line?: string
          city?: string
          courier_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_guest?: boolean
          order_number?: string
          phone?: string
          pincode?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipping_fee?: number
          state?: string
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      popup_events: {
        Row: {
          address: string
          created_at: string
          description: string
          event_date: string
          id: string
          is_upcoming: boolean
          maps_url: string
          published: boolean
          title: string
          venue: string
        }
        Insert: {
          address?: string
          created_at?: string
          description?: string
          event_date: string
          id?: string
          is_upcoming?: boolean
          maps_url?: string
          published?: boolean
          title: string
          venue: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          is_upcoming?: boolean
          maps_url?: string
          published?: boolean
          title?: string
          venue?: string
        }
        Relationships: []
      }
      product_sizes: {
        Row: {
          id: string
          product_id: string
          size: string
          stock: number
        }
        Insert: {
          id?: string
          product_id: string
          size: string
          stock?: number
        }
        Update: {
          id?: string
          product_id?: string
          size?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          care_instructions: string
          category_id: string | null
          compare_at_price: number | null
          created_at: string
          description: string
          fabric_notes: string
          featured: boolean
          fit_notes: string
          id: string
          images: Json
          limited_edition: boolean
          name: string
          price: number
          published: boolean
          shipping_returns: string
          slug: string
        }
        Insert: {
          care_instructions?: string
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string
          fabric_notes?: string
          featured?: boolean
          fit_notes?: string
          id?: string
          images?: Json
          limited_edition?: boolean
          name: string
          price: number
          published?: boolean
          shipping_returns?: string
          slug: string
        }
        Update: {
          care_instructions?: string
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string
          fabric_notes?: string
          featured?: boolean
          fit_notes?: string
          id?: string
          images?: Json
          limited_edition?: boolean
          name?: string
          price?: number
          published?: boolean
          shipping_returns?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          phone?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          announcement: string
          free_shipping_threshold: number
          id: number
          shipping_fee: number
          updated_at: string
        }
        Insert: {
          announcement?: string
          free_shipping_threshold?: number
          id?: number
          shipping_fee?: number
          updated_at?: string
        }
        Update: {
          announcement?: string
          free_shipping_threshold?: number
          id?: number
          shipping_fee?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
    },
  },
} as const
