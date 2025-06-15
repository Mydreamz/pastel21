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
      comments: {
        Row: {
          content_id: string | null
          created_at: string
          id: string
          is_deleted: boolean
          text: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          id?: string
          is_deleted?: boolean
          text: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string
          id?: string
          is_deleted?: boolean
          text?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
        ]
      }
      content_views: {
        Row: {
          content_id: string | null
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_views_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          category: string | null
          content: string | null
          content_type: string
          created_at: string
          creator_id: string | null
          creator_name: string | null
          custom_tags_data: Json | null
          expiry: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_deleted: boolean
          price: string
          scheduled_for: string | null
          scheduled_time: string | null
          status: string | null
          tags: string[] | null
          teaser: string
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          content_type: string
          created_at?: string
          creator_id?: string | null
          creator_name?: string | null
          custom_tags_data?: Json | null
          expiry?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          price: string
          scheduled_for?: string | null
          scheduled_time?: string | null
          status?: string | null
          tags?: string[] | null
          teaser: string
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          category?: string | null
          content?: string | null
          content_type?: string
          created_at?: string
          creator_id?: string | null
          creator_name?: string | null
          custom_tags_data?: Json | null
          expiry?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          price?: string
          scheduled_for?: string | null
          scheduled_time?: string | null
          status?: string | null
          tags?: string[] | null
          teaser?: string
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      platform_fees: {
        Row: {
          amount: string
          created_at: string | null
          id: string
          is_deleted: boolean | null
          transaction_id: string | null
        }
        Insert: {
          amount: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          transaction_id?: string | null
        }
        Update: {
          amount?: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_fees_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_balance: string | null
          bio: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          name: string | null
          total_earnings: string | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          available_balance?: string | null
          bio?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          total_earnings?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          available_balance?: string | null
          bio?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          total_earnings?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: string
          content_id: string | null
          creator_earnings: string | null
          creator_id: string | null
          id: string
          is_deleted: boolean
          platform_fee: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          amount: string
          content_id?: string | null
          creator_earnings?: string | null
          creator_id?: string | null
          id?: string
          is_deleted?: boolean
          platform_fee?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          amount?: string
          content_id?: string | null
          creator_earnings?: string | null
          creator_id?: string | null
          id?: string
          is_deleted?: boolean
          platform_fee?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_details: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string
          id: string
          ifsc_code: string | null
          is_verified: boolean | null
          pan_name: string | null
          pan_number: string | null
          phone_number: string | null
          updated_at: string
          upi_id: string | null
          user_id: string
          verification_date: string | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          is_verified?: boolean | null
          pan_name?: string | null
          pan_number?: string | null
          phone_number?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id: string
          verification_date?: string | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          is_verified?: boolean | null
          pan_name?: string | null
          pan_number?: string | null
          phone_number?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          verification_date?: string | null
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          amount: number
          bank_name: string | null
          created_at: string
          id: string
          ifsc_code: string | null
          pan_name: string
          pan_number: string
          payment_method: string
          phone_number: string
          status: string
          updated_at: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          amount: number
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          pan_name: string
          pan_number: string
          payment_method: string
          phone_number: string
          status?: string
          updated_at?: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          amount?: number
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          pan_name?: string
          pan_number?: string
          payment_method?: string
          phone_number?: string
          status?: string
          updated_at?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_pending_withdrawals: {
        Args: { user_id_param: string }
        Returns: number
      }
      get_protected_file_url: {
        Args: { content_id_param: string; file_path: string }
        Returns: string
      }
      has_purchased_content: {
        Args: { user_id_param: string; content_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
