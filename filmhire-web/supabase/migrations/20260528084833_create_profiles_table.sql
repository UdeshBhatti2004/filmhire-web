create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  role          text not null check (role in ('client','professional')),
  avatar_url    text,
  city          text,
  state         text,
  lat           float8,
  lng           float8,
  bio           text check (char_length(bio) <= 300),
  specializations text[] default '{}',
  avg_rating    float4 default 0,
  total_reviews int4 default 0,
  push_token    text,
  created_at    timestamptz default now()
);