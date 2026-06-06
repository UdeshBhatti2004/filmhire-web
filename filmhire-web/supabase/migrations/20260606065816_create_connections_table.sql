create table public.connections (
    id uuid primary key default gen_random_uuid(),

    user_a uuid not null references public.profiles(id) on delete cascade,
    user_b uuid not null references public.profiles(id) on delete cascade,

    created_at timestamptz not null default now(),

    unique(user_a, user_b),

    check (user_a <> user_b)
);