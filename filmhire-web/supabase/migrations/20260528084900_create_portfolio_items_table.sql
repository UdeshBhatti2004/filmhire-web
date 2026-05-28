create table portfolio_items (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null references profiles(id) on delete cascade,
  title           text not null,
  thumbnail_url   text not null,
  video_url       text not null,
  category        text,
  display_order   int4 default 0,
  created_at      timestamptz default now()
);