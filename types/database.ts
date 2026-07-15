export interface Database {
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
      }
    }
  }
}
