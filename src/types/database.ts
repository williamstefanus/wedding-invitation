export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      event_sessions: {
        Row: {
          address: string | null
          created_at: string
          date: string | null
          end_time: string | null
          event_type_id: string
          google_maps_url: string | null
          id: string
          is_rsvp_option: boolean | null
          name: string
          slug: string
          sort_order: number | null
          start_time: string | null
          updated_at: string
          venue_name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date?: string | null
          end_time?: string | null
          event_type_id: string
          google_maps_url?: string | null
          id?: string
          is_rsvp_option?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          start_time?: string | null
          updated_at?: string
          venue_name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date?: string | null
          end_time?: string | null
          event_type_id?: string
          google_maps_url?: string | null
          id?: string
          is_rsvp_option?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          start_time?: string | null
          updated_at?: string
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_sessions_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          }
        ]
      }
      event_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          rsvp_edit_deadline_at: string | null
          slug: string
          total_tables: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rsvp_edit_deadline_at?: string | null
          slug: string
          total_tables?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rsvp_edit_deadline_at?: string | null
          slug?: string
          total_tables?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          created_at: string
          event_type_id: string
          id: string
          image_url: string
          is_active: boolean | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          event_type_id: string
          id?: string
          image_url: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          event_type_id?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          }
        ]
      }
      guests: {
        Row: {
          category: Database["public"]["Enums"]["guest_category"] | null
          created_at: string
          id: string
          name: string
          notes: string | null
          owner: Database["public"]["Enums"]["guest_owner"] | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["guest_category"] | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          owner?: Database["public"]["Enums"]["guest_owner"] | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["guest_category"] | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          owner?: Database["public"]["Enums"]["guest_owner"] | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          checked_in_at: string | null
          checked_in_pax: number | null
          created_at: string
          event_type_id: string
          guest_id: string
          id: string
          invitation_code: string
          is_sent: boolean | null
          max_pax: number
          updated_at: string
        }
        Insert: {
          checked_in_at?: string | null
          checked_in_pax?: number | null
          created_at?: string
          event_type_id: string
          guest_id: string
          id?: string
          invitation_code: string
          is_sent?: boolean | null
          max_pax?: number
          updated_at?: string
        }
        Update: {
          checked_in_at?: string | null
          checked_in_pax?: number | null
          created_at?: string
          event_type_id?: string
          guest_id?: string
          id?: string
          invitation_code?: string
          is_sent?: boolean | null
          max_pax?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          }
        ]
      }
      rsvp_selected_sessions: {
        Row: {
          event_session_id: string
          id: string
          rsvp_id: string
        }
        Insert: {
          event_session_id: string
          id?: string
          rsvp_id: string
        }
        Update: {
          event_session_id?: string
          id?: string
          rsvp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_selected_sessions_event_session_id_fkey"
            columns: ["event_session_id"]
            isOneToOne: false
            referencedRelation: "event_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_selected_sessions_rsvp_id_fkey"
            columns: ["rsvp_id"]
            isOneToOne: false
            referencedRelation: "rsvps"
            referencedColumns: ["id"]
          }
        ]
      }
      rsvps: {
        Row: {
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          confirmed_pax: number
          id: string
          invitation_id: string
          submitted_at: string
          updated_at: string
          wish_message: string | null
        }
        Insert: {
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          confirmed_pax?: number
          id?: string
          invitation_id: string
          submitted_at?: string
          updated_at?: string
          wish_message?: string | null
        }
        Update: {
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          confirmed_pax?: number
          id?: string
          invitation_id?: string
          submitted_at?: string
          updated_at?: string
          wish_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: true
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          }
        ]
      }
      seating_assignments: {
        Row: {
          assigned_pax: number
          created_at: string
          id: string
          invitation_id: string
          seating_table_id: string
          updated_at: string
        }
        Insert: {
          assigned_pax: number
          created_at?: string
          id?: string
          invitation_id: string
          seating_table_id: string
          updated_at?: string
        }
        Update: {
          assigned_pax?: number
          created_at?: string
          id?: string
          invitation_id?: string
          seating_table_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seating_assignments_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: true
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seating_assignments_seating_table_id_fkey"
            columns: ["seating_table_id"]
            isOneToOne: false
            referencedRelation: "seating_tables"
            referencedColumns: ["id"]
          }
        ]
      }
      seating_tables: {
        Row: {
          capacity: number
          created_at: string
          event_type_id: string
          id: string
          position_x: number | null
          position_y: number | null
          sort_order: number | null
          table_name: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          event_type_id: string
          id?: string
          position_x?: number | null
          position_y?: number | null
          sort_order?: number | null
          table_name: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          event_type_id?: string
          id?: string
          position_x?: number | null
          position_y?: number | null
          sort_order?: number | null
          table_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seating_tables_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          }
        ]
      }
      settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_status: "attending" | "not_attending"
      guest_category: "Relatives" | "Friends" | "Church"
      guest_owner: "William" | "Aziel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
