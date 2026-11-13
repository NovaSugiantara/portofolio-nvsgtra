-- 004_schema_rls_hardening.sql
-- Forward-only hardening for the nine application tables.
-- Existing rows are never deleted or rewritten. Unique indexes fail safely if
-- pre-existing duplicate owner/default data must be reconciled first.

-- ============================================================
-- Singleton/default invariants
-- ============================================================

-- A portfolio has one profile per owner.
create unique index profiles_owner_id_unique
  on public.profiles (owner_id);

-- A CV owner may save multiple variants, but only one can be public/default.
create unique index cv_variants_one_default_per_owner_unique
  on public.cv_variants (owner_id)
  where is_default = true;

-- ============================================================
-- Explicit least-privilege table grants
-- ============================================================

-- Anonymous users can read only the published content covered by RLS below.
grant select on table
  public.profiles,
  public.skills,
  public.experiences,
  public.projects,
  public.education,
  public.certifications,
  public.blog_posts
to anon;

-- Authenticated access is still restricted to the owner policies below. The
-- profile is provisioned by the seed/admin setup, not by arbitrary users.
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table
  public.skills,
  public.experiences,
  public.projects,
  public.education,
  public.certifications,
  public.cv_variants,
  public.blog_posts
to authenticated;

-- cv_variants is assembled by the server-side CV route and is never public.
revoke all on table public.cv_variants from anon;

-- No anonymous write path exists for content tables.
revoke insert, update, delete on table
  public.profiles,
  public.skills,
  public.experiences,
  public.projects,
  public.education,
  public.certifications,
  public.blog_posts
from anon;

-- Contact messages are write-only for anon. The owner can read them below.
revoke all on table public.contact_messages from anon;
grant insert on table public.contact_messages to anon;
grant select on table public.contact_messages to authenticated;
revoke insert, update, delete on table public.contact_messages from authenticated;

-- ============================================================
-- RLS is enabled on every application table
-- ============================================================

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.cv_variants enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;

-- ============================================================
-- Replace the original policies with explicit owner-scoped policies
-- ============================================================

drop policy if exists "public read published profiles" on public.profiles;
drop policy if exists "public read published skills" on public.skills;
drop policy if exists "public read published experiences" on public.experiences;
drop policy if exists "public read published projects" on public.projects;
drop policy if exists "public read published education" on public.education;
drop policy if exists "public read published certifications" on public.certifications;
drop policy if exists "public read published blog posts" on public.blog_posts;

drop policy if exists "owner manage profiles" on public.profiles;
drop policy if exists "owner manage skills" on public.skills;
drop policy if exists "owner manage experiences" on public.experiences;
drop policy if exists "owner manage projects" on public.projects;
drop policy if exists "owner manage education" on public.education;
drop policy if exists "owner manage certifications" on public.certifications;
drop policy if exists "owner manage cv_variants" on public.cv_variants;
drop policy if exists "owner manage blog_posts" on public.blog_posts;
drop policy if exists "owner read profiles" on public.profiles;
drop policy if exists "owner update profiles" on public.profiles;

drop policy if exists "public can submit contact message" on public.contact_messages;
drop policy if exists "owner reads contact messages" on public.contact_messages;

-- Published reads are the only anonymous content access.
create policy "public read published profiles"
  on public.profiles for select
  to anon
  using (is_published = true);

create policy "public read published skills"
  on public.skills for select
  to anon
  using (is_published = true);

create policy "public read published experiences"
  on public.experiences for select
  to anon
  using (is_published = true);

create policy "public read published projects"
  on public.projects for select
  to anon
  using (is_published = true);

create policy "public read published education"
  on public.education for select
  to anon
  using (is_published = true);

create policy "public read published certifications"
  on public.certifications for select
  to anon
  using (is_published = true);

create policy "public read published blog posts"
  on public.blog_posts for select
  to anon
  using (is_published = true);

-- The profile is the bootstrap owner record. It can be read/updated by its
-- owner, but cannot be claimed by an arbitrary authenticated user through the
-- Data API. Wrapping auth.uid() in SELECT evaluates it once per statement.
create policy "owner read profiles"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "owner update profiles"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

-- Content ownership is additionally anchored to an existing profile. This
-- prevents any authenticated account from creating a profile and then using
-- that profile to read contact messages or create public content.
create policy "owner manage skills"
  on public.skills for all
  to authenticated
  using (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );

create policy "owner manage experiences"
  on public.experiences for all
  to authenticated
  using (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );

create policy "owner manage projects"
  on public.projects for all
  to authenticated
  using (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );

create policy "owner manage education"
  on public.education for all
  to authenticated
  using (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );

create policy "owner manage certifications"
  on public.certifications for all
  to authenticated
  using (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );

create policy "owner manage cv_variants"
  on public.cv_variants for all
  to authenticated
  using (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );

create policy "owner manage blog_posts"
  on public.blog_posts for all
  to authenticated
  using (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );

-- Contact submission remains the sole anonymous INSERT exception. It cannot
-- mark a message read; server-side validation/rate limiting remains required.
create policy "public can submit contact message"
  on public.contact_messages for insert
  to anon
  with check (is_read = false);

-- contact_messages has no owner_id, so ownership is established by the
-- singleton profiles row for the authenticated portfolio owner.
create policy "owner reads contact messages"
  on public.contact_messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  );
