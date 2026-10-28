-- Anonymous usage analytics and the owner-only stats function.
-- Run in the Supabase SQL editor (or as a migration). Safe to run once.

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor text not null check (char_length(visitor) between 8 and 64),
  event text not null check (event in
    ('visit','puzzle_start','puzzle_found','puzzle_fail','signin_sent','signin','share','signin_prompt','signin_click')),
  props jsonb check (props is null or pg_column_size(props) < 512),
  ref text check (ref is null or char_length(ref) <= 200)
);
create index if not exists analytics_events_created_idx on public.analytics_events (created_at);
alter table public.analytics_events enable row level security;

-- Anyone may add an event; nobody can read the table directly.
drop policy if exists "anyone can add events" on public.analytics_events;
create policy "anyone can add events" on public.analytics_events
  for insert to anon, authenticated with check (true);

-- Who may open the admin page. No policies: only the functions below read it.
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

create or replace function public.admin_stats(days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare d int := least(greatest(coalesce(days, 30), 0), 365); res jsonb; cutoff timestamptz;
begin
  -- days = 0 means today only (since midnight, India time)
  cutoff := case when d = 0 then date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata' else now() - make_interval(days => d) end;
  if not public.is_admin() then raise exception 'not allowed'; end if;
  select jsonb_build_object(
    'days', d,
    'visitors', (select count(distinct visitor) from analytics_events where event = 'visit' and created_at >= cutoff),
    'visits', (select count(*) from analytics_events where event = 'visit' and created_at >= cutoff),
    'visitors_today', (select count(distinct visitor) from analytics_events where event = 'visit' and (created_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date),
    'accounts', (select count(*) from auth.users),
    'events', coalesce((select jsonb_object_agg(event, n) from (
        select event, count(*) n from analytics_events where created_at >= cutoff group by event) e), '{}'::jsonb),
    'daily', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'visitors', visitors, 'visits', visits) order by day) from (
        select (created_at at time zone 'Asia/Kolkata')::date as day, count(distinct visitor) visitors, count(*) visits
        from analytics_events where event = 'visit' and created_at >= cutoff group by 1) x), '[]'::jsonb),
    'referrers', coalesce((select jsonb_agg(jsonb_build_object('ref', ref, 'n', n)) from (
        select coalesce(nullif(ref, ''), 'Direct') as ref, count(*) n from analytics_events
        where event = 'visit' and created_at >= cutoff group by 1 order by 2 desc limit 10) r), '[]'::jsonb),
    'puzzles', coalesce((select jsonb_agg(jsonb_build_object('id', pid, 'started', n_start, 'found', n_found, 'failed', n_fail)) from (
        select props ->> 'id' as pid,
          count(*) filter (where event = 'puzzle_start') n_start,
          count(*) filter (where event = 'puzzle_found') n_found,
          count(*) filter (where event = 'puzzle_fail') n_fail
        from analytics_events where event in ('puzzle_start','puzzle_found','puzzle_fail') and props ? 'id'
          and created_at >= cutoff
        group by 1 order by 4 desc, 2 desc limit 10) p), '[]'::jsonb)
  ) into res;
  return res;
end $$;

revoke all on function public.is_admin() from public, anon;
revoke all on function public.admin_stats(int) from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.admin_stats(int) to authenticated;

-- Owner-only list of people who signed up (email, name if the sign-in provides one).
create or replace function public.admin_users() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'email', u.email,
      'name', coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), nullif(u.raw_user_meta_data ->> 'name', ''), ''),
      'joined', u.created_at,
      'last_seen', u.last_sign_in_at) order by u.created_at desc)
    from auth.users u), '[]'::jsonb);
end $$;
revoke all on function public.admin_users() from public, anon;
grant execute on function public.admin_users() to authenticated;

-- Sign-up funnel events (added after the first version). Safe to run once on an existing table.
alter table public.analytics_events drop constraint if exists analytics_events_event_check;
alter table public.analytics_events add constraint analytics_events_event_check check (event in
  ('visit','puzzle_start','puzzle_found','puzzle_fail','signin_sent','signin','share','signin_prompt','signin_click'));
