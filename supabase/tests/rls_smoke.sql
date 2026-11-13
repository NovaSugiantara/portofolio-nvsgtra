-- RLS smoke test. Run against a LOCAL database only (everything is rolled back):
--   docker exec -i supabase_db_portfolio-nvsgtra psql -U postgres -q -t < supabase/tests/rls_smoke.sql
begin;
insert into auth.users (id, email, aud, role) values
 ('00000000-0000-0000-0000-00000000000a','owner@test.local','authenticated','authenticated'),
 ('00000000-0000-0000-0000-00000000000b','stranger@test.local','authenticated','authenticated');
insert into public.site_owners values ('00000000-0000-0000-0000-00000000000a');
update public.projects set is_published = false where slug = 'garage-sale-tag-generator';

-- anon
set local role anon;
select 'anon sees published', count(*) from public.projects;
do $$ begin insert into public.projects (slug,title,summary) values ('x','x','x'); raise notice 'FAIL anon insert allowed'; exception when others then raise notice 'ok anon insert blocked: %', sqlerrm; end $$;
do $$ declare n int; begin update public.site_profiles set headline='hacked'; get diagnostics n = row_count; raise notice 'anon update rows=% ', n; exception when others then raise notice 'ok anon update blocked: %', sqlerrm; end $$;
do $$ begin perform * from public.site_owners; raise notice 'FAIL anon read owners'; exception when others then raise notice 'ok anon owners blocked'; end $$;
reset role;

-- stranger (authenticated, not owner)
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';
select 'stranger sees', count(*) from public.projects;
do $$ begin insert into public.projects (slug,title,summary) values ('x','x','x'); raise notice 'FAIL stranger insert'; exception when others then raise notice 'ok stranger insert blocked: %', sqlerrm; end $$;
do $$ declare n int; begin update public.projects set title='hacked'; get diagnostics n = row_count; raise notice 'stranger update rows=%', n; end $$;
do $$ declare n int; begin delete from public.projects; get diagnostics n = row_count; raise notice 'stranger delete rows=%', n; end $$;
do $$ begin insert into storage.objects (bucket_id, name) values ('media','x.webp'); raise notice 'FAIL stranger upload'; exception when others then raise notice 'ok stranger upload blocked'; end $$;
reset role;

-- owner
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}';
select 'owner sees all', count(*) from public.projects;
insert into public.projects (slug,title,summary) values ('owner-test','t','s');
update public.site_profiles set hero_media = 'video' where site='portfolio';
do $$ begin update public.site_profiles set hero_media='photo' where site='portfolio'; raise notice 'FAIL photo without avatar'; exception when check_violation then raise notice 'ok photo needs avatar'; end $$;
do $$ begin insert into public.projects (slug,title,summary,project_url) values ('bad-url','t','s','javascript:alert(1)'); raise notice 'FAIL bad url'; exception when check_violation then raise notice 'ok unsafe url rejected'; end $$;
select 'owner insert ok', count(*) from public.projects where slug='owner-test';
reset role;

-- owner with a verified TOTP factor but an aal1 (password-only) session
insert into auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at)
values (gen_random_uuid(), '00000000-0000-0000-0000-00000000000a', 'test', 'totp', 'verified', now(), now());
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated","aal":"aal1"}';
do $$ declare n int; begin update public.projects set title='aal1 edit'; get diagnostics n = row_count; raise notice 'owner aal1 with MFA update rows=% (expect 0)', n; end $$;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated","aal":"aal2"}';
do $$ declare n int; begin update public.projects set sort_order = sort_order; get diagnostics n = row_count; raise notice 'owner aal2 update rows=% (expect 4)', n; end $$;
reset role;
rollback;
