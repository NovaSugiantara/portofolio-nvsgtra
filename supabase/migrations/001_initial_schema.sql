-- 001_initial_schema.sql
-- Phase 1: All 9 tables + indexes + updated_at trigger
-- Schema: SRS.md §3

-- ============================================================
-- updated_at auto-trigger function
-- ============================================================
create or replace function trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- 1. profiles — singleton row per owner
-- ============================================================
create table profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  headline text not null,
  summary text,
  location text,
  email text,
  phone text,
  linkedin_url text,
  website_url text,
  avatar_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_owner on profiles (owner_id);
create index idx_profiles_published on profiles (is_published) where is_published = true;
create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 2. skills
-- ============================================================
create table skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  name text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_skills_owner on skills (owner_id);
create index idx_skills_published on skills (is_published) where is_published = true;
create index idx_skills_sort on skills (sort_order);

-- ============================================================
-- 3. experiences
-- ============================================================
create table experiences (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date,
  bullets text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_experiences_owner on experiences (owner_id);
create index idx_experiences_published on experiences (is_published) where is_published = true;
create index idx_experiences_sort on experiences (sort_order);
create trigger trg_experiences_updated_at
  before update on experiences
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 4. projects
-- ============================================================
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  tech_stack text[] not null default '{}',
  role text,
  project_url text,
  repo_url text,
  cover_image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_projects_owner on projects (owner_id);
create index idx_projects_published on projects (is_published) where is_published = true;
create index idx_projects_slug on projects (slug);
create index idx_projects_sort on projects (sort_order);
create trigger trg_projects_updated_at
  before update on projects
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 5. education
-- ============================================================
create table education (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  institution text not null,
  degree text not null,
  start_date date,
  end_date date,
  is_expected boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_education_owner on education (owner_id);
create index idx_education_published on education (is_published) where is_published = true;
create index idx_education_sort on education (sort_order);
create trigger trg_education_updated_at
  before update on education
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 6. certifications
-- ============================================================
create table certifications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  issuer text not null,
  issued_date date,
  credential_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_certifications_owner on certifications (owner_id);
create index idx_certifications_published on certifications (is_published) where is_published = true;
create index idx_certifications_sort on certifications (sort_order);
create trigger trg_certifications_updated_at
  before update on certifications
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 7. cv_variants
-- ============================================================
create table cv_variants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  included_experience_ids uuid[] not null default '{}',
  included_project_ids uuid[] not null default '{}',
  included_skill_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_cv_variants_owner on cv_variants (owner_id);
create trigger trg_cv_variants_updated_at
  before update on cv_variants
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 8. blog_posts
-- ============================================================
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  published_at timestamptz,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_blog_posts_owner on blog_posts (owner_id);
create index idx_blog_posts_published on blog_posts (is_published) where is_published = true;
create index idx_blog_posts_slug on blog_posts (slug);
create index idx_blog_posts_sort on blog_posts (sort_order);
create trigger trg_blog_posts_updated_at
  before update on blog_posts
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 9. contact_messages
-- ============================================================
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);
create index idx_contact_messages_created on contact_messages (created_at desc);
create index idx_contact_messages_unread on contact_messages (is_read) where is_read = false;
