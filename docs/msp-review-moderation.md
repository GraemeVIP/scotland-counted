# MSP review moderation

Reviews are stored in the dedicated **Scotland Counted Reviews** Supabase project.
Visitors do not create accounts and submissions never publish automatically.
New-review alerts are sent to **graeme@strathmarkconsulting.com** through Gmail. The alert contains
only a short summary and the private link; the full account and optional reviewer email stay in the
moderation queue.

## Required service configuration

- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` point at the dedicated review project.
- `REVIEW_MODERATION_SECRET` is the same value in Vercel production, preview and development. The
  database stores only its SHA-256 fingerprint in the insert policy, so a publishable Supabase key
  cannot be used to create a self-approvable review directly.
- `GMAIL_SMTP_USER` is the Gmail address used to send alerts.
- `GMAIL_APP_PASSWORD` is a dedicated Google app password for that mailbox. It is encrypted in
  Vercel and must never be committed. Gmail app passwords require 2-Step Verification.
- `RESEND_API_KEY` and `RESEND_EMAIL_DOMAIN` remain an optional fallback if their sending domain is
  verified later; Gmail does not need the Scotland Counted domain's DNS to be changed.

If storage succeeds but email delivery fails, the visitor still receives the submission
confirmation and the failure is written to the server log. Do not tell a visitor their account was
lost merely because the separate moderator alert failed.

## Approve or reject a review

1. Open the new-review email sent by the website.
2. Follow its private moderation link. The secret part of the link stays in the browser fragment and
   is removed before the page loads the submission.
3. Check the account. Contact the reviewer only when follow-up permission says **Yes** and an email
   is shown.
4. Remove private details or make any agreed factual and readability edits.
5. Press **Approve and publish** or **Reject**.

The link works for that submission only and expires after either decision. Rejecting deletes the
private submission instead of retaining its account or optional email. The moderation page is
excluded from analytics, search indexing, referrers and caching.

Approval automatically copies only the public fields into `msp_reviews`. The email address,
moderator notes and confirmation fields never enter that table. Public pages refresh within about
one minute, and their aggregate rating and review structured data are calculated from the same
approved rows readers can see.

For later corrections or unpublishing, use the Supabase Table Editor as the backup administration
route. Changing an approved submission to `rejected` removes its public copy automatically.

## Moderation boundary

Do not publish private case numbers, home addresses, medical details, children's identities,
caseworker names, threats, slurs, hearsay or claims about motive. A low rating alone is not enough;
the account must describe a direct experience with enough detail to understand what the office was
asked to do and what happened.
