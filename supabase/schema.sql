-- Portfolio schema for Supabase.
-- Run this once in Supabase Dashboard -> SQL Editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  headline text,
  bio text,
  location text,
  email text,
  phone text,
  avatar_url text,
  resume_url text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  availability text,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  tech_stack text[] default '{}',
  live_url text,
  repo_url text,
  cover_image_url text,
  status text not null default 'live'
    check (status in ('live', 'in-development', 'archived')),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  type text not null default 'image' check (type in ('image', 'video')),
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date text not null,
  end_date text,
  current boolean not null default false,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);
create index if not exists projects_published_idx
  on public.projects (published, sort_order);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;
alter table public.page_views enable row level security;

-- Profiles: everyone reads, only signed-in admin writes.
drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles
  for select using (true);

drop policy if exists "profiles admin write" on public.profiles;
create policy "profiles admin write" on public.profiles
  for all to authenticated using (true) with check (true);

-- Projects: public sees published, admin sees and writes everything.
drop policy if exists "projects public read" on public.projects;
create policy "projects public read" on public.projects
  for select using (published = true);

drop policy if exists "projects admin all" on public.projects;
create policy "projects admin all" on public.projects
  for all to authenticated using (true) with check (true);

-- Project media follows the parent project's visibility.
drop policy if exists "project_media public read" on public.project_media;
create policy "project_media public read" on public.project_media
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = project_media.project_id
        and projects.published = true
    )
  );

drop policy if exists "project_media admin all" on public.project_media;
create policy "project_media admin all" on public.project_media
  for all to authenticated using (true) with check (true);

-- Experience and skills are public content.
drop policy if exists "experience public read" on public.experience;
create policy "experience public read" on public.experience
  for select using (true);

drop policy if exists "experience admin all" on public.experience;
create policy "experience admin all" on public.experience
  for all to authenticated using (true) with check (true);

drop policy if exists "skills public read" on public.skills;
create policy "skills public read" on public.skills
  for select using (true);

drop policy if exists "skills admin all" on public.skills;
create policy "skills admin all" on public.skills
  for all to authenticated using (true) with check (true);

-- Messages: anyone may send, only admin may read or delete.
drop policy if exists "messages public insert" on public.messages;
create policy "messages public insert" on public.messages
  for insert to anon, authenticated with check (true);

drop policy if exists "messages admin read" on public.messages;
create policy "messages admin read" on public.messages
  for select to authenticated using (true);

drop policy if exists "messages admin update" on public.messages;
create policy "messages admin update" on public.messages
  for update to authenticated using (true) with check (true);

drop policy if exists "messages admin delete" on public.messages;
create policy "messages admin delete" on public.messages
  for delete to authenticated using (true);

-- Page views: anonymous tracking, admin reads.
drop policy if exists "page_views public insert" on public.page_views;
create policy "page_views public insert" on public.page_views
  for insert to anon, authenticated with check (true);

drop policy if exists "page_views admin read" on public.page_views;
create policy "page_views admin read" on public.page_views
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for images, videos, and the resume
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
