alter table public.msp_review_submissions
  alter column email drop not null,
  add column follow_up_opt_in boolean not null default false;

alter table public.msp_review_submissions
  drop constraint if exists msp_review_submissions_email_check;

alter table public.msp_review_submissions
  add constraint msp_review_submissions_optional_email_check
    check (
      email is null
      or (char_length(email) between 5 and 254 and position('@' in email) > 1)
    ),
  add constraint msp_review_submissions_follow_up_email_check
    check (follow_up_opt_in = false or email is not null);

grant insert (follow_up_opt_in) on public.msp_review_submissions to anon;
