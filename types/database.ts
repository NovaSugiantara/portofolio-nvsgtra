export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: any
        Insert: {
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
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      skills: {
        Row: any
        Insert: {
          category: string
          name: string
          sort_order?: number
          is_published?: boolean
        }
        Update: Partial<Database['public']['Tables']['skills']['Insert']>
      }
      experiences: {
        Row: any
        Insert: {
          company: string
          role: string
          location?: string | null
          start_date: string
          end_date?: string | null
          bullets?: string[]
          sort_order?: number
          is_published?: boolean
        }
        Update: {
          company?: string
          role?: string
          location?: string | null
          start_date?: string
          end_date?: string | null
          bullets?: string[]
          sort_order?: number
          is_published?: boolean
        }
      }
      projects: {
        Row: any
        Insert: {
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
        }
        Update: {
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
        }
      }
      education: {
        Row: any
        Insert: {
          institution: string
          degree: string
          start_date?: string | null
          end_date?: string | null
          is_expected?: boolean
          sort_order?: number
          is_published?: boolean
        }
        Update: {
          institution?: string
          degree?: string
          start_date?: string | null
          end_date?: string | null
          is_expected?: boolean
          sort_order?: number
          is_published?: boolean
        }
      }
      certifications: {
        Row: any
        Insert: {
          name: string
          issuer: string
          issued_date?: string | null
          credential_url?: string | null
          sort_order?: number
          is_published?: boolean
        }
        Update: {
          name?: string
          issuer?: string
          issued_date?: string | null
          credential_url?: string | null
          sort_order?: number
          is_published?: boolean
        }
      }
      cv_variants: {
        Row: any
        Insert: {
          name: string
          is_default?: boolean
          included_experience_ids?: string[]
          included_project_ids?: string[]
          included_skill_ids?: string[]
        }
        Update: {
          name?: string
          is_default?: boolean
          included_experience_ids?: string[]
          included_project_ids?: string[]
          included_skill_ids?: string[]
        }
      }
      blog_posts: {
        Row: any
        Insert: {
          slug: string
          title: string
          excerpt?: string | null
          content: string
          cover_image_url?: string | null
          tags?: string[]
          published_at?: string | null
          sort_order?: number
          is_published?: boolean
        }
        Update: {
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string
          cover_image_url?: string | null
          tags?: string[]
          published_at?: string | null
          sort_order?: number
          is_published?: boolean
        }
      }
      contact_messages: {
        Row: any
      }
    }
  }
}
