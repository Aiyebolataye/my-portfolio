-- Optional starter content. Run after schema.sql.
-- Safe to run once: it refuses to duplicate rows that already exist.

insert into public.profiles (full_name, headline, bio, location, email, phone, github_url, availability)
select
  'Aiyebola Taye',
  'Full-stack engineer building products people actually use.',
  E'I design and ship end-to-end products — from Postgres schemas and auth flows to the interface people touch every day. I currently build and run a corporate learning platform at Legend Internet alongside four products of my own: Shopmoda, Handoff, OpenSchool ERP, and Campus Depo. I care about software that is fast, legible, and honest about what it does.',
  'Abuja, Nigeria',
  'taye.aiyebola@gmail.com',
  '+234 905 301 9597',
  'https://github.com/Aiyebolataye',
  'Open to remote backend and full-stack roles'
where not exists (select 1 from public.profiles);

insert into public.projects
  (slug, title, tagline, description, tech_stack, live_url, repo_url, status, featured, published, sort_order)
values
  (
    'shopmoda',
    'Shopmoda',
    'A live marketplace for second-hand fashion in Nigeria.',
    E'Shopmoda lets sellers list pre-owned clothing and buyers check out in a few taps. Built the storefront, seller dashboard, Paystack payments, Prembly NIN verification, and an offer/escrow flow that releases funds on delivery confirmation.\n\nNine API endpoints, role-based access, and a cron job that releases held funds automatically.',
    array['Next.js','TypeScript','PostgreSQL','Paystack','Prembly','Vercel'],
    'https://shopmoda.vercel.app',
    null,
    'live',
    true,
    true,
    1
  ),
  (
    'handoff',
    'Handoff',
    'Courier dispatch and delivery tracking for small logistics teams.',
    E'A dispatch platform that connects senders, riders, and operations in one place. Riders get assignments on their phones, customers track parcels with a code, and ops see every order on a live board.\n\nBuilt the order lifecycle, rider assignment, status tracking, and the admin console.',
    array['Next.js','TypeScript','PostgreSQL','Prisma','Docker','Vercel'],
    'https://handoff-courier.vercel.app',
    null,
    'live',
    true,
    true,
    2
  ),
  (
    'openschool-erp',
    'OpenSchool ERP',
    'School operations in one place — students, staff, fees, and results.',
    E'A multi-tenant school management system built as a monorepo. Covers admissions, student records, staff roles, fee tracking, and results.\n\nDelivered role-based access control with a full audit trail, plus a typed API shared across the admin and parent-facing apps.',
    array['Next.js','TypeScript','PostgreSQL','Monorepo','Tailwind CSS','RBAC'],
    null,
    'https://github.com/Aiyebolataye/openschool-erp',
    'in-development',
    true,
    true,
    3
  ),
  (
    'campus-depo',
    'Campus Depo',
    'A student marketplace for buying and selling on campus.',
    E'A Flutter marketplace built for campus life. Students list items, browse by category, and message sellers.\n\nIncludes a Next.js admin dashboard for moderation, listings, and user management.',
    array['Flutter','Firebase','Next.js','TypeScript'],
    'https://admin-dashboard-rho-lake.vercel.app',
    null,
    'in-development',
    true,
    true,
    4
  )
on conflict (slug) do nothing;

insert into public.experience
  (company, role, location, start_date, end_date, current, description, sort_order)
select * from (
  values
    (
      'Legend Internet',
      'Full-Stack Developer',
      'Abuja, Nigeria',
      '2024-01',
      null::text,
      true,
      'Build and maintain a corporate learning platform used by staff across the organisation. Own the product end to end: feature scoping, implementation, release, and support. Also lead development on four products — Shopmoda, Handoff, OpenSchool ERP, and Campus Depo.',
      1
    ),
    (
      'Federal Capital Territory Administration (FCTA)',
      'IT Support Intern',
      'Abuja, Nigeria',
      '2024-01',
      '2024-06',
      false,
      'Supported a 25-person IT team across hardware, network, and end-user issues. Documented recurring faults and fixes, and helped staff get back to work quickly during peak periods.',
      2
    ),
    (
      'Nigerian Building and Road Research Institute (NBRRI)',
      'IT Support Intern',
      'Abuja, Nigeria',
      '2023-01',
      '2023-06',
      false,
      'Worked in a five-person IT team handling system setup, troubleshooting, and day-to-day user support. Kept workstations and shared systems running for research staff.',
      3
    )
) as seed(company, role, location, start_date, end_date, current, description, sort_order)
where not exists (select 1 from public.experience);

insert into public.skills (category, name, sort_order)
select * from (
  values
    ('Frontend', 'React', 1),
    ('Frontend', 'Next.js', 2),
    ('Frontend', 'TypeScript', 3),
    ('Frontend', 'Tailwind CSS', 4),
    ('Backend', 'Node.js', 1),
    ('Backend', 'PostgreSQL', 2),
    ('Backend', 'Supabase', 3),
    ('Backend', 'Prisma', 4),
    ('Backend', 'REST APIs', 5),
    ('Mobile', 'Flutter', 1),
    ('Mobile', 'Firebase', 2),
    ('Tools', 'Git', 1),
    ('Tools', 'Docker', 2),
    ('Tools', 'Vercel', 3),
    ('Tools', 'GitHub Actions', 4)
) as seed(category, name, sort_order)
where not exists (select 1 from public.skills);
