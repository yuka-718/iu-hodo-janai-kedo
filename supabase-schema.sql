create extension if not exists pgcrypto with schema extensions;

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  room_token uuid,
  visibility text not null check (visibility in ('public', 'limited')),
  author text not null default '' check (char_length(author) <= 12),
  category text not null check (char_length(category) between 1 and 24),
  teaser text not null check (char_length(teaser) between 1 and 42),
  message text not null check (char_length(message) between 1 and 100),
  answer text not null check (char_length(answer) between 2 and 8),
  hint text not null default '' check (char_length(hint) <= 36),
  puzzle text not null check (puzzle in ('shift', 'reverse', 'morse', 'unicode')),
  theme text not null check (theme in ('plum', 'green', 'blue', 'orange')),
  client_hash text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  check (
    (visibility = 'public' and room_token is null)
    or (visibility = 'limited' and room_token is not null)
  )
);

create index if not exists cards_public_created_at_idx
  on public.cards (created_at desc)
  where visibility = 'public' and is_hidden = false;

create index if not exists cards_room_token_idx
  on public.cards (room_token, created_at)
  where visibility = 'limited' and is_hidden = false;

create index if not exists cards_client_rate_idx
  on public.cards (client_hash, created_at desc);

alter table public.cards enable row level security;
revoke all on table public.cards from anon, authenticated;

create or replace function public.create_card(
  p_visibility text,
  p_room_token uuid,
  p_author text,
  p_category text,
  p_teaser text,
  p_message text,
  p_answer text,
  p_hint text,
  p_puzzle text,
  p_theme text,
  p_client_token text
)
returns table (id uuid, room_token uuid)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_room_token uuid;
  v_client_hash text;
begin
  if p_visibility not in ('public', 'limited') then
    raise exception 'invalid visibility';
  end if;

  if p_puzzle not in ('shift', 'reverse', 'morse', 'unicode') then
    raise exception 'invalid puzzle';
  end if;

  if p_theme not in ('plum', 'green', 'blue', 'orange') then
    raise exception 'invalid theme';
  end if;

  if char_length(trim(coalesce(p_message, ''))) not between 1 and 100
    or char_length(trim(coalesce(p_answer, ''))) not between 2 and 8
    or char_length(trim(coalesce(p_category, ''))) not between 1 and 24
    or char_length(trim(coalesce(p_teaser, ''))) not between 1 and 42
    or char_length(coalesce(p_author, '')) > 12
    or char_length(coalesce(p_hint, '')) > 36 then
    raise exception 'invalid card length';
  end if;

  if trim(p_answer) !~ '^[ぁ-ゖa-z0-9]+$' then
    raise exception 'invalid answer characters';
  end if;

  if char_length(coalesce(p_client_token, '')) not between 20 and 200 then
    raise exception 'invalid client token';
  end if;

  v_client_hash := encode(digest(p_client_token, 'sha256'), 'hex');
  if (
    select count(*)
    from public.cards
    where client_hash = v_client_hash
      and created_at > now() - interval '1 hour'
  ) >= 12 then
    raise exception 'rate limit exceeded';
  end if;

  if p_visibility = 'limited' then
    v_room_token := coalesce(p_room_token, gen_random_uuid());
    if (
      select count(*)
      from public.cards
      where cards.room_token = v_room_token
        and visibility = 'limited'
        and is_hidden = false
    ) >= 8 then
      raise exception 'room is full';
    end if;
  else
    v_room_token := null;
  end if;

  return query
  insert into public.cards (
    room_token,
    visibility,
    author,
    category,
    teaser,
    message,
    answer,
    hint,
    puzzle,
    theme,
    client_hash
  ) values (
    v_room_token,
    p_visibility,
    trim(coalesce(p_author, '')),
    trim(p_category),
    trim(p_teaser),
    trim(p_message),
    trim(p_answer),
    trim(coalesce(p_hint, '')),
    p_puzzle,
    p_theme,
    v_client_hash
  )
  returning cards.id, cards.room_token;
end;
$$;

