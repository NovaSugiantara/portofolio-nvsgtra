-- 003_seed_data.sql
-- Seed portfolio content from docs/CV.md without creating auth credentials.
--
-- This file is aligned with 004_schema_rls_hardening.sql. It is safe to run
-- repeatedly for the same owner: seeded rows are upserted or
-- removed by their stable content keys before being inserted again.
--
-- Run with psql and provide the existing auth.users UUID without committing
-- it to this file:
--   psql -v owner_id='<your-admin-uuid>' -f supabase/migrations/003_seed_data.sql
--
-- The placeholder below is deliberately invalid and prevents accidental
-- execution against an unknown owner.

\if :{?owner_id}
\else
\set owner_id '<YOUR-ADMIN-USER-UUID>'
\endif

do $$
begin
  if :'owner_id' = '<YOUR-ADMIN-USER-UUID>' then
    raise exception 'Set the owner_id psql variable to an existing auth.users UUID';
  end if;
end
$$;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- PROFILE
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
update profiles
set
  full_name = 'Nova Sugiantara',
  headline = 'Full Stack Web Developer | Laravel | Vue.js | React | AWS | Ruby on Rails | Go | AI',
  summary = 'Full Stack Developer with 4+ years of experience designing and shipping production-grade web applications across JavaScript (React, Vue) and Ruby/PHP (Ruby on Rails, Laravel) ecosystems. Experienced in owning complex, high-stakes systems end-to-end, including payment gateway integrations, high-traffic booking engines, and blockchain-based platforms. Leads development teams through sprint planning, code review, and mentorship. Currently deepening expertise in AI-assisted and AI-integrated development, exploring how LLMs and intelligent automation can be embedded into real products to accelerate delivery, improve decision-making, and unlock new user experiences. Brings solid fullstack engineering fundamentals and a forward-leaning interest in AI to backend/fullstack roles building the next generation of intelligent web products.',
  location = 'Batubulan, Bali, Indonesia',
  email = 'nvsgtra425@gmail.com',
  phone = '+62 881-0802-90643',
  linkedin_url = 'https://linkedin.com/in/novasugiantara',
  website_url = 'https://novasugiantara.web.id',
  is_published = true
where owner_id = :'owner_id'::uuid;

insert into profiles (
  owner_id,
  full_name,
  headline,
  summary,
  location,
  email,
  phone,
  linkedin_url,
  website_url,
  is_published
)
select
  :'owner_id'::uuid,
  'Nova Sugiantara',
  'Full Stack Web Developer | Laravel | Vue.js | React | AWS | Ruby on Rails | Go | AI',
  'Full Stack Developer with 4+ years of experience designing and shipping production-grade web applications across JavaScript (React, Vue) and Ruby/PHP (Ruby on Rails, Laravel) ecosystems. Experienced in owning complex, high-stakes systems end-to-end, including payment gateway integrations, high-traffic booking engines, and blockchain-based platforms. Leads development teams through sprint planning, code review, and mentorship. Currently deepening expertise in AI-assisted and AI-integrated development, exploring how LLMs and intelligent automation can be embedded into real products to accelerate delivery, improve decision-making, and unlock new user experiences. Brings solid fullstack engineering fundamentals and a forward-leaning interest in AI to backend/fullstack roles building the next generation of intelligent web products.',
  'Batubulan, Bali, Indonesia',
  'nvsgtra425@gmail.com',
  '+62 881-0802-90643',
  'https://linkedin.com/in/novasugiantara',
  'https://novasugiantara.web.id',
  true
where not exists (
  select 1
  from profiles
  where owner_id = :'owner_id'::uuid
);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- SKILLS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
delete from skills
where owner_id = :'owner_id'::uuid
  and (category, name) in (
    ('Frontend', 'Vue.js'),
    ('Frontend', 'React'),
    ('Frontend', 'Redux.js'),
    ('Frontend', 'JavaScript'),
    ('Frontend', 'HTML5'),
    ('Frontend', 'CSS3'),
    ('Backend', 'Laravel'),
    ('Backend', 'Ruby on Rails'),
    ('Backend', 'Node.js'),
    ('Backend', 'Go'),
    ('Backend', 'PHP'),
    ('Databases', 'PostgreSQL'),
    ('Databases', 'MySQL'),
    ('DevOps', 'AWS'),
    ('DevOps', 'Docker'),
    ('DevOps', 'CI/CD'),
    ('Tools', 'Git'),
    ('Tools', 'RESTful APIs'),
    ('Tools', 'Payment Gateways (Midtrans, PayPal)'),
    ('Tools', 'Blockchain Integration')
  );

