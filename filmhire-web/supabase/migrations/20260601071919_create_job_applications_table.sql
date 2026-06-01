create table public.job_applications (
  id uuid primary key default gen_random_uuid(),

  job_id uuid not null references public.jobs(id) on delete cascade,

  professional_id uuid not null references public.profiles(id) on delete cascade,

  cover_letter text,

  quoted_price numeric,

  status text default 'pending',

  created_at timestamptz default now()
);