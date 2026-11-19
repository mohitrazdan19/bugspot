-- Admin panel v2 (QuizzifyTech). Run once in the Supabase SQL editor, after analytics.sql.
-- Adds: hiding the owner's own visits, Today's Quiz vs Practice, returning visitors, funnel.
-- Safe to run more than once.

-- 1. Visitors to leave out of every admin number (the owner's own browsers).
create table if not exists public.admin_ignored_visitors (
  visitor text primary key,
  added_at timestamptz not null default now()
);
alter table public.admin_ignored_visitors enable row level security;
-- No policies: only the functions below read or change it.

-- The owner's browser from the old github.io address (visitor id starting 57ab4163).
insert into public.admin_ignored_visitors (visitor)
  select distinct visitor from public.analytics_events where visitor like '57ab4163%'
  on conflict do nothing;

-- "Hide my visits" button on the admin page: adds this browser's visitor id.
create or replace function public.admin_ignore_visitor(v text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if v is null or char_length(v) not between 8 and 64 then return false; end if;
  insert into admin_ignored_visitors (visitor) values (v) on conflict do nothing;
  return true;
end $$;
revoke all on function public.admin_ignore_visitor(text) from public, anon;
grant execute on function public.admin_ignore_visitor(text) to authenticated;

-- 2. Stats, now without ignored visitors, plus modes, returning visitors and funnel.
create or replace function public.admin_stats(days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare d int := least(greatest(coalesce(days, 30), 0), 365); res jsonb; cutoff timestamptz;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  -- days = 0 means today only (since midnight, India time)
  cutoff := case when d = 0 then date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata' else now() - make_interval(days => d) end;

  with ev as (
    select * from analytics_events a
    where not exists (select 1 from admin_ignored_visitors i where i.visitor = a.visitor)
  ),
  rng as (select * from ev where created_at >= cutoff),
  -- each visitor seen in the range, and on how many different days they ever visited
  vis as (
    select r.visitor,
      (select count(distinct (e.created_at at time zone 'Asia/Kolkata')::date) from ev e where e.visitor = r.visitor and e.event = 'visit') as days_seen,
      (select min(e.created_at) from ev e where e.visitor = r.visitor) as first_seen
    from (select distinct visitor from rng where event = 'visit') r
  )
  select jsonb_build_object(
    'days', d,
    'visitors', (select count(*) from vis),
    'visits', (select count(*) from rng where event = 'visit'),
    'visitors_today', (select count(distinct visitor) from ev where event = 'visit' and (created_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date),
    'new_visitors', (select count(*) from vis where first_seen >= cutoff),
    'returning', (select count(*) from vis where days_seen >= 2),
    'ignored', (select count(*) from admin_ignored_visitors),
    'accounts', (select count(*) from auth.users),
    'events', coalesce((select jsonb_object_agg(event, n) from (
        select event, count(*) n from rng group by event) e), '{}'::jsonb),
    'funnel', jsonb_build_object(
        'visited', (select count(*) from vis),
        'started', (select count(distinct visitor) from rng where event = 'puzzle_start'),
        'found', (select count(distinct visitor) from rng where event = 'puzzle_found'),
        'shared', (select count(distinct visitor) from rng where event = 'share')),
    'modes', coalesce((select jsonb_object_agg(mode, jsonb_build_object('started', s, 'found', f, 'failed', x, 'players', p)) from (
        select props ->> 'mode' as mode,
          count(*) filter (where event = 'puzzle_start') s,
          count(*) filter (where event = 'puzzle_found') f,
          count(*) filter (where event = 'puzzle_fail') x,
          count(distinct visitor) filter (where event = 'puzzle_start') p
        from rng where event in ('puzzle_start','puzzle_found','puzzle_fail') and props ->> 'mode' in ('daily','practice')
        group by 1) m), '{}'::jsonb),
    'daily', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'visitors', visitors, 'visits', visits) order by day) from (
        select (created_at at time zone 'Asia/Kolkata')::date as day, count(distinct visitor) visitors, count(*) visits
        from rng where event = 'visit' group by 1) x), '[]'::jsonb),
    'referrers', coalesce((select jsonb_agg(jsonb_build_object('ref', ref, 'n', n)) from (
        select coalesce(nullif(ref, ''), 'Direct') as ref, count(*) n from rng
        where event = 'visit' group by 1 order by 2 desc limit 10) r), '[]'::jsonb),
    'puzzles', coalesce((select jsonb_agg(jsonb_build_object('id', pid, 'started', n_start, 'found', n_found, 'failed', n_fail)) from (
        select props ->> 'id' as pid,
          count(*) filter (where event = 'puzzle_start') n_start,
          count(*) filter (where event = 'puzzle_found') n_found,
          count(*) filter (where event = 'puzzle_fail') n_fail
        from rng where event in ('puzzle_start','puzzle_found','puzzle_fail') and props ? 'id'
        group by 1 order by 4 desc, 2 desc limit 10) p), '[]'::jsonb)
  ) into res;
  return res;
end $$;
revoke all on function public.admin_stats(int) from public, anon;
grant execute on function public.admin_stats(int) to authenticated;
