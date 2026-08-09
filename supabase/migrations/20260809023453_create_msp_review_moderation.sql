create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.msp_review_submissions (
  id uuid primary key default gen_random_uuid(),
  member_id integer not null check (member_id > 0),
  msp_slug text not null check (char_length(msp_slug) between 2 and 100),
  msp_name text not null check (char_length(msp_name) between 2 and 120),
  rating smallint not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 8 and 100),
  body text not null check (char_length(body) between 80 and 4000),
  display_name text not null check (char_length(display_name) between 2 and 70),
  email text not null check (char_length(email) between 5 and 254 and position('@' in email) > 1),
  relationship text not null check (relationship in ('constituent', 'family advocate', 'community advocate')),
  interaction_month date,
  firsthand_confirmed boolean not null default false check (firsthand_confirmed),
  publication_permission boolean not null default false check (publication_permission),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderator_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.msp_reviews (
  id uuid primary key,
  member_id integer not null check (member_id > 0),
  msp_slug text not null,
  msp_name text not null,
  rating smallint not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  display_name text not null,
  relationship text not null,
  interaction_month date,
  published_at timestamptz not null,
  updated_at timestamptz not null
);

create index msp_review_submissions_status_created_idx
  on public.msp_review_submissions (status, created_at desc);
create index msp_reviews_member_published_idx
  on public.msp_reviews (member_id, published_at desc);
create index msp_reviews_slug_published_idx
  on public.msp_reviews (msp_slug, published_at desc);

alter table public.msp_review_submissions enable row level security;
alter table public.msp_reviews enable row level security;

create policy "Anyone can submit a pending firsthand review"
on public.msp_review_submissions
for insert
to anon
with check (
  status = 'pending'
  and firsthand_confirmed = true
  and publication_permission = true
  and moderator_notes is null
  and published_at is null
);

create policy "Public can read approved reviews"
on public.msp_reviews
for select
to anon, authenticated
using (true);

revoke all on public.msp_review_submissions from anon, authenticated;
grant insert (
  member_id, msp_slug, msp_name, rating, title, body, display_name, email,
  relationship, interaction_month, firsthand_confirmed, publication_permission
) on public.msp_review_submissions to anon;

revoke all on public.msp_reviews from anon, authenticated;
grant select on public.msp_reviews to anon, authenticated;

create function private.sync_approved_msp_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();

  if new.status = 'approved' then
    new.published_at := coalesce(new.published_at, now());
    insert into public.msp_reviews (
      id, member_id, msp_slug, msp_name, rating, title, body,
      display_name, relationship, interaction_month, published_at, updated_at
    )
    values (
      new.id, new.member_id, new.msp_slug, new.msp_name, new.rating, new.title, new.body,
      new.display_name, new.relationship, new.interaction_month, new.published_at, now()
    )
    on conflict (id) do update set
      member_id = excluded.member_id,
      msp_slug = excluded.msp_slug,
      msp_name = excluded.msp_name,
      rating = excluded.rating,
      title = excluded.title,
      body = excluded.body,
      display_name = excluded.display_name,
      relationship = excluded.relationship,
      interaction_month = excluded.interaction_month,
      published_at = excluded.published_at,
      updated_at = now();
  else
    delete from public.msp_reviews where id = new.id;
    new.published_at := null;
  end if;

  return new;
end;
$$;

revoke all on function private.sync_approved_msp_review() from public, anon, authenticated;

create trigger sync_approved_msp_review
before insert or update on public.msp_review_submissions
for each row execute function private.sync_approved_msp_review();

comment on table public.msp_review_submissions is
  'Private moderation queue. Contains reviewer email and must never be publicly selectable.';
comment on table public.msp_reviews is
  'Public projection of approved MSP reviews. Contains no reviewer email or moderator notes.';
