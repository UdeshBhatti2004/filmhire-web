create table bids (
  id               uuid primary key default gen_random_uuid(),
  job_id           uuid not null references jobs(id) on delete cascade,
  professional_id  uuid not null references profiles(id),
  cover_note       text not null,
  proposed_price   int4 not null,
  status           text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at       timestamptz default now(),
  unique(job_id, professional_id)
);