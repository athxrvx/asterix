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

-- Seed / upsert current events
insert into public.events (slug, date, title, type, seats, venue, time, summary, details, register_url)
values
  (
    'generative-audio-workshop',
    '03.12',
    'Generative Audio Workshop',
    'WORKSHOP',
    'FULL',
    'Innovation Lab, CSE Block',
    '4:30 PM - 6:30 PM',
    'Hands-on workshop on using diffusion and transformer models for sound generation.',
    '["Intro to generative audio workflows and open source model stacks.","Live demo: text to ambient sound and voice texture transfer.","Mini challenge and peer review at the end of the session."]'::jsonb,
    'https://forms.gle/asterix-audio-workshop'
  ),
  (
    'on-device-llm-build-night',
    '03.18',
    'On-Device LLM Build Night',
    'BUILD SESSION',
    'OPEN',
    'Systems Lab 2, EEC',
    '5:00 PM - 8:00 PM',
    'Build practical local-first LLM prototypes with quantized models and lightweight runtimes.',
    '["Setup session for local inference toolchains.","Build a campus assistant with retrieval and prompt routing.","Performance tuning and deployment discussion."]'::jsonb,
    'https://forms.gle/asterix-build-night'
  ),
  (
    'cybernetics-symposium',
    '04.05',
    'Cybernetics Symposium',
    'TALK',
    'OPEN',
    'Main Seminar Hall',
    '10:00 AM - 1:00 PM',
    'Speaker session on feedback systems, adaptive control, and intelligence in modern products.',
    '["Guest talks from academia and industry practitioners.","Panel discussion on AI safety and system-level reliability.","Open Q&A for student projects."]'::jsonb,
    'https://forms.gle/asterix-symposium'
  ),
  (
    'prompt-engineering-clinic',
    '04.12',
    'Prompt Engineering Clinic',
    'CLINIC',
    'OPEN',
    'Design Studio, CSE',
    '3:00 PM - 5:00 PM',
    'Structured clinic to improve prompt quality, reliability, and evaluation discipline.',
    '["Frameworks for prompt decomposition and constraint writing.","Prompt testing checklists for edge-case handling.","Hands-on review of participant prompts."]'::jsonb,
    'https://forms.gle/asterix-prompt-clinic'
  ),
  (
    'render-realtime-hackathon',
    '04.22',
    'Render/Realtime Hackathon',
    'HACKATHON',
    'OPEN',
    'Tech Arena, EEC',
    '9:00 AM - 6:00 PM',
    'One-day sprint to build realtime AI tools, visual systems, and interactive demos.',
    '["Team formation and challenge briefing in the morning.","Mentor checkpoints through the day.","Final demos and awards in the evening."]'::jsonb,
    'https://forms.gle/asterix-hackathon'
  ),
  (
    'ai-product-demo-day',
    '05.03',
    'AI Product Demo Day',
    'SHOWCASE',
    'LIMITED',
    'Auditorium, EEC',
    '2:00 PM - 5:30 PM',
    'Showcase of student-built AI products with jury feedback and collaboration opportunities.',
    '["Shortlisted teams present working prototypes.","Live feedback from faculty and invited guests.","Networking session and recruitment announcements."]'::jsonb,
    'https://forms.gle/asterix-demo-day'
  )
on conflict (slug)
do update set
  date = excluded.date,
  title = excluded.title,
  type = excluded.type,
  seats = excluded.seats,
  venue = excluded.venue,
  time = excluded.time,
  summary = excluded.summary,
  details = excluded.details,
  register_url = excluded.register_url;

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
