export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type OwnerRelationship<
  ForeignKeyName extends string,
  IsOneToOne extends boolean = false
> = {
  foreignKeyName: ForeignKeyName
  columns: ['owner_id']
  isOneToOne: IsOneToOne
  referencedRelation: 'users'
  referencedColumns: ['id']
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          owner_id: string
          full_name: string
          headline: string
          summary: string | null
          location: string | null
          email: string | null
          phone: string | null
          linkedin_url: string | null
          website_url: string | null
          avatar_url: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          full_name: string
          headline: string
          summary?: string | null
          location?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          website_url?: string | null
          avatar_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          full_name?: string
          headline?: string
          summary?: string | null
          location?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          website_url?: string | null
          avatar_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [OwnerRelationship<'profiles_owner_id_fkey', true>]
      }
      skills: {
        Row: {
          id: string
          owner_id: string
          category: string
          name: string
          sort_order: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          category: string
          name: string
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          category?: string
          name?: string
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Relationships: [OwnerRelationship<'skills_owner_id_fkey'>]
      }
      experiences: {
        Row: {
          id: string
          owner_id: string
          company: string
          role: string
          location: string | null
          start_date: string
          end_date: string | null
          bullets: string[]
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          company: string
          role: string
          location?: string | null
          start_date: string
          end_date?: string | null
          bullets?: string[]
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          company?: string
          role?: string
          location?: string | null
          start_date?: string
          end_date?: string | null
          bullets?: string[]
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [OwnerRelationship<'experiences_owner_id_fkey'>]
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          slug: string
          title: string
          description: string | null
          tech_stack: string[]
          role: string | null
          project_url: string | null
          repo_url: string | null
          cover_image_url: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          slug: string
          title: string
          description?: string | null
          tech_stack?: string[]
          role?: string | null
          project_url?: string | null
          repo_url?: string | null
          cover_image_url?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          slug?: string
          title?: string
          description?: string | null
          tech_stack?: string[]
          role?: string | null
          project_url?: string | null
          repo_url?: string | null
          cover_image_url?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [OwnerRelationship<'projects_owner_id_fkey'>]
      }
      education: {
        Row: {
          id: string
          owner_id: string
          institution: string
          degree: string
          start_date: string | null
          end_date: string | null
          is_expected: boolean
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          institution: string
          degree: string
          start_date?: string | null
          end_date?: string | null
          is_expected?: boolean
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          institution?: string
          degree?: string
          start_date?: string | null
          end_date?: string | null
          is_expected?: boolean
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [OwnerRelationship<'education_owner_id_fkey'>]
      }
      certifications: {
        Row: {
          id: string
          owner_id: string
          name: string
          issuer: string
          issued_date: string | null
          credential_url: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          issuer: string
          issued_date?: string | null
          credential_url?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          issuer?: string
          issued_date?: string | null
          credential_url?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [OwnerRelationship<'certifications_owner_id_fkey'>]
      }
      cv_variants: {
        Row: {
          id: string
          owner_id: string
          name: string
          is_default: boolean
          included_experience_ids: string[]
          included_project_ids: string[]
          included_skill_ids: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          is_default?: boolean
          included_experience_ids?: string[]
          included_project_ids?: string[]
          included_skill_ids?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          is_default?: boolean
          included_experience_ids?: string[]
          included_project_ids?: string[]
          included_skill_ids?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [OwnerRelationship<'cv_variants_owner_id_fkey'>]
      }
      blog_posts: {
        Row: {
          id: string
          owner_id: string
          slug: string
          title: string
          excerpt: string | null
          content: string
          cover_image_url: string | null
          tags: string[]
          published_at: string | null
          is_published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          slug: string
          title: string
          excerpt?: string | null
          content: string
          cover_image_url?: string | null
          tags?: string[]
          published_at?: string | null
          is_published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string
          cover_image_url?: string | null
          tags?: string[]
          published_at?: string | null
          is_published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [OwnerRelationship<'blog_posts_owner_id_fkey'>]
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          is_read?: boolean
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName] extends { Row: infer Row }
  ? Row
  : never

export type TablesInsert<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName] extends { Insert: infer Insert }
  ? Insert
  : never

export type TablesUpdate<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName] extends { Update: infer Update }
  ? Update
  : never
