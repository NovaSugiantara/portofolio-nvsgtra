-- Content schema for the portfolio and (later) forgebyte.id.
--
-- Access model
--   * anon and authenticated may read published content only.
--   * Writes are allowed only for the single owner listed in public.site_owners.
--     That row is inserted by hand (SQL editor) after the owner account is created;
--     public sign up is disabled in Auth, so no other account can exist by self-service.
--   * Nothing grants anon INSERT, UPDATE or DELETE.

create schema if not exists private;
revoke all on schema private from public;

-- ---------------------------------------------------------------------------
-- Owner allowlist
-- ---------------------------------------------------------------------------

create table public.site_owners (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.site_owners is
  'Accounts allowed to edit content. Managed by SQL only; there is no write policy.';

alter table public.site_owners enable row level security;

create policy "Owners can see their own row"
  on public.site_owners for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Explicit grants: new projects no longer expose public tables to the Data API by default.
revoke all on public.site_owners from anon, authenticated;
grant select on public.site_owners to authenticated;

-- security definer so policies can consult site_owners and auth.mfa_factors without
-- granting read on them. Once the owner enrols an authenticator app, a password-only
-- session (aal1) is no longer enough: the session must have passed the TOTP step (aal2).
create function private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.site_owners where user_id = (select auth.uid())
  )
  and (
    coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
    or not exists (
      select 1 from auth.mfa_factors
      where user_id = (select auth.uid()) and status = 'verified'
    )
  );
$$;

revoke all on function private.is_owner() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_owner() to authenticated;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create type public.site_key as enum ('portfolio', 'forgebyte');

create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- A URL column accepts an absolute https URL or a site-relative path. Plain http is allowed
-- only for localhost, where the local Supabase stack serves Storage during development.
create function private.is_safe_url(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value is null
    or (char_length(value) <= 2048 and (
      value ~ '^https://[^\s]+$'
      or value ~ '^/[^/\s][^\s]*$'
      or value ~ '^http://(localhost|127\.0\.0\.1)(:[0-9]+)?/[^\s]*$'
    ));
$$;

-- ---------------------------------------------------------------------------
-- Site profile (one row per site): hero copy and hero media choice
-- ---------------------------------------------------------------------------

create table public.site_profiles (
  site public.site_key primary key,
  full_name text not null check (char_length(full_name) between 1 and 120),
  headline text not null check (char_length(headline) between 1 and 160),
  summary text check (char_length(summary) <= 1200),
  location text check (char_length(location) <= 120),
  email text check (email is null or (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  linkedin_url text check (private.is_safe_url(linkedin_url)),
  website_url text check (private.is_safe_url(website_url)),
  hero_media text not null default 'video' check (hero_media in ('video', 'photo')),
  hero_video_url text check (private.is_safe_url(hero_video_url)),
  hero_poster_url text check (private.is_safe_url(hero_poster_url)),
  avatar_url text check (private.is_safe_url(avatar_url)),
  avatar_alt text check (char_length(avatar_alt) <= 200),
  updated_at timestamptz not null default now(),
  -- Photo mode needs a photo to show.
  constraint site_profiles_photo_requires_avatar check (hero_media <> 'photo' or avatar_url is not null)
);

create trigger site_profiles_touch_updated_at
  before update on public.site_profiles
  for each row execute function private.touch_updated_at();

alter table public.site_profiles enable row level security;

create policy "Anyone can read site profiles"
  on public.site_profiles for select
  to anon, authenticated
  using (true);

create policy "Owner can insert site profiles"
  on public.site_profiles for insert
  to authenticated
  with check ((select private.is_owner()));

create policy "Owner can update site profiles"
  on public.site_profiles for update
  to authenticated
  using ((select private.is_owner()))
  with check ((select private.is_owner()));

revoke all on public.site_profiles from anon, authenticated;
grant select on public.site_profiles to anon, authenticated;
grant insert, update on public.site_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  site public.site_key not null default 'portfolio',
  slug text not null check (char_length(slug) <= 80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null default 'work' check (kind in ('work', 'challenge')),
  title text not null check (char_length(title) between 1 and 120),
  summary text not null check (char_length(summary) between 1 and 400),
  description text check (char_length(description) <= 4000),
  contributions text[] not null default '{}' check (cardinality(contributions) <= 12),
  team_note text check (char_length(team_note) <= 400),
  tech_stack text[] not null default '{}' check (cardinality(tech_stack) <= 20),
  role text check (char_length(role) <= 120),
  project_url text check (private.is_safe_url(project_url)),
  project_url_label text check (char_length(project_url_label) <= 60),
  repo_url text check (private.is_safe_url(repo_url)),
  cover_image_url text check (private.is_safe_url(cover_image_url)),
  cover_alt text check (char_length(cover_alt) <= 200),
  -- { platform, profile_url, format: 'duel'|'brawl', rank, entrants, score, submitted_at }
  challenge jsonb check (challenge is null or jsonb_typeof(challenge) = 'object'),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_site_slug_key unique (site, slug),
  constraint projects_challenge_matches_kind check ((kind = 'challenge') = (challenge is not null))
);

-- Public build query: published projects of one site in display order.
create index projects_site_published_order_idx
  on public.projects (site, sort_order)
  where is_published;

create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function private.touch_updated_at();

alter table public.projects enable row level security;

create policy "Anyone can read published projects"
  on public.projects for select
  to anon, authenticated
  using (is_published);

create policy "Owner can read all projects"
  on public.projects for select
  to authenticated
  using ((select private.is_owner()));

create policy "Owner can insert projects"
  on public.projects for insert
  to authenticated
  with check ((select private.is_owner()));

create policy "Owner can update projects"
  on public.projects for update
  to authenticated
  using ((select private.is_owner()))
  with check ((select private.is_owner()));

create policy "Owner can delete projects"
  on public.projects for delete
  to authenticated
  using ((select private.is_owner()));

revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

-- ---------------------------------------------------------------------------
-- Media bucket: screenshots, hero photo, hero video
-- ---------------------------------------------------------------------------

-- Public read so prerendered pages can link files directly. The admin server route
-- checks magic bytes before upload; the bucket limits are a second line of defence.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  8388608,
  array['image/webp', 'image/png', 'image/jpeg', 'image/avif', 'video/webm', 'video/mp4']
)
on conflict (id) do nothing;

create policy "Owner can list media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'media' and (select private.is_owner()));

create policy "Owner can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and (select private.is_owner()));

create policy "Owner can replace media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and (select private.is_owner()))
  with check (bucket_id = 'media' and (select private.is_owner()));

create policy "Owner can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and (select private.is_owner()));
