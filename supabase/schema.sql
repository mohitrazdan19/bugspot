-- Bugspot progress sync. One row per signed-in player; each player can only read and write their own row.
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "own row: read" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "own row: insert" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own row: update" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
