create table professional_post_comments (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null
    references professional_posts(id)
    on delete cascade,

  user_id uuid not null
    references profiles(id)
    on delete cascade,

  comment text not null,

  created_at timestamptz default now()
);