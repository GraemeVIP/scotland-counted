alter table public.msp_review_submissions
  add column moderation_token_hash text unique
    check (moderation_token_hash is null or char_length(moderation_token_hash) = 64);

grant insert (id, moderation_token_hash) on public.msp_review_submissions to anon;

create function public.get_msp_review_for_moderation(p_id uuid, p_token text)
returns table (
  id uuid,
  msp_name text,
  rating smallint,
  title text,
  body text,
  display_name text,
  email text,
  follow_up_opt_in boolean,
  relationship text,
  interaction_month date,
  created_at timestamptz
)
language sql
security definer
set search_path = ''
as $$
  select
    s.id,
    s.msp_name,
    s.rating,
    s.title,
    s.body,
    s.display_name,
    s.email,
    s.follow_up_opt_in,
    s.relationship,
    s.interaction_month,
    s.created_at
  from public.msp_review_submissions s
  where s.id = p_id
    and s.status = 'pending'
    and s.moderation_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  limit 1;
$$;

revoke all on function public.get_msp_review_for_moderation(uuid, text) from public, authenticated;
grant execute on function public.get_msp_review_for_moderation(uuid, text) to anon;

create function public.decide_msp_review(
  p_id uuid,
  p_token text,
  p_action text,
  p_title text,
  p_body text,
  p_display_name text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  decision text;
begin
  if p_action not in ('approve', 'reject') then
    return null;
  end if;

  update public.msp_review_submissions
  set
    title = p_title,
    body = p_body,
    display_name = p_display_name,
    status = case when p_action = 'approve' then 'approved' else 'rejected' end,
    moderation_token_hash = null
  where id = p_id
    and status = 'pending'
    and moderation_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  returning status into decision;

  return decision;
end;
$$;

revoke all on function public.decide_msp_review(uuid, text, text, text, text, text) from public, authenticated;
grant execute on function public.decide_msp_review(uuid, text, text, text, text, text) to anon;
