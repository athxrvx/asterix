-- Blogs table: stores metadata + GitHub markdown URL.
create table if not exists public.blogs (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  type text not null,
  date text not null,
  excerpt text not null,
  author text not null,
  read_time text not null,
  cover_image text not null,
  markdown_url text not null,
  created_at timestamptz not null default now()
);

-- Events table: stores listing + detail data + register URL.
create table if not exists public.events (
  id bigint generated always as identity primary key,
  slug text not null unique,
  date text not null,
  title text not null,
  type text not null,
  seats text not null check (seats in ('OPEN', 'FULL', 'LIMITED')),
  venue text not null,
  time text not null,
  summary text not null,
  details jsonb not null default '[]'::jsonb,
  register_url text not null,
  created_at timestamptz not null default now()
);

-- Projects table: stores project card/ticker content.
create table if not exists public.projects (
  id bigint generated always as identity primary key,
  project_name text not null,
  summary text not null,
  github_link text,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists blogs_slug_idx on public.blogs (slug);
create index if not exists events_slug_idx on public.events (slug);
create index if not exists projects_name_idx on public.projects (project_name);
create unique index if not exists projects_project_name_unique_idx on public.projects (project_name);

-- Read access for website users.
alter table public.blogs enable row level security;
alter table public.events enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Public read blogs" on public.blogs;
create policy "Public read blogs"
  on public.blogs
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read events" on public.events;
create policy "Public read events"
  on public.events
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
  on public.projects
  for select
  to anon, authenticated
  using (true);

-- Optional seed rows based on current local project content.
insert into public.projects (project_name, summary, github_link)
values
  ('Garnet', 'Private AI', null),
  ('Garnet Studio', 'Private AI', null),
  ('Sentinel', 'Tracking & Productivity', null),
  ('VivasAI', 'Agricultural AI', null),
  ('Elysium', 'The free alternative', null)
on conflict (project_name)
do update set
  summary = excluded.summary,
  github_link = excluded.github_link;
