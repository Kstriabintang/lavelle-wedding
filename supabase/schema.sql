-- ============================================================
-- PORTAL UNDANGAN LAVELLE — skema Supabase (Fase 1b)
-- Jalankan SEKALI di Supabase → SQL Editor → paste semua → Run.
-- Aman dijalankan ulang (idempotent: drop policy dulu, create if not exists).
-- ============================================================

-- ---------- PROFIL (peran) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  name text,
  role text not null default 'staff' check (role in ('admin','staff')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Buat profil otomatis saat user daftar
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: apakah user sekarang admin
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- UNDANGAN ----------
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  owner_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published')),
  theme text not null default 'marun-emas',
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.invites enable row level security;
create index if not exists invites_owner_idx on public.invites(owner_id);

-- ---------- BUKU TAMU ----------
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references public.invites(id) on delete cascade,
  guest_token text,
  name text, attendance text, message text, sticker text,
  show boolean default true,
  created_at timestamptz default now()
);
alter table public.guestbook enable row level security;
create index if not exists guestbook_invite_idx on public.guestbook(invite_id);

-- ---------- RSVP ----------
create table if not exists public.rsvp (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references public.invites(id) on delete cascade,
  guest_token text,
  name text, attendance text, guests int default 1,
  created_at timestamptz default now()
);
alter table public.rsvp enable row level security;
create index if not exists rsvp_invite_idx on public.rsvp(invite_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================
-- Profiles
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (id = auth.uid() or public.is_admin());
-- SENGAJA tanpa policy UPDATE profiles dari klien → cegah eskalasi hak
-- (user set role='admin' sendiri). Peran diatur admin via service_role (server).
drop policy if exists "profiles update self" on public.profiles;

-- Invites: published readable oleh siapa saja (renderer publik); draft hanya pemilik/admin
drop policy if exists "invites read" on public.invites;
create policy "invites read" on public.invites for select
  using (status = 'published' or owner_id = auth.uid() or public.is_admin());
drop policy if exists "invites insert" on public.invites;
create policy "invites insert" on public.invites for insert with check (owner_id = auth.uid());
drop policy if exists "invites update" on public.invites;
create policy "invites update" on public.invites for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());
drop policy if exists "invites delete" on public.invites;
create policy "invites delete" on public.invites for delete
  using (owner_id = auth.uid() or public.is_admin());

-- Guestbook: tamu (anon) boleh insert & baca yang ditampilkan; pemilik/admin kelola
drop policy if exists "guestbook read" on public.guestbook;
create policy "guestbook read" on public.guestbook for select
  using (show = true or public.is_admin()
         or exists(select 1 from public.invites i where i.id = invite_id and i.owner_id = auth.uid()));
drop policy if exists "guestbook insert" on public.guestbook;
create policy "guestbook insert" on public.guestbook for insert
  with check (exists(select 1 from public.invites i where i.id = invite_id and i.status = 'published'));
drop policy if exists "guestbook update" on public.guestbook;
create policy "guestbook update" on public.guestbook for update
  using (public.is_admin() or exists(select 1 from public.invites i where i.id = invite_id and i.owner_id = auth.uid()))
  with check (public.is_admin() or exists(select 1 from public.invites i where i.id = invite_id and i.owner_id = auth.uid()));
drop policy if exists "guestbook delete" on public.guestbook;
create policy "guestbook delete" on public.guestbook for delete
  using (public.is_admin() or exists(select 1 from public.invites i where i.id = invite_id and i.owner_id = auth.uid()));

-- RSVP: tamu boleh insert; hanya pemilik/admin baca
drop policy if exists "rsvp insert" on public.rsvp;
create policy "rsvp insert" on public.rsvp for insert
  with check (exists(select 1 from public.invites i where i.id = invite_id and i.status = 'published'));
drop policy if exists "rsvp read" on public.rsvp;
create policy "rsvp read" on public.rsvp for select
  using (public.is_admin() or exists(select 1 from public.invites i where i.id = invite_id and i.owner_id = auth.uid()));

-- ============================================================
-- STORAGE (bucket 'invite-assets' dibuat via API): baca publik, tulis wajib login
-- ============================================================
drop policy if exists "assets public read" on storage.objects;
create policy "assets public read" on storage.objects for select using (bucket_id = 'invite-assets');
drop policy if exists "assets auth insert" on storage.objects;
create policy "assets auth insert" on storage.objects for insert
  with check (bucket_id = 'invite-assets' and auth.role() = 'authenticated');
drop policy if exists "assets auth update" on storage.objects;
create policy "assets auth update" on storage.objects for update
  using (bucket_id = 'invite-assets' and auth.role() = 'authenticated');
drop policy if exists "assets auth delete" on storage.objects;
create policy "assets auth delete" on storage.objects for delete
  using (bucket_id = 'invite-assets' and auth.role() = 'authenticated');