create or replace function public.get_public_cards()
returns table (
  id uuid,
  author text,
  category text,
  teaser text,
  message text,
  answer text,
  hint text,
  puzzle text,
  theme text,
  visibility text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    cards.id,
    cards.author,
    cards.category,
    cards.teaser,
    cards.message,
    cards.answer,
    cards.hint,
    cards.puzzle,
    cards.theme,
    cards.visibility,
    cards.created_at
  from public.cards
  where cards.visibility = 'public'
    and cards.is_hidden = false
  order by cards.created_at desc
  limit 50;
$$;

create or replace function public.get_room_cards(p_room_token uuid)
returns table (
  id uuid,
  room_token uuid,
  author text,
  category text,
  teaser text,
  message text,
  answer text,
  hint text,
  puzzle text,
  theme text,
  visibility text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    cards.id,
    cards.room_token,
    cards.author,
    cards.category,
    cards.teaser,
    cards.message,
    cards.answer,
    cards.hint,
    cards.puzzle,
    cards.theme,
    cards.visibility,
    cards.created_at
  from public.cards
  where cards.visibility = 'limited'
    and cards.room_token = p_room_token
    and cards.is_hidden = false
  order by cards.created_at asc
  limit 8;
$$;

create or replace function public.get_card(p_card_id uuid)
returns table (
  id uuid,
  author text,
  category text,
  teaser text,
  message text,
  answer text,
  hint text,
  puzzle text,
  theme text,
  visibility text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    cards.id,
    cards.author,
    cards.category,
    cards.teaser,
    cards.message,
    cards.answer,
    cards.hint,
    cards.puzzle,
    cards.theme,
    cards.visibility,
    cards.created_at
  from public.cards
  where cards.id = p_card_id
    and cards.visibility = 'public'
    and cards.is_hidden = false
  limit 1;
$$;

revoke all on function public.create_card(text, uuid, text, text, text, text, text, text, text, text, text) from public;
revoke all on function public.get_public_cards() from public;
revoke all on function public.get_room_cards(uuid) from public;
revoke all on function public.get_card(uuid) from public;

grant execute on function public.create_card(text, uuid, text, text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_public_cards() to anon, authenticated;
grant execute on function public.get_room_cards(uuid) to anon, authenticated;
grant execute on function public.get_card(uuid) to anon, authenticated;

alter table public.cards
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.get_public_cards_v2(p_client_token text)
returns table (
  id uuid,
  author text,
  category text,
  teaser text,
  message text,
  answer text,
  hint text,
  puzzle text,
  theme text,
  visibility text,
  created_at timestamptz,
  updated_at timestamptz,
  is_owner boolean
)
language sql
security definer
stable
set search_path = public, extensions, pg_temp
as $$
  select
    cards.id,
    cards.author,
    cards.category,
    cards.teaser,
    cards.message,
    cards.answer,
    cards.hint,
    cards.puzzle,
    cards.theme,
    cards.visibility,
    cards.created_at,
    cards.updated_at,
    case
      when char_length(coalesce(p_client_token, '')) between 20 and 200
        then cards.client_hash = encode(digest(p_client_token, 'sha256'), 'hex')
      else false
    end as is_owner
  from public.cards
  where cards.visibility = 'public'
    and cards.is_hidden = false
  order by cards.created_at desc
  limit 50;
$$;

create or replace function public.get_room_cards_v2(p_room_token uuid, p_client_token text)
returns table (
  id uuid,
  room_token uuid,
  author text,
  category text,
  teaser text,
  message text,
  answer text,
  hint text,
  puzzle text,
  theme text,
  visibility text,
  created_at timestamptz,
  updated_at timestamptz,
  is_owner boolean
)
language sql
security definer
stable
set search_path = public, extensions, pg_temp
as $$
  select
    cards.id,
    cards.room_token,
    cards.author,
    cards.category,
    cards.teaser,
    cards.message,
    cards.answer,
    cards.hint,
    cards.puzzle,
    cards.theme,
    cards.visibility,
    cards.created_at,
    cards.updated_at,
    case
      when char_length(coalesce(p_client_token, '')) between 20 and 200
        then cards.client_hash = encode(digest(p_client_token, 'sha256'), 'hex')
      else false
    end as is_owner
  from public.cards
  where cards.visibility = 'limited'
    and cards.room_token = p_room_token
    and cards.is_hidden = false
  order by cards.created_at asc
  limit 8;
$$;

create or replace function public.get_card_v2(p_card_id uuid, p_client_token text)
returns table (
  id uuid,
  author text,
  category text,
  teaser text,
  message text,
  answer text,
  hint text,
  puzzle text,
  theme text,
  visibility text,
  created_at timestamptz,
  updated_at timestamptz,
  is_owner boolean
)
language sql
security definer
stable
set search_path = public, extensions, pg_temp
as $$
  select
    cards.id,
    cards.author,
    cards.category,
    cards.teaser,
    cards.message,
    cards.answer,
    cards.hint,
    cards.puzzle,
    cards.theme,
    cards.visibility,
    cards.created_at,
    cards.updated_at,
    case
      when char_length(coalesce(p_client_token, '')) between 20 and 200
        then cards.client_hash = encode(digest(p_client_token, 'sha256'), 'hex')
      else false
    end as is_owner
  from public.cards
  where cards.id = p_card_id
    and cards.visibility = 'public'
    and cards.is_hidden = false
  limit 1;
$$;

create or replace function public.update_card(
  p_card_id uuid,
  p_author text,
  p_category text,
  p_teaser text,
  p_message text,
  p_answer text,
  p_hint text,
  p_puzzle text,
  p_theme text,
  p_client_token text
)
returns table (id uuid, room_token uuid, visibility text, updated_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_client_hash text;
begin
  if p_puzzle not in ('shift', 'reverse', 'morse', 'unicode') then
    raise exception 'invalid puzzle';
  end if;

  if p_theme not in ('plum', 'green', 'blue', 'orange') then
    raise exception 'invalid theme';
  end if;

  if char_length(trim(coalesce(p_message, ''))) not between 1 and 100
    or char_length(trim(coalesce(p_answer, ''))) not between 2 and 8
    or char_length(trim(coalesce(p_category, ''))) not between 1 and 24
    or char_length(trim(coalesce(p_teaser, ''))) not between 1 and 42
    or char_length(coalesce(p_author, '')) > 12
    or char_length(coalesce(p_hint, '')) > 36 then
    raise exception 'invalid card length';
  end if;

  if trim(p_answer) !~ '^[ぁ-ゖa-z0-9]+$' then
    raise exception 'invalid answer characters';
  end if;

  if char_length(coalesce(p_client_token, '')) not between 20 and 200 then
    raise exception 'invalid client token';
  end if;

  v_client_hash := encode(digest(p_client_token, 'sha256'), 'hex');

  return query
  update public.cards
  set
    author = trim(coalesce(p_author, '')),
    category = trim(p_category),
    teaser = trim(p_teaser),
    message = trim(p_message),
    answer = trim(p_answer),
    hint = trim(coalesce(p_hint, '')),
    puzzle = p_puzzle,
    theme = p_theme,
    updated_at = now()
  where cards.id = p_card_id
    and cards.client_hash = v_client_hash
    and cards.is_hidden = false
  returning cards.id, cards.room_token, cards.visibility, cards.updated_at;

  if not found then
    raise exception 'not card owner';
  end if;
end;
$$;

create or replace function public.delete_card(p_card_id uuid, p_client_token text)
returns table (id uuid, room_token uuid, visibility text)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_client_hash text;
begin
  if char_length(coalesce(p_client_token, '')) not between 20 and 200 then
    raise exception 'invalid client token';
  end if;

  v_client_hash := encode(digest(p_client_token, 'sha256'), 'hex');

  return query
  delete from public.cards
  where cards.id = p_card_id
    and cards.client_hash = v_client_hash
  returning cards.id, cards.room_token, cards.visibility;

  if not found then
    raise exception 'not card owner';
  end if;
end;
$$;

revoke all on function public.get_public_cards_v2(text) from public;
revoke all on function public.get_room_cards_v2(uuid, text) from public;
revoke all on function public.get_card_v2(uuid, text) from public;
revoke all on function public.update_card(uuid, text, text, text, text, text, text, text, text, text) from public;
revoke all on function public.delete_card(uuid, text) from public;

grant execute on function public.get_public_cards_v2(text) to anon, authenticated;
grant execute on function public.get_room_cards_v2(uuid, text) to anon, authenticated;
grant execute on function public.get_card_v2(uuid, text) to anon, authenticated;
grant execute on function public.update_card(uuid, text, text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.delete_card(uuid, text) to anon, authenticated;

create table if not exists public.rooms (
  token uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 24),
  client_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rooms enable row level security;
revoke all on table public.rooms from anon, authenticated;

insert into public.rooms (token, name, client_hash, created_at, updated_at)
select
  cards.room_token,
  'なかまの部屋',
  (array_agg(cards.client_hash order by cards.created_at asc))[1],
  min(cards.created_at),
  max(cards.updated_at)
from public.cards
where cards.visibility = 'limited'
  and cards.room_token is not null
group by cards.room_token
on conflict (token) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cards_room_token_fkey'
      and conrelid = 'public.cards'::regclass
  ) then
    alter table public.cards
      add constraint cards_room_token_fkey
      foreign key (room_token) references public.rooms(token) on delete cascade;
  end if;
end;
$$;

create or replace function public.create_card_v2(
  p_visibility text,
  p_room_token uuid,
  p_room_name text,
  p_author text,
  p_category text,
  p_teaser text,
  p_message text,
  p_answer text,
  p_hint text,
  p_puzzle text,
  p_theme text,
  p_client_token text
)
returns table (id uuid, room_token uuid)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_room_token uuid;
  v_room_name text;
  v_client_hash text;
begin
  if p_visibility not in ('public', 'limited') then
    raise exception 'invalid visibility';
  end if;

  if p_puzzle not in ('shift', 'reverse', 'morse', 'unicode') then
    raise exception 'invalid puzzle';
  end if;

  if p_theme not in ('plum', 'green', 'blue', 'orange') then
    raise exception 'invalid theme';
  end if;

  if char_length(trim(coalesce(p_message, ''))) not between 1 and 100
    or char_length(trim(coalesce(p_answer, ''))) not between 2 and 8
    or char_length(trim(coalesce(p_category, ''))) not between 1 and 24
    or char_length(trim(coalesce(p_teaser, ''))) not between 1 and 42
    or char_length(coalesce(p_author, '')) > 12
    or char_length(coalesce(p_hint, '')) > 36 then
    raise exception 'invalid card length';
  end if;

  if trim(p_answer) !~ '^[ぁ-ゖa-z0-9]+$' then
    raise exception 'invalid answer characters';
  end if;

  if char_length(coalesce(p_client_token, '')) not between 20 and 200 then
    raise exception 'invalid client token';
  end if;

  v_client_hash := encode(digest(p_client_token, 'sha256'), 'hex');
  if (
    select count(*)
    from public.cards
    where client_hash = v_client_hash
      and created_at > now() - interval '1 hour'
  ) >= 12 then
    raise exception 'rate limit exceeded';
  end if;

  if p_visibility = 'limited' then
    if p_room_token is null then
      v_room_name := trim(coalesce(p_room_name, ''));
      if char_length(v_room_name) not between 1 and 24 then
        raise exception 'invalid room name';
      end if;
      insert into public.rooms (name, client_hash)
      values (v_room_name, v_client_hash)
      returning rooms.token into v_room_token;
    else
      v_room_token := p_room_token;
      if not exists (select 1 from public.rooms where rooms.token = v_room_token) then
        raise exception 'room not found';
      end if;
    end if;

    if (
      select count(*)
      from public.cards
      where cards.room_token = v_room_token
        and visibility = 'limited'
        and is_hidden = false
    ) >= 8 then
      raise exception 'room is full';
    end if;
  else
    v_room_token := null;
  end if;

  return query
  insert into public.cards (
    room_token,
    visibility,
    author,
    category,
    teaser,
    message,
    answer,
    hint,
    puzzle,
    theme,
    client_hash
  ) values (
    v_room_token,
    p_visibility,
    trim(coalesce(p_author, '')),
    trim(p_category),
    trim(p_teaser),
    trim(p_message),
    trim(p_answer),
    trim(coalesce(p_hint, '')),
    p_puzzle,
    p_theme,
    v_client_hash
  )
  returning cards.id, cards.room_token;
end;
$$;

create or replace function public.create_card(
  p_visibility text,
  p_room_token uuid,
  p_author text,
  p_category text,
  p_teaser text,
  p_message text,
  p_answer text,
  p_hint text,
  p_puzzle text,
  p_theme text,
  p_client_token text
)
returns table (id uuid, room_token uuid)
language sql
security definer
set search_path = public, pg_temp
as $$
  select created.id, created.room_token
  from public.create_card_v2(
    p_visibility,
    p_room_token,
    'なかまの部屋',
    p_author,
    p_category,
    p_teaser,
    p_message,
    p_answer,
    p_hint,
    p_puzzle,
    p_theme,
    p_client_token
  ) as created;
$$;

create or replace function public.get_room_info(p_room_token uuid, p_client_token text)
returns table (
  room_token uuid,
  room_name text,
  card_count bigint,
  is_owner boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
stable
set search_path = public, extensions, pg_temp
as $$
  select
    rooms.token,
    rooms.name,
    count(cards.id) filter (where cards.is_hidden = false),
    case
      when char_length(coalesce(p_client_token, '')) between 20 and 200
        then rooms.client_hash = encode(digest(p_client_token, 'sha256'), 'hex')
      else false
    end,
    rooms.created_at,
    rooms.updated_at
  from public.rooms
  left join public.cards on cards.room_token = rooms.token
  where rooms.token = p_room_token
  group by rooms.token, rooms.name, rooms.client_hash, rooms.created_at, rooms.updated_at;
$$;

create or replace function public.update_room_name(p_room_token uuid, p_room_name text, p_client_token text)
returns table (room_token uuid, room_name text, updated_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_client_hash text;
begin
  if char_length(trim(coalesce(p_room_name, ''))) not between 1 and 24 then
    raise exception 'invalid room name';
  end if;
  if char_length(coalesce(p_client_token, '')) not between 20 and 200 then
    raise exception 'invalid client token';
  end if;

  v_client_hash := encode(digest(p_client_token, 'sha256'), 'hex');
  return query
  update public.rooms
  set name = trim(p_room_name), updated_at = now()
  where rooms.token = p_room_token
    and rooms.client_hash = v_client_hash
  returning rooms.token, rooms.name, rooms.updated_at;

  if not found then
    raise exception 'not room owner';
  end if;
end;
$$;

create or replace function public.delete_room(p_room_token uuid, p_client_token text)
returns table (room_token uuid)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_client_hash text;
begin
  if char_length(coalesce(p_client_token, '')) not between 20 and 200 then
    raise exception 'invalid client token';
  end if;

  v_client_hash := encode(digest(p_client_token, 'sha256'), 'hex');
  return query
  delete from public.rooms
  where rooms.token = p_room_token
    and rooms.client_hash = v_client_hash
  returning rooms.token;

  if not found then
    raise exception 'not room owner';
  end if;
end;
$$;

revoke all on function public.create_card_v2(text, uuid, text, text, text, text, text, text, text, text, text, text) from public;
revoke all on function public.get_room_info(uuid, text) from public;
revoke all on function public.update_room_name(uuid, text, text) from public;
revoke all on function public.delete_room(uuid, text) from public;

grant execute on function public.create_card_v2(text, uuid, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_room_info(uuid, text) to anon, authenticated;
grant execute on function public.update_room_name(uuid, text, text) to anon, authenticated;
grant execute on function public.delete_room(uuid, text) to anon, authenticated;

notify pgrst, 'reload schema';
