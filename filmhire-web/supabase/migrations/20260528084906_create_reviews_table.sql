create table reviews (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null unique references jobs(id),
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  rating      int2 not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz default now()
);