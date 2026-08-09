import "server-only";

import { createHash, createHmac, randomUUID } from "node:crypto";
import tls from "node:tls";
import nodemailer from "nodemailer";
import type { ApprovedMspReview } from "@/lib/data/mspReviews";
import { site } from "@/lib/site";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_EMAIL_DOMAIN = process.env.RESEND_EMAIL_DOMAIN;
const GMAIL_SMTP_USER = process.env.GMAIL_SMTP_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const REVIEW_MODERATION_SECRET = process.env.REVIEW_MODERATION_SECRET;
const REVIEW_MODERATION_EMAIL = "graeme@strathmarkconsulting.com";

type ReviewRow = {
  id: string;
  member_id: number;
  rating: number;
  title: string;
  body: string;
  display_name: string;
  relationship: ApprovedMspReview["relationship"];
  interaction_month: string | null;
  published_at: string;
};

function configured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function moderationTokenFor(id: string) {
  if (!REVIEW_MODERATION_SECRET) throw new Error("REVIEW_MODERATION_SECRET is not configured");
  return createHmac("sha256", REVIEW_MODERATION_SECRET).update(id).digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character] ?? character);
}

async function sendReviewModerationEmail(input: {
  id: string;
  moderationToken: string;
  mspName: string;
  rating: number;
  displayName: string;
  followUpOptIn: boolean;
}) {
  const moderationUrl = `${site.url}/review-moderation/${input.id}#token=${input.moderationToken}`;
  const safeMspName = escapeHtml(input.mspName);
  const safeDisplayName = escapeHtml(input.displayName);
  const subject = `MSP review awaiting moderation: ${input.mspName}`;
  const text = [
    "A new MSP review is waiting for moderation.",
    "",
    `MSP: ${input.mspName}`,
    `Rating: ${input.rating} out of 5`,
    `Published name: ${input.displayName}`,
    `Follow-up permission: ${input.followUpOptIn ? "Yes" : "No"}`,
    "",
    `Review it securely: ${moderationUrl}`,
    "",
    "The full account and any optional contact address are shown only on the private moderation page.",
  ].join("\n");
  const html = `<h1 style="font:700 24px/1.25 Arial,sans-serif;color:#171717">New MSP review</h1><p style="font:16px/1.55 Arial,sans-serif;color:#333"><strong>MSP:</strong> ${safeMspName}<br><strong>Rating:</strong> ${input.rating} out of 5<br><strong>Published name:</strong> ${safeDisplayName}<br><strong>Follow-up permission:</strong> ${input.followUpOptIn ? "Yes" : "No"}</p><p><a href="${moderationUrl}" style="display:inline-block;padding:12px 18px;background:#173f5f;color:#fff;font:700 16px Arial,sans-serif;text-decoration:none;border-radius:6px">Open private moderation page</a></p><p style="font:14px/1.5 Arial,sans-serif;color:#555">The full account and any optional contact address are shown only on the private moderation page.</p>`;

  if (GMAIL_SMTP_USER && GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: GMAIL_SMTP_USER, pass: GMAIL_APP_PASSWORD },
        connectionTimeout: 8_000,
        greetingTimeout: 8_000,
        socketTimeout: 10_000,
        getSocket(
          _options: unknown,
          callback: (error: Error | null, socketOptions?: { connection: tls.TLSSocket; secured: true }) => void,
        ) {
          let settled = false;
          const done = (error: Error | null, socketOptions?: { connection: tls.TLSSocket; secured: true }) => {
            if (settled) return;
            settled = true;
            callback(error, socketOptions);
          };
          const connection = tls.connect({
            host: "smtp.gmail.com",
            port: 465,
            servername: "smtp.gmail.com",
            timeout: 8_000,
          }, () => done(null, { connection, secured: true }));
          connection.once("error", (error) => done(error));
          connection.once("timeout", () => {
            connection.destroy();
            done(new Error("Gmail SMTP connection timed out"));
          });
        },
      });
      await transporter.sendMail({
        from: `${site.name} reviews <${GMAIL_SMTP_USER}>`,
        to: REVIEW_MODERATION_EMAIL,
        subject,
        text,
        html,
        headers: { "X-Entity-Ref-ID": `msp-review/${input.id}` },
      });
      return true;
    } catch (error) {
      console.error("MSP review was saved but its Gmail notification failed", error);
    }
  }

  if (!RESEND_API_KEY || !RESEND_EMAIL_DOMAIN) {
    console.error("MSP review was saved but neither Gmail nor Resend is configured");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `msp-review/${input.id}`,
      "User-Agent": `${site.name.replace(/\s+/g, "-")}/1.0`,
    },
    body: JSON.stringify({
      from: `${site.name} reviews <reviews@${RESEND_EMAIL_DOMAIN}>`,
      to: [REVIEW_MODERATION_EMAIL],
      subject,
      text,
      html,
      tags: [{ name: "category", value: "msp_review_moderation" }],
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null) as { message?: string } | null;
    console.error("MSP review was saved but its Resend notification failed", response.status, result?.message ?? "Unknown Resend error");
    return false;
  }
  return true;
}

