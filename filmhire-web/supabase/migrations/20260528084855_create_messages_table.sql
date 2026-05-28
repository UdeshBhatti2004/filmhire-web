create table messages (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs(id) on delete cascade,
  sender_id   uuid not null references profiles(id),
  receiver_id uuid not null references profiles(id),
  content     text not null,
  read        boolean not null default false,
  created_at  timestamptz default now()
);