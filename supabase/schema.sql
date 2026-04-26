-- Ladder Was a Lie — schema
-- One row per anonymous user, JSON columns for the per-step state.
-- Row-level security ensures every user can only read/write their own row.

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  check_ins jsonb not null default '{}'::jsonb,
  history jsonb not null default '{}'::jsonb,
  reminders jsonb not null default '{}'::jsonb,
  card_order jsonb not null default '[]'::jsonb,
  has_onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

-- Drop old policy if re-running
drop policy if exists "user_state_owner_full_access" on public.user_state;

create policy "user_state_owner_full_access"
  on public.user_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create a user_state row when an auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_state (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Bump updated_at on every update
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_state_touch_updated_at on public.user_state;

create trigger user_state_touch_updated_at
  before update on public.user_state
  for each row
  execute procedure public.touch_updated_at();
