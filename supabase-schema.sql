-- ================================================================
-- Implementation Team Bingo — Supabase Schema v2
-- Run this entire file in: Supabase → SQL Editor → New Query → Run
-- ================================================================

-- Groups: a named roster of players who play together
create table if not exists groups (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  admin_name  text not null,
  created_at  timestamptz default now()
);

-- Players belong to a group (not to a specific game)
-- Each player's UUID IS their invite token — embedded in their personal link
create table if not exists players (
  id        uuid default gen_random_uuid() primary key,
  group_id  uuid references groups(id) on delete cascade,
  name      text not null,
  color     text not null,
  joined_at timestamptz default now()
);

-- Games belong to a group — multiple games per group allowed
create table if not exists games (
  id           uuid default gen_random_uuid() primary key,
  group_id     uuid references groups(id) on delete cascade,
  name         text not null default 'Game 1',
  status       text default 'setup' check (status in ('setup', 'active', 'finished')),
  round_number integer default 1,
  created_at   timestamptz default now()
);

-- Squares belong to a game (24 custom + FREE at position 12)
create table if not exists squares (
  id       uuid default gen_random_uuid() primary key,
  game_id  uuid references games(id) on delete cascade,
  position integer not null check (position >= 0 and position <= 24),
  text     text not null,
  unique(game_id, position)
);

-- Marks: one row per player per square per game
create table if not exists marks (
  id         uuid default gen_random_uuid() primary key,
  game_id    uuid references games(id) on delete cascade,
  player_id  uuid references players(id) on delete cascade,
  position   integer not null check (position >= 0 and position <= 24),
  marked_at  timestamptz default now(),
  unique(player_id, game_id, position)
);

-- Bingo events: fires when a player achieves bingo in a game
create table if not exists bingo_events (
  id          uuid default gen_random_uuid() primary key,
  game_id     uuid references games(id) on delete cascade,
  player_id   uuid references players(id) on delete cascade,
  player_name text not null,
  created_at  timestamptz default now(),
  unique(game_id, player_id)
);

-- ================================================================
-- Row Level Security — open policies (fine for internal tools)
-- ================================================================
alter table groups       enable row level security;
alter table players      enable row level security;
alter table games        enable row level security;
alter table squares      enable row level security;
alter table marks        enable row level security;
alter table bingo_events enable row level security;

create policy "open" on groups       for all using (true) with check (true);
create policy "open" on players      for all using (true) with check (true);
create policy "open" on games        for all using (true) with check (true);
create policy "open" on squares      for all using (true) with check (true);
create policy "open" on marks        for all using (true) with check (true);
create policy "open" on bingo_events for all using (true) with check (true);

-- ================================================================
-- Enable Realtime
-- ================================================================
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table marks;
alter publication supabase_realtime add table bingo_events;
alter publication supabase_realtime add table players;
