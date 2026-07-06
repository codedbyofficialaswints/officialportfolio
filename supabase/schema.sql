-- ============================================================
-- ASWIN PORTFOLIO — Supabase schema
-- Run this once in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- SITE SETTINGS (single row, controls theme/colors/fonts/meta from the admin panel)
create table if not exists site_settings (
  id int primary key default 1,
  site_name text not null default 'Aswin T.',
  tagline text not null default 'Design systems. Automate everything.',
  role_label text not null default 'Graphic Designer & AI Systems Builder',
  location text not null default 'India',
  timezone text not null default 'Asia/Kolkata',
  availability text not null default 'Open for select projects',
  instagram_url text not null default 'https://www.instagram.com/officialaswints',
  contact_email text default '',
  about_bio text not null default 'I''m Aswin T., a graphic designer by profession, and a builder of AI systems on the side — prompt engineering, automations, and advanced web experiences like this one.

I care about work that looks considered and behaves intelligently: identity systems that hold up at any scale, and software that removes the busywork so the creative work gets more room to breathe.',
  colors jsonb not null default '{
    "ink": "#121214",
    "paper": "#EAE7E0",
    "cobalt": "#2454FF",
    "coral": "#FF5A36",
    "line": "#D8D4C9",
    "muted": "#6B685F"
  }'::jsonb,
  fonts jsonb not null default '{
    "display": "Fraunces",
    "body": "Inter",
    "mono": "JetBrains Mono"
  }'::jsonb,
  layout jsonb not null default '{
    "heroStyle": "grid-distort",
    "projectListStyle": "editorial-rows",
    "radius": "0px"
  }'::jsonb,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- CATEGORIES (used for both projects and articles)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  kind text not null check (kind in ('project','article')),
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- PROJECTS (portfolio items)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text default '',
  description text default '',
  cover_image_url text default '',
  gallery jsonb not null default '[]'::jsonb,
  category_id uuid references categories(id) on delete set null,
  tags text[] not null default '{}',
  year int,
  client text default '',
  role text default '',
  link_url text default '',
  featured boolean not null default false,
  grid_size text not null default '1x1' check (grid_size in ('1x1','2x1','1x2','2x2')),
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ARTICLES (blog / log entries)
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text default '',
  cover_image_url text default '',
  category_id uuid references categories(id) on delete set null,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) visitors can only read PUBLISHED content.
-- Any authenticated user (you, logged in via Supabase Auth) has full control.
-- Only create ONE auth user for yourself in Supabase Dashboard > Authentication.
-- ============================================================

alter table site_settings enable row level security;
alter table categories enable row level security;
alter table projects enable row level security;
alter table articles enable row level security;

create policy "public read settings" on site_settings for select using (true);
create policy "admin write settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published projects" on projects for select using (status = 'published' or auth.role() = 'authenticated');
create policy "admin write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published articles" on articles for select using (status = 'published' or auth.role() = 'authenticated');
create policy "admin write articles" on articles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- STORAGE: create a public bucket called "media" from the Supabase Dashboard
-- (Storage > New bucket > name: media > Public bucket: ON)
-- This is used for uploading cover images / gallery images from the admin panel.
