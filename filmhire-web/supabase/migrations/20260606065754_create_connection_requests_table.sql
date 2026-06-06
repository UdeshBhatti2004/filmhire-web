create table public.connection_requests (
    id uuid primary key default gen_random_uuid(),

    sender_id uuid not null references public.profiles(id) on delete cascade,
    receiver_id uuid not null references public.profiles(id) on delete cascade,

    status text not null default 'pending'
        check (status in ('pending', 'accepted', 'rejected')),

    created_at timestamptz not null default now(),

    unique(sender_id, receiver_id),

    check (sender_id <> receiver_id)
);