# novasugiantara.web.id

Monorepo for the personal portfolio and the admin app that edits it. forgebyte.id will join later as a third app on the same database.

| Folder | What it is | Deploys to |
| --- | --- | --- |
| `portfolio/` | Public site (Nuxt 4). Pages are prerendered at build time. | Vercel project, Root Directory `portfolio` |
| `admin/` | Owner-only admin (Nuxt 4, single page app). | Vercel project, Root Directory `admin` |
| `supabase/` | Migrations, seed, RLS smoke test, shared database types. | Supabase project |
| `docs/` | PRD, SRS, design system, CV source. | — |

## How content gets to the site

1. The owner edits projects or the hero in the admin. The browser writes straight to Supabase; owner-only RLS decides what is allowed.
2. **Publish site** calls the portfolio's Vercel deploy hook from an admin server route.
3. The portfolio build reads published rows with the publishable key and prerenders every page.

Visitors only ever load static files. If Supabase is down or paused, the live site keeps working. The next build fails instead of shipping an empty portfolio, and the previous deployment stays live.

Without `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, the portfolio builds from `portfolio/server/data/portfolio.ts`.

## Security model

- Public sign up is disabled. The single owner account is created by hand and listed in `public.site_owners`.
- `anon` can read published projects and site profiles only. It has no insert, update or delete grants.
- Writes require `private.is_owner()`. Once the owner turns on an authenticator app in **Admin → Security**, a password-only session (aal1) can no longer write. The session must also pass the 6 digit code (aal2).
- Neither app uses the service role key.
- Uploads: the server picks the storage path, the browser uploads to a one-time signed URL, then `/api/media/verify` checks the file's magic bytes and deletes anything that does not match. Images are re-encoded to WebP in the browser, which strips EXIF and GPS data.

## Local development

Requires Docker, the Supabase CLI and Node 22.18+.

```bash
supabase start                      # local Postgres, Auth, Storage; applies migrations + seed
supabase status -o env              # copy API_URL and PUBLISHABLE_KEY into portfolio/.env and admin/.env

cd portfolio && npm install && npm run dev     # http://localhost:3000
cd admin && npm install && npm run dev         # http://localhost:3001
```

Create a local owner: add a user in Studio (http://127.0.0.1:54323 → Authentication), then run this in the SQL editor:

```sql
insert into public.site_owners (user_id)
select id from auth.users where email = 'you@example.com';
```

Checks:

```bash
docker exec -i supabase_db_portfolio-nvsgtra psql -U postgres -q -t < supabase/tests/rls_smoke.sql
supabase db lint
cd admin && npm run typecheck
```

After changing a migration, regenerate the types for both apps with `supabase/scripts/gen-types.sh`. The seed is generated from the static content with `node supabase/scripts/generate-seed.ts`.

## Production setup (once)

1. **Supabase.** Create a project in the Singapore region. Then run:
   `supabase link --project-ref <ref>`, then `supabase db push --include-seed`.
   In Authentication settings:
   - Turn off **Allow new users to sign up**.
   - Turn on **TOTP** under Multi-Factor.
   - Set **Site URL** to the admin domain.

   Do not run `supabase config push`: `supabase/config.toml` holds local URLs.
2. **Owner.** In Authentication → Users, use **Add user** to create your account. Then run the `site_owners` insert above in the SQL editor.
3. **Vercel, portfolio project.**
   - Root Directory: `portfolio`.
   - Env: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `WHATSAPP_NUMBER`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.
   - Create a deploy hook for `main`.
4. **Vercel, admin project.**
   - Root Directory: `admin`.
   - Env: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `PORTFOLIO_URL`, `DEPLOY_HOOK_PORTFOLIO`.
   - Domain: `admin.novasugiantara.web.id`.
5. **GitHub.** Add the repository secrets `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for the keep-alive workflow (`.github/workflows/supabase-keepalive.yml`).
6. Sign in to the admin and turn on the authenticator app under **Security**.
