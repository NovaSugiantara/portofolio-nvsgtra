-- 003_seed_data.sql
-- Phase 1: Seed portfolio content from Nova's CV (CV.md + PRD §4)
--
-- IMPORTANT: This seed requires an existing admin user in auth.users.
-- Before running, set the owner_id variable to your admin user's UUID.
--
-- Local dev workflow:
--   1. Create admin user via Supabase Auth (dashboard/CLI)
--   2. Copy the UUID from auth.users
--   3. Replace the placeholder below
--   4. Run: supabase db execute --file supabase/migrations/003_seed_data.sql
--
-- Alternative (psql):
--   \set owner_id '<your-admin-uuid>'
--   \i supabase/migrations/003_seed_data.sql
--
-- ⚠️  Replace '<YOUR-ADMIN-USER-UUID>' with the actual auth.users id before running.

\set owner_id '<YOUR-ADMIN-USER-UUID>'

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- PROFILE
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
insert into profiles (owner_id, full_name, headline, summary, location, email, phone, linkedin_url, website_url, is_published)
values (
  :'owner_id',
  'Nova Sugiantara',
  'Full Stack Web Developer | Laravel | Vue.js | React | AWS | Ruby on Rails | Go | AI',
  'Full Stack Developer with 4+ years of experience designing and shipping production-grade web applications across JavaScript (React, Vue) and Ruby/PHP (Ruby on Rails, Laravel) ecosystems. Track record of owning complex, high-stakes systems end-to-end — from payment gateway integrations and high-traffic booking engines to blockchain-based platforms — and leading development teams through sprint planning, code review, and mentorship. Currently deepening expertise in AI-assisted and AI-integrated development, exploring how LLMs and intelligent automation can be embedded into real products to accelerate delivery, improve decision-making, and unlock new user experiences.',
  'Batubulan, Bali, Indonesia',
  'nvsgtra425@gmail.com',
  '+62 881-0802-90643',
  'https://linkedin.com/in/novasugiantara',
  'https://novasugiantara.web.id',
  true
)
on conflict do nothing;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- SKILLS (grouped by category)
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
insert into skills (owner_id, category, name, sort_order, is_published) values
  (:'owner_id', 'Frontend',  'Vue.js',        1, true),
  (:'owner_id', 'Frontend',  'React',          2, true),
  (:'owner_id', 'Frontend',  'Redux.js',       3, true),
  (:'owner_id', 'Frontend',  'JavaScript',     4, true),
  (:'owner_id', 'Frontend',  'HTML5',          5, true),
  (:'owner_id', 'Frontend',  'CSS3',           6, true),
  (:'owner_id', 'Backend',   'Laravel',        1, true),
  (:'owner_id', 'Backend',   'Ruby on Rails',  2, true),
  (:'owner_id', 'Backend',   'Node.js',        3, true),
  (:'owner_id', 'Backend',   'Go',             4, true),
  (:'owner_id', 'Backend',   'PHP',            5, true),
  (:'owner_id', 'Databases', 'PostgreSQL',     1, true),
  (:'owner_id', 'Databases', 'MySQL',          2, true),
  (:'owner_id', 'DevOps',    'AWS',            1, true),
  (:'owner_id', 'DevOps',    'Docker',         2, true),
  (:'owner_id', 'DevOps',    'CI/CD',          3, true),
  (:'owner_id', 'Tools',     'Git',            1, true),
  (:'owner_id', 'Tools',     'RESTful APIs',   2, true),
  (:'owner_id', 'Tools',     'Payment Gateways (Midtrans, PayPal)', 3, true),
  (:'owner_id', 'Tools',     'Blockchain Integration', 4, true)
on conflict do nothing;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- EXPERIENCES (reverse-chronological order)
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
insert into experiences (owner_id, company, role, location, start_date, end_date, bullets, sort_order, is_published) values

(:'owner_id', 'PT. Omni Hotelier International', 'Booking Engine Product Coordinator / Lead Team Product Developer', 'Gianyar, Bali',
 '2025-05-01', null,
 array[
   'Lead end-to-end Booking Engine development using React/Redux + Laravel, from technical planning through delivery',
   'Own sprint planning and task breakdown for the development team, translating product/business requirements into actionable engineering tasks',
   'Conduct code reviews across the team''s pull requests to enforce code quality, consistency, and best practices',
   'Triage and resolve production bugs, prioritizing fixes by business impact and user-facing severity',
   'Act as the technical point of coordination between product, QA, and engineering to keep sprint delivery predictable'
 ], 1, true),

(:'owner_id', 'PT. Omni Hotelier International', 'Intermediate Fullstack Developer', 'Gianyar, Bali',
 '2024-05-01', '2025-05-01',
 array[
   'Implemented Indonesian and international payment gateway integrations (Midtrans, Xendit, Flywire and others)',
   'Enhanced third-party plugin compatibility by 40%',
   'Mentored 3 junior developers in code best practices, pairing on reviews and architecture decisions'
 ], 2, true),

