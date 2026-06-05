create table public.typing_status (
  workspace_id uuid not null,
  user_id uuid not null,
  is_typing boolean default false,
  updated_at timestamptz default now(),

  primary key (workspace_id, user_id)
);