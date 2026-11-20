-- Admin panel v4: where visitors come from, grouped (WhatsApp, LinkedIn, X, Google...).
-- WhatsApp sends no referrer, so it shows only for links tagged ?src=whatsapp (the site's share buttons do this).
-- Run once in the Supabase SQL editor, after admin-v3.sql. Safe to run again.
create or replace function public.admin_stats_between(t0 timestamptz, t1 timestamptz, d int) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare res jsonb; cutoff timestamptz := t0;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;

  with ev as (
    select * from analytics_events a
    where not exists (select 1 from admin_ignored_visitors i where i.visitor = a.visitor)
  ),
  rng as (select * from ev where created_at >= t0 and created_at < t1),
  -- each visitor seen in the range, and on how many different days they ever visited
  vis as (
    select r.visitor,
      (select count(distinct (e.created_at at time zone 'Asia/Kolkata')::date) from ev e where e.visitor = r.visitor and e.event = 'visit') as days_seen,
      (select min(e.created_at) from ev e where e.visitor = r.visitor) as first_seen
    from (select distinct visitor from rng where event = 'visit') r
  )
  select jsonb_build_object(
    'days', d,
    'from', (t0 at time zone 'Asia/Kolkata')::date,
    'to', ((t1 - interval '1 second') at time zone 'Asia/Kolkata')::date,
    'visitors', (select count(*) from vis),
    'visits', (select count(*) from rng where event = 'visit'),
    'visitors_today', (select count(distinct visitor) from ev where event = 'visit' and (created_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date),
    'new_visitors', (select count(*) from vis where first_seen >= cutoff),
    'returning', (select count(*) from vis where days_seen >= 2),
    'played', (select count(distinct visitor) from rng where event in ('puzzle_found','puzzle_fail')),
    'ignored', (select count(*) from admin_ignored_visitors),
    'accounts', (select count(*) from auth.users),
    'events', coalesce((select jsonb_object_agg(event, n) from (
        select event, count(*) n from rng group by event) e), '{}'::jsonb),
    'funnel', jsonb_build_object(
        'visited', (select count(*) from vis),
        'started', (select count(distinct visitor) from rng where event = 'puzzle_start'),
        'played', (select count(distinct visitor) from rng where event in ('puzzle_found','puzzle_fail')),
        'found', (select count(distinct visitor) from rng where event = 'puzzle_found'),
        'shared', (select count(distinct visitor) from rng where event = 'share')),
    'modes', coalesce((select jsonb_object_agg(mode, jsonb_build_object('started', s, 'found', f, 'failed', x, 'players', p)) from (
        select props ->> 'mode' as mode,
          count(*) filter (where event = 'puzzle_start') s,
          count(*) filter (where event = 'puzzle_found') f,
          count(*) filter (where event = 'puzzle_fail') x,
          count(distinct visitor) filter (where event in ('puzzle_found','puzzle_fail')) p
        from rng where event in ('puzzle_start','puzzle_found','puzzle_fail') and props ->> 'mode' in ('daily','practice')
        group by 1) m), '{}'::jsonb),
    'daily', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'visitors', visitors, 'visits', visits) order by day) from (
        select (created_at at time zone 'Asia/Kolkata')::date as day, count(distinct visitor) visitors, count(*) visits
        from rng where event = 'visit' group by 1) x), '[]'::jsonb),
    'referrers', coalesce((select jsonb_agg(jsonb_build_object('ref', ref, 'n', n)) from (
        select coalesce(nullif(ref, ''), 'Direct') as ref, count(*) n from rng
        where event = 'visit' group by 1 order by 2 desc limit 10) r), '[]'::jsonb),
    -- Visitors per source, with known apps and sites grouped under one name.
    'sources', coalesce((select jsonb_agg(jsonb_build_object('source', src, 'visitors', v, 'visits', n) order by v desc, n desc) from (
        select src, count(distinct visitor) v, count(*) n from (
          select visitor, case
            when r = '' then 'Direct / unknown'
            when r like '%whatsapp%' or r in ('wa', 'wa.me') then 'WhatsApp'
            when r like '%linkedin%' or r = 'lnkd.in' then 'LinkedIn'
            when r in ('x', 't.co', 'x.com', 'twitter') or r like '%twitter.com' then 'X (Twitter)'
            when r like '%telegram%' or r in ('t.me', 'tg') then 'Telegram'
            when r like '%reddit%' then 'Reddit'
            when r like '%facebook%' or r in ('fb', 'l.facebook.com') then 'Facebook'
            when r like '%instagram%' or r = 'ig' then 'Instagram'
            when r like '%google.%' or r like 'com.google.%' or r = 'google' then 'Google'
            when r like '%bing.%' or r = 'bing' then 'Bing'
            when r in ('friends', 'friend') then 'Friends (sent by you)'
            when r in ('share', 'copy') then 'Shared result (copied)'
            when r like '%quizzifytech.com' or r like '%github.io' then 'Inside the site'
            else r end as src
          from (select visitor, lower(coalesce(ref, '')) r from rng where event = 'visit') x) y
        group by 1) s), '[]'::jsonb),
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
revoke all on function public.admin_stats_between(timestamptz, timestamptz, int) from public, anon, authenticated;