function headers() {
  if (!SUPABASE_KEY) throw new Error("SUPABASE_PUBLISHABLE_KEY is not configured");
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
}

function toReview(row: ReviewRow): ApprovedMspReview {
  return {
    id: row.id,
    memberId: row.member_id,
    rating: row.rating as ApprovedMspReview["rating"],
    title: row.title,
    body: row.body,
    authorName: row.display_name,
    relationship: row.relationship,
    interactionDate: row.interaction_month ?? undefined,
    publishedDate: row.published_at,
  };
}

export async function listApprovedMspReviews(memberId?: number) {
  if (!configured()) return [];
  const filter = memberId ? `&member_id=eq.${memberId}` : "";
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/msp_reviews?select=id,member_id,rating,title,body,display_name,relationship,interaction_month,published_at${filter}&order=published_at.desc`,
    { headers: headers(), next: { revalidate: 60, tags: ["msp-reviews"] } },
  );
  if (!response.ok) throw new Error(`Could not load approved MSP reviews (${response.status})`);
  return ((await response.json()) as ReviewRow[]).map(toReview);
}

export async function submitMspReview(input: {
  memberId: number;
  mspSlug: string;
  mspName: string;
  rating: number;
  title: string;
  body: string;
  displayName: string;
  email: string | null;
  followUpOptIn: boolean;
  relationship: string;
  interactionMonth: string | null;
}) {
  if (!configured()) throw new Error("Supabase review storage is not configured");
  const id = randomUUID();
  const moderationToken = moderationTokenFor(id);
  const moderationTokenHash = createHash("sha256").update(moderationToken).digest("hex");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/msp_review_submissions`, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      "x-review-secret": REVIEW_MODERATION_SECRET as string,
    },
    body: JSON.stringify({
      id,
      member_id: input.memberId,
      msp_slug: input.mspSlug,
      msp_name: input.mspName,
      rating: input.rating,
      title: input.title,
      body: input.body,
      display_name: input.displayName,
      email: input.email,
      follow_up_opt_in: input.followUpOptIn,
      moderation_token_hash: moderationTokenHash,
      relationship: input.relationship,
      interaction_month: input.interactionMonth,
      firsthand_confirmed: true,
      publication_permission: true,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Could not save MSP review (${response.status}): ${detail.slice(0, 240)}`);
  }

  let notificationSent = false;
  try {
    notificationSent = await sendReviewModerationEmail({
      id,
      moderationToken,
      mspName: input.mspName,
      rating: input.rating,
      displayName: input.displayName,
      followUpOptIn: input.followUpOptIn,
    });
  } catch (error) {
    console.error("MSP review was saved but its notification could not be attempted", error);
  }
  return { id, notificationSent };
}

export type ModerationSubmission = {
  id: string;
  msp_name: string;
  rating: number;
  title: string;
  body: string;
  display_name: string;
  email: string | null;
  follow_up_opt_in: boolean;
  relationship: string;
  interaction_month: string | null;
  created_at: string;
};

async function callModerationEdge<T>(body: object) {
  if (!configured()) throw new Error("Supabase review storage is not configured");
  const response = await fetch(`${SUPABASE_URL}/functions/v1/moderate-review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (response.status === 410) return null;
  if (!response.ok) throw new Error(`Moderation request failed (${response.status})`);
  return (await response.json()) as T;
}

export async function getReviewForModeration(id: string, token: string) {
  const result = await callModerationEdge<{ submission: ModerationSubmission }>({
    id,
    token,
    action: "view",
  });
  return result?.submission ?? null;
}

export async function decideReview(input: {
  id: string;
  token: string;
  action: "approve" | "reject";
  title: string;
  body: string;
  displayName: string;
}) {
  const result = await callModerationEdge<{ success: boolean; decision: string }>({
    id: input.id,
    token: input.token,
    action: input.action,
    title: input.title,
    body: input.body,
    displayName: input.displayName,
  });
  return result?.success ? result.decision : null;
}
