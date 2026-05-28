create table jobs (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid not null references profiles(id),
  title                 text not null,
  description           text not null,
  category              text not null check (category in ('wedding','corporate','event','reel','real_estate','other')),
  location_text         text not null,
  lat                   float8 not null,
  lng                   float8 not null,
  budget_min            int4 not null,
  budget_max            int4 not null,
  shoot_date            date not null,
  shoot_duration_hrs    int4 not null,
  status                text not null default 'open' check (status in ('open','hired','completed','cancelled')),
  hired_professional_id uuid references profiles(id),
  created_at            timestamptz default now()
);