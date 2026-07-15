-- 002_rls_policies.sql
-- Phase 1: Enable RLS on all tables + explicit policies
-- Rules: SRS.md §4 + Supabase skill: use TO clause, no auth.role()
-- Default deny, allow narrowly

-- ============================================================
-- Enable RLS on every table (non-negotiable, SRS §3-4)
-- ============================================================
alter table profiles enable row level security;
alter table skills enable row level security;
alter table experiences enable row level security;
alter table projects enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table cv_variants enable row level security;
alter table blog_posts enable row level security;
alter table contact_messages enable row level security;

-- ============================================================
-- PUBLIC READ: anon can SELECT only published rows
-- ============================================================
create policy "public read published profiles"
  on profiles for select
  to anon
  using (is_published = true);

create policy "public read published skills"
  on skills for select
  to anon
  using (is_published = true);

create policy "public read published experiences"
  on experiences for select
  to anon
  using (is_published = true);

create policy "public read published projects"
  on projects for select
  to anon
  using (is_published = true);

create policy "public read published education"
  on education for select
  to anon
  using (is_published = true);

create policy "public read published certifications"
  on certifications for select
  to anon
  using (is_published = true);

create policy "public read published blog posts"
  on blog_posts for select
  to anon
  using (is_published = true);

-- NOTE: cv_variants has NO public read policy — CV data served
-- through server route /api/cv/generate (SRS §4 item "cv_variants
-- is never publicly readable directly")

-- ============================================================
-- OWNER FULL ACCESS: authenticated, owner_id = auth.uid()
-- Per Supabase skill: UPDATE needs USING + WITH CHECK
-- Per SRS §4: all content tables use same owner-manage pattern
-- ============================================================
create policy "owner manage profiles"
  on profiles for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owner manage skills"
  on skills for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owner manage experiences"
  on experiences for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owner manage projects"
  on projects for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owner manage education"
  on education for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owner manage certifications"
  on certifications for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owner manage cv_variants"
  on cv_variants for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owner manage blog_posts"
  on blog_posts for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ============================================================
-- CONTACT MESSAGES: anon INSERT, authenticated SELECT (owner only)
-- INSERT validated at server route (zod + rate-limit) per SRS §4
-- ============================================================
create policy "public can submit contact message"
  on contact_messages for insert
  to anon
  with check (true);

create policy "owner reads contact messages"
  on contact_messages for select
  to authenticated
  using (auth.uid() in (select owner_id from profiles limit 1));