(:'owner_id', 'PT. Omni Hotelier International', 'Junior Full Stack Developer', 'Gianyar, Bali',
 '2023-02-01', '2024-06-01',
 array[
   'Built activity booking system (React/Laravel) handling 5K+ monthly transactions',
   'Developed API integrations for 8+ travel partners',
   'Reduced payment processing errors by 65%'
 ], 3, true),

(:'owner_id', 'Freelance', 'Fullstack Developer', 'Remote',
 '2021-06-01', null,
 array[
   'Created Zisu MLM platform (Laravel) with user management for 10K+ users',
   'Developed Lait Bus booking system (Ruby on Rails) serving 50+ daily routes',
   'Migrated Eurekapp.biz from WordPress to custom stack, improving load time by 70%',
   'Built Minyak Taru Bali e-commerce site with payment processing'
 ], 4, true),

(:'owner_id', 'Baliola', 'Backend Developer', 'Denpasar, Bali',
 '2022-08-01', '2023-02-01',
 array[
   'Developed blockchain-integrated services using Ruby on Rails/PostgreSQL',
   'Created NFT steganography system with Golang',
   'Optimized API response times by 55%'
 ], 5, true),

(:'owner_id', 'Bali Gatra', 'Web Developer', 'Denpasar, Bali',
 '2021-07-01', '2022-07-01',
 array[
   'Built Videolegend.tv streaming platform (PHP) with payment integrations',
   'Implemented responsive UI for 98% cross-browser compatibility'
 ], 6, true)

on conflict do nothing;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- PROJECTS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
insert into projects (owner_id, slug, title, description, tech_stack, role, sort_order, is_published) values

(:'owner_id', 'booking-engine', 'Booking Engine',
 'End-to-end Booking Engine system for hotels with React/Redux frontend and Laravel backend. Handles reservations, payment processing, and third-party integrations.',
 array['React', 'Redux.js', 'Laravel', 'MySQL'],
 'Lead Developer / Product Coordinator', 1, true),

(:'owner_id', 'activity-booking', 'Activity Booking System',
 'Activity booking platform (React/Laravel) handling 5K+ monthly transactions with API integrations for 8+ travel partners.',
 array['React', 'Laravel', 'MySQL'],
 'Junior Fullstack Developer', 2, true),

(:'owner_id', 'zisu-mlm', 'Zisu MLM Platform',
 'Multi-level marketing platform built with Laravel supporting 10K+ users with commission tracking and user hierarchy management.',
 array['Laravel', 'MySQL', 'PHP'],
 'Freelance Fullstack Developer', 3, true),

(:'owner_id', 'lait-bus', 'Lait Bus Booking System',
 'Bus booking system built with Ruby on Rails serving 50+ daily routes with seat management and scheduling.',
 array['Ruby on Rails', 'PostgreSQL'],
 'Freelance Fullstack Developer', 4, true),

(:'owner_id', 'eurekapp-migration', 'Eurekapp.biz Migration',
 'Migrated Eurekapp.biz from WordPress to a custom Ruby on Rails stack. Achieved 70% improvement in load time.',
 array['Ruby on Rails', 'PostgreSQL'],
 'Freelance Fullstack Developer', 5, true),

(:'owner_id', 'minyak-taru-bali', 'Minyak Taru Bali E-commerce',
 'E-commerce site for Minyak Taru Bali with payment processing integration, built with Laravel.',
 array['Laravel', 'MySQL', 'PHP'],
 'Freelance Fullstack Developer', 6, true),

(:'owner_id', 'nft-steganography', 'NFT Steganography System',
 'Blockchain-integrated NFT steganography system developed using Golang and Ruby on Rails for secure data embedding.',
 array['Go', 'Ruby on Rails', 'PostgreSQL'],
 'Backend Developer', 7, true),

(:'owner_id', 'videolegend-tv', 'Videolegend.tv',
 'Streaming platform built with PHP featuring payment integrations and responsive UI for 98% cross-browser compatibility.',
 array['PHP', 'MySQL', 'JavaScript'],
 'Web Developer', 8, true)

on conflict do nothing;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- EDUCATION
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
insert into education (owner_id, institution, degree, start_date, end_date, is_expected, sort_order, is_published) values
(:'owner_id', 'Universitas Terbuka',          'Bachelor of Information Technology', '2022-09-01', '2026-06-01', true,  1, true),
(:'owner_id', 'SMK TI Bali Global Denpasar',  'Software Engineering Diploma',       '2018-07-01', '2021-06-01', false, 2, true)
on conflict do nothing;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- CERTIFICATIONS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
insert into certifications (owner_id, name, issuer, issued_date, sort_order, is_published) values
(:'owner_id', 'Back-End Development for Beginners', 'Dicoding', '2023-01-01', 1, true)
on conflict do nothing;
