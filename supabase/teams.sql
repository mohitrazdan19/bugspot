-- Corporate teams: a manager creates a team, shares an invite link, and sees members' progress.
-- All access goes through the functions below; the tables have no direct policies.

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.team_members (
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('manager', 'member')),
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);
create index if not exists team_members_user_idx on public.team_members (user_id);
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

create or replace function public.create_team(p_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); t public.teams;
begin
  if uid is null then raise exception 'sign in first'; end if;
  if (select count(*) from teams where owner_id = uid) >= 5 then raise exception 'team limit reached'; end if;
  insert into teams (name, owner_id) values (btrim(p_name), uid) returning * into t;
  insert into team_members (team_id, user_id, email, role)
    values (t.id, uid, coalesce(auth.jwt() ->> 'email', ''), 'manager');
  return jsonb_build_object('id', t.id, 'name', t.name, 'code', t.code);
end $$;

create or replace function public.join_team(p_code text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); t public.teams;
begin
  if uid is null then raise exception 'sign in first'; end if;
  select * into t from teams where code = btrim(p_code);
  if not found then raise exception 'invite not found'; end if;
  if (select count(*) from team_members where team_id = t.id) >= 500 then raise exception 'team is full'; end if;
  insert into team_members (team_id, user_id, email, role)
    values (t.id, uid, coalesce(auth.jwt() ->> 'email', ''), 'member')
    on conflict (team_id, user_id) do nothing;
  return jsonb_build_object('id', t.id, 'name', t.name);
end $$;

-- Teams the caller belongs to. The invite code is returned only to the owner.
create or replace function public.my_teams() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'name', t.name, 'role', m.role,
    'code', case when t.owner_id = auth.uid() then t.code end,
    'members', (select count(*) from team_members x where x.team_id = t.id)
  ) order by t.created_at), '[]'::jsonb)
  from team_members m join teams t on t.id = m.team_id
  where m.user_id = auth.uid();
$$;

-- Owner only: every member with their saved progress.
create or replace function public.team_dashboard(p_team uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from teams where id = p_team and owner_id = auth.uid()) then
    raise exception 'not allowed';
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'user_id', m.user_id, 'email', m.email, 'role', m.role, 'joined', m.joined_at,
      'stars', coalesce(p.data -> 'stars', '{}'::jsonb),
      'streak', coalesce((p.data ->> 'streak')::int, 0),
      'last', p.data ->> 'last',
      'updated', p.updated_at))
    from team_members m left join progress p on p.user_id = m.user_id
    where m.team_id = p_team), '[]'::jsonb);
end $$;

create or replace function public.leave_team(p_team uuid) returns void
language sql security definer set search_path = public as $$
  delete from team_members where team_id = p_team and user_id = auth.uid() and role <> 'manager';
$$;

revoke all on function public.create_team(text), public.join_team(text), public.my_teams(),
  public.team_dashboard(uuid), public.leave_team(uuid) from public, anon;
grant execute on function public.create_team(text), public.join_team(text), public.my_teams(),
  public.team_dashboard(uuid), public.leave_team(uuid) to authenticated;
