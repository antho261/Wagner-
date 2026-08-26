-- =========================================
-- FJKM Wagner Paris — mise en service Supabase
-- =========================================
-- À coller dans : Supabase → SQL Editor → New query → Run
-- Puis créer les comptes admin dans Authentication → Users.
-- =========================================

-- ── Table des photos ──
-- Une ligne par emplacement du site. La clé correspond à
-- l'attribut data-photo-key dans le HTML (39 clés au total).
create table if not exists public.photos (
  key        text primary key,
  url        text not null,
  alt        text,
  updated_at timestamptz not null default now()
);

-- ── Sécurité : lecture publique, écriture authentifiée ──
alter table public.photos enable row level security;

-- Les visiteurs du site (clé anon, non connectés) peuvent lire.
drop policy if exists "photos_lecture_publique" on public.photos;
create policy "photos_lecture_publique"
  on public.photos for select
  to anon, authenticated
  using (true);

-- Seuls les comptes connectés (panneau d'admin) peuvent écrire.
drop policy if exists "photos_ecriture_authentifiee" on public.photos;
create policy "photos_ecriture_authentifiee"
  on public.photos for all
  to authenticated
  using (true)
  with check (true);

-- ── Bucket de stockage des fichiers ──
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

-- Lecture publique des fichiers du bucket.
drop policy if exists "storage_photos_lecture" on storage.objects;
create policy "storage_photos_lecture"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photos');

-- Envoi, remplacement et suppression réservés aux comptes connectés.
drop policy if exists "storage_photos_ecriture" on storage.objects;
create policy "storage_photos_ecriture"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'photos')
  with check (bucket_id = 'photos');

-- ── Vérification ──
-- select * from public.photos;
