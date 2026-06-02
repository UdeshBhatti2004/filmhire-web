create table professional_posts (
  id uuid primary key default gen_random_uuid(),

  professional_id uuid not null
    references profiles(id)
    on delete cascade,

  content text not null,

  media_url text,

  tools text[],

  likes_count int default 0,

  comments_count int default 0,

  created_at timestamptz default now()
);