insert into skills (owner_id, category, name, sort_order, is_published)
values
  (:'owner_id'::uuid, 'Frontend',  'Vue.js',        1, true),
  (:'owner_id'::uuid, 'Frontend',  'React',          2, true),
  (:'owner_id'::uuid, 'Frontend',  'Redux.js',       3, true),
  (:'owner_id'::uuid, 'Frontend',  'JavaScript',     4, true),
  (:'owner_id'::uuid, 'Frontend',  'HTML5',          5, true),
  (:'owner_id'::uuid, 'Frontend',  'CSS3',           6, true),
  (:'owner_id'::uuid, 'Backend',   'Laravel',        1, true),
  (:'owner_id'::uuid, 'Backend',   'Ruby on Rails',  2, true),
  (:'owner_id'::uuid, 'Backend',   'Node.js',        3, true),
  (:'owner_id'::uuid, 'Backend',   'Go',             4, true),
  (:'owner_id'::uuid, 'Backend',   'PHP',            5, true),
  (:'owner_id'::uuid, 'Databases', 'PostgreSQL',     1, true),
  (:'owner_id'::uuid, 'Databases', 'MySQL',          2, true),
  (:'owner_id'::uuid, 'DevOps',    'AWS',            1, true),
  (:'owner_id'::uuid, 'DevOps',    'Docker',         2, true),
  (:'owner_id'::uuid, 'DevOps',    'CI/CD',          3, true),
  (:'owner_id'::uuid, 'Tools',     'Git',            1, true),
  (:'owner_id'::uuid, 'Tools',     'RESTful APIs',   2, true),
  (:'owner_id'::uuid, 'Tools',     'Payment Gateways (Midtrans, PayPal)', 3, true),
  (:'owner_id'::uuid, 'Tools',     'Blockchain Integration', 4, true);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- EXPERIENCES
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
delete from experiences
where owner_id = :'owner_id'::uuid
  and (company, role, start_date) in (
    ('PT. Omni Hotelier International', 'Booking Engine Product Coordinator / Lead Team Product Developer', '2025-05-01'),
    ('PT. Omni Hotelier International', 'Intermediate Fullstack Developer', '2024-05-01'),
    ('PT. Omni Hotelier International', 'Junior Full Stack Developer', '2023-02-01'),
    ('Freelance', 'Fullstack Developer', '2021-06-01'),
    ('Baliola', 'Backend Developer', '2022-08-01'),
    ('Bali Gatra', 'Web Developer', '2021-07-01')
  );

insert into experiences (owner_id, company, role, location, start_date, end_date, bullets, sort_order, is_published)
values
  (:'owner_id'::uuid, 'PT. Omni Hotelier International', 'Booking Engine Product Coordinator / Lead Team Product Developer', 'Gianyar, Bali',
   '2025-05-01', null,
   array[
     'Lead end-to-end Booking Engine development using React/Redux + Laravel, from technical planning through delivery',
     'Own sprint planning and task breakdown for the development team, translating product/business requirements into actionable engineering tasks',
     'Conduct code reviews across the team''s pull requests to enforce code quality, consistency, and best practices',
     'Triage and resolve production bugs, prioritizing fixes by business impact and user-facing severity',
     'Act as the technical point of coordination between product, QA, and engineering to keep sprint delivery predictable'
   ], 1, true),
  (:'owner_id'::uuid, 'PT. Omni Hotelier International', 'Intermediate Fullstack Developer', 'Gianyar, Bali',
   '2024-05-01', '2025-05-01',
   array[
     'Implemented Indonesian and international payment gateway integrations (Midtrans, Xendit, Flywire and others)',
     'Enhanced third-party plugin compatibility by 40%',
     'Mentored 3 junior developers in code best practices, pairing on reviews and architecture decisions'
   ], 2, true),
  (:'owner_id'::uuid, 'PT. Omni Hotelier International', 'Junior Full Stack Developer', 'Gianyar, Bali',
   '2023-02-01', '2024-06-01',
   array[
     'Built activity booking system (React/Laravel) handling 5K+ monthly transactions',
     'Developed API integrations for 8+ travel partners',
     'Reduced payment processing errors by 65%'
   ], 3, true),
  (:'owner_id'::uuid, 'Freelance', 'Fullstack Developer', null,
   '2021-06-01', null,
   array[
     'Created Zisu MLM platform (Laravel) with user management for 10K+ users',
     'Developed Lait Bus booking system (Ruby on Rails) serving 50+ daily routes',
     'Migrated Eurekapp.biz from WordPress to custom stack, improving load time by 70%',
     'Built Minyak Taru Bali e-commerce site with payment processing'
   ], 4, true),
  (:'owner_id'::uuid, 'Baliola', 'Backend Developer', 'Denpasar, Bali',
   '2022-08-01', '2023-02-01',
   array[
     'Developed blockchain-integrated services using Ruby on Rails/PostgreSQL',
     'Created NFT steganography system with Golang',
     'Optimized API response times by 55%'
   ], 5, true),
  (:'owner_id'::uuid, 'Bali Gatra', 'Web Developer', 'Denpasar, Bali',
   '2021-07-01', '2022-07-01',
   array[
     'Built Videolegend.tv streaming platform (PHP) with payment integrations',
     'Implemented responsive UI for 98% cross-browser compatibility'
   ], 6, true);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- PROJECTS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
