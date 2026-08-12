-- 005_contact_message_read_policy.sql
-- Allow the configured portfolio owner to mark contact messages as read.
-- No other contact-message columns become writable through the Data API.

grant update (is_read) on table public.contact_messages to authenticated;

create policy "owner updates contact read state"
  on public.contact_messages for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.owner_id = (select auth.uid())
    )
  )
  with check (is_read in (true, false));
