-- Only the application server may create a row with a usable moderation token.
drop policy if exists "Anyone can submit a pending firsthand review"
  on public.msp_review_submissions;

create policy "Server can submit a pending firsthand review"
on public.msp_review_submissions
for insert
to anon
with check (
  status = 'pending'
  and firsthand_confirmed = true
  and publication_permission = true
  and moderator_notes is null
  and published_at is null
  and encode(
    extensions.digest(
      coalesce(
        current_setting('request.headers', true)::jsonb ->> 'x-review-secret',
        ''
      ),
      'sha256'
    ),
    'hex'
  ) = 'd7f8183df0fa4cce5bd069df53585c83edb2f87fce140553d9cc0d498271542a'
);

comment on policy "Server can submit a pending firsthand review"
on public.msp_review_submissions is
  'Requires the server-only review attestation header. The publishable key alone cannot create a moderatable submission.';