insert into projects (owner_id, slug, title, description, tech_stack, role, sort_order, is_published)
values
  (:'owner_id'::uuid, 'booking-engine', 'Booking Engine',
   'React/Redux + Laravel; led end-to-end development from technical planning through delivery.',
   array['React', 'Redux.js', 'Laravel'], 'Booking Engine Product Coordinator / Lead Team Product Developer', 1, true),
  (:'owner_id'::uuid, 'activity-booking', 'Activity Booking System',
   'React/Laravel; handled 5K+ monthly transactions.',
   array['React', 'Laravel'], 'Junior Full Stack Developer', 2, true),
  (:'owner_id'::uuid, 'zisu-mlm', 'Zisu MLM Platform',
   'Laravel; included user management for 10K+ users.',
   array['Laravel'], 'Freelance Fullstack Developer', 3, true),
  (:'owner_id'::uuid, 'lait-bus', 'Lait Bus Booking System',
   'Ruby on Rails; served 50+ daily routes.',
   array['Ruby on Rails'], 'Freelance Fullstack Developer', 4, true),
  (:'owner_id'::uuid, 'eurekapp-migration', 'Eurekapp.biz Migration',
   'Migrated from WordPress to a custom stack, improving load time by 70%.',
   array[]::text[], 'Freelance Fullstack Developer', 5, true),
  (:'owner_id'::uuid, 'minyak-taru-bali', 'Minyak Taru Bali E-commerce',
   'Built an e-commerce site with payment processing.',
   array[]::text[], 'Freelance Fullstack Developer', 6, true),
  (:'owner_id'::uuid, 'nft-steganography', 'NFT Steganography System',
   'Developed blockchain-integrated services with Ruby on Rails/PostgreSQL and an NFT steganography system with Golang.',
   array['Go', 'Ruby on Rails', 'PostgreSQL'], 'Backend Developer', 7, true),
  (:'owner_id'::uuid, 'videolegend-tv', 'Videolegend.tv',
   'Built a PHP streaming platform with payment integrations.',
   array['PHP'], 'Web Developer', 8, true)
on conflict (slug) do update set
  owner_id = excluded.owner_id,
  title = excluded.title,
  description = excluded.description,
  tech_stack = excluded.tech_stack,
  role = excluded.role,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published
where projects.owner_id = excluded.owner_id;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- EDUCATION
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
delete from education
where owner_id = :'owner_id'::uuid
  and (institution, degree) in (
    ('Universitas Terbuka', 'Bachelor of Information Technology'),
    ('SMK TI Bali Global Denpasar', 'Software Engineering Diploma')
  );

insert into education (owner_id, institution, degree, start_date, end_date, is_expected, sort_order, is_published)
values
  (:'owner_id'::uuid, 'Universitas Terbuka', 'Bachelor of Information Technology', '2022-09-01', '2026-06-01', true, 1, true),
  (:'owner_id'::uuid, 'SMK TI Bali Global Denpasar', 'Software Engineering Diploma', '2018-07-01', '2021-06-01', false, 2, true);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- CERTIFICATIONS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
delete from certifications
where owner_id = :'owner_id'::uuid
  and (name, issuer) = ('Back-End Development for Beginners', 'Dicoding');

insert into certifications (owner_id, name, issuer, issued_date, sort_order, is_published)
values
  (:'owner_id'::uuid, 'Back-End Development for Beginners', 'Dicoding', '2023-01-01', 1, true);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- DEFAULT CV VARIANT
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- The variant is assembled from the rows seeded above. Blog posts and contact
-- messages are intentionally not seeded because docs/CV.md has no source
-- content for them and this file must not fabricate records.
update cv_variants
set is_default = false
where owner_id = :'owner_id'::uuid
  and is_default = true
  and name <> 'Full Stack';

delete from cv_variants
where owner_id = :'owner_id'::uuid
  and name = 'Full Stack';

insert into cv_variants (
  owner_id,
  name,
  is_default,
  included_experience_ids,
  included_project_ids,
  included_skill_ids
)
values (
  :'owner_id'::uuid,
  'Full Stack',
  true,
  array(
    select id
    from experiences
    where owner_id = :'owner_id'::uuid and is_published = true
    order by sort_order, start_date desc
  ),
  array(
    select id
    from projects
    where owner_id = :'owner_id'::uuid and is_published = true
    order by sort_order
  ),
  array(
    select id
    from skills
    where owner_id = :'owner_id'::uuid and is_published = true
    order by category, sort_order, name
  )
);
