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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          persona_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          persona_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          persona_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      approval_workflows: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          created_at: string
          feedback: string | null
          id: string
          post_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          post_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          post_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_workflows_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "editorial_calendar"
            referencedColumns: ["id"]
          },
        ]
      }
      content_performance: {
        Row: {
          calendar_id: string | null
          clicks: number | null
          comments: number | null
          content_id: string | null
          conversion_rate: number | null
          created_at: string
          engagement_rate: number | null
          id: string
          likes: number | null
          measured_at: string
          notes: string | null
          platform: string
          reach: number | null
          shares: number | null
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          calendar_id?: string | null
          clicks?: number | null
          comments?: number | null
          content_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          measured_at?: string
          notes?: string | null
          platform: string
          reach?: number | null
          shares?: number | null
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          calendar_id?: string | null
          clicks?: number | null
          comments?: number | null
          content_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          measured_at?: string
          notes?: string | null
          platform?: string
          reach?: number | null
          shares?: number | null
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_performance_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "editorial_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_performance_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "generated_content"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_calendar: {
        Row: {
          content: string
          content_type: string
          created_at: string
          generated_by_ai: boolean | null
          id: string
          notes: string | null
          platform: string
          scheduled_date: string
          scheduled_time: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          generated_by_ai?: boolean | null
          id?: string
          notes?: string | null
          platform: string
          scheduled_date: string
          scheduled_time?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          generated_by_ai?: boolean | null
          id?: string
          notes?: string | null
          platform?: string
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          content: string
          created_at: string
          hashtags: string[] | null
          id: string
          platform: string | null
          score_data: Json | null
          style: string
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          platform?: string | null
          score_data?: Json | null
          style: string
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          platform?: string | null
          score_data?: Json | null
          style?: string
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      persona_archetypes: {
        Row: {
          created_at: string
          description: string
          id: string
          industry: string[]
          name: string
          template: Json
          thumbnail: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          industry: string[]
          name: string
          template: Json
          thumbnail?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          industry?: string[]
          name?: string
          template?: Json
          thumbnail?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_sector: string
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
          whatsapp: string
        }
        Insert: {
          business_sector: string
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          updated_at?: string
          user_id: string
          whatsapp: string
        }
        Update: {
          business_sector?: string
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
          whatsapp?: string
        }
        Relationships: []
      }
      sentiment_analysis: {
        Row: {
          analyzed_at: string
          content: string
          created_at: string
          id: string
          keywords: string[] | null
          platform: string
          sentiment: string
          sentiment_score: number | null
          source_url: string | null
          user_id: string
        }
        Insert: {
          analyzed_at?: string
          content: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          platform: string
          sentiment: string
          sentiment_score?: number | null
          source_url?: string | null
          user_id: string
        }
        Update: {
          analyzed_at?: string
          content?: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          platform?: string
          sentiment?: string
          sentiment_score?: number | null
          source_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          post_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          post_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          post_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "editorial_calendar"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invited_at: string
          member_email: string
          member_id: string | null
          role: string
          status: string
          updated_at: string
          workspace_owner: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string
          member_email: string
          member_id?: string | null
          role?: string
          status?: string
          updated_at?: string
          workspace_owner: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string
          member_email?: string
          member_id?: string | null
          role?: string
          status?: string
          updated_at?: string
          workspace_owner?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          phase: string
          progress_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          phase: string
          progress_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          phase?: string
          progress_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          updated_at?: string
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
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      subscription_plan: "free" | "pro" | "premium"
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
      app_role: ["admin", "user"],
      subscription_plan: ["free", "pro", "premium"],
    },
  },
} as const
