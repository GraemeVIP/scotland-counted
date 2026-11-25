import "server-only";

import { randomBytes } from "node:crypto";
import tls from "node:tls";
import nodemailer from "nodemailer";
import { getContactReason, type ContactPayload } from "@/lib/contact";
import { site } from "@/lib/site";

const GMAIL_SMTP_USER = process.env.GMAIL_SMTP_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_EMAIL_DOMAIN = process.env.RESEND_EMAIL_DOMAIN;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "graeme@scotlandcounted.org.uk";

export class ContactMailNotConfiguredError extends Error {
  constructor() {
    super("Contact mail transport is not configured.");
    this.name = "ContactMailNotConfiguredError";
  }
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

export function buildContactEmail(input: ContactPayload, reference: string) {
  const reason = getContactReason(input.reason);
  const subject = `[${reference}] ${reason.shortLabel}${input.organisation ? `: ${input.organisation}` : ""}`;
  const lines = [
    `Reference: ${reference}`,
    `Topic: ${reason.label}`,
    `Reply wanted: ${input.wantsReply ? "Yes" : "No"}`,
    `Name: ${input.name || "Not given"}`,
    `Email: ${input.email || "Not given"}`,
    ...(input.organisation ? [`Organisation: ${input.organisation}`] : []),
    ...(input.pageUrl ? [`Page: ${input.pageUrl}`] : []),
    ...(input.timeframe ? [`Timeframe: ${input.timeframe}`] : []),
    "",
    "Message:",
    input.message,
  ];
  const text = lines.join("\n");

  const metaRows = [
    ["Reference", reference],
    ["Topic", reason.label],
    ["Reply wanted", input.wantsReply ? "Yes" : "No"],
    ["Name", input.name || "Not given"],
    ["Email", input.email || "Not given"],
    ...(input.organisation ? [["Organisation", input.organisation]] : []),
    ...(input.pageUrl ? [["Page", input.pageUrl]] : []),
    ...(input.timeframe ? [["Timeframe", input.timeframe]] : []),
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;font:600 14px Arial,sans-serif;color:#555;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0;font:14px Arial,sans-serif;color:#111">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br>");
  const html = `
    <div style="max-width:640px;font-family:Arial,sans-serif;color:#111">
      <h1 style="font:700 22px/1.3 Arial,sans-serif;margin:0 0 14px;color:#0f1d35">${escapeHtml(reason.label)}</h1>
      <table style="border-collapse:collapse;margin-bottom:18px">${metaRows}</table>
      <div style="padding:16px 18px;background:#f5f7fb;border-left:4px solid #1f6fff;font:15px/1.6 Arial,sans-serif;color:#1b2333">${safeMessage}</div>
    </div>
  `.trim();

  return { subject, text, html };
}

export async function sendContactMessage(input: ContactPayload): Promise<{ reference: string; reasonLabel: string }> {
  const reference = `SC-${randomBytes(3).toString("hex").toUpperCase()}`;
  const reason = getContactReason(input.reason);
  const { subject, text, html } = buildContactEmail(input, reference);

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
          const connection = tls.connect(
            {
              host: "smtp.gmail.com",
              port: 465,
              servername: "smtp.gmail.com",
              timeout: 8_000,
            },
            () => done(null, { connection, secured: true }),
          );
          connection.once("error", (error) => done(error));
          connection.once("timeout", () => {
            connection.destroy();
            done(new Error("Gmail SMTP connection timed out"));
          });
        },
      });

      await transporter.sendMail({
        from: `${site.name} contact <${GMAIL_SMTP_USER}>`,
        to: CONTACT_TO_EMAIL,
        ...(input.email ? { replyTo: input.email } : {}),
        subject,
        text,
        html,
        headers: { "X-Entity-Ref-ID": `contact/${reference}` },
      });
      return { reference, reasonLabel: reason.label };
    } catch (error) {
      console.error("Contact form Gmail SMTP delivery failed", error instanceof Error ? error.message : "Unknown error");
    }
  }

  if (!RESEND_API_KEY || !RESEND_EMAIL_DOMAIN) {
    throw new ContactMailNotConfiguredError();
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact/${reference}`,
      "User-Agent": `${site.name.replace(/\s+/g, "-")}/1.0`,
    },
    body: JSON.stringify({
      from: `${site.name} contact <contact@${RESEND_EMAIL_DOMAIN}>`,
      to: [CONTACT_TO_EMAIL],
      ...(input.email ? { reply_to: input.email } : {}),
      subject,
      text,
      html,
      tags: [{ name: "category", value: "contact_form" }],
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(`Resend failed (${response.status}): ${result?.message ?? "Unknown Resend error"}`);
  }

  return { reference, reasonLabel: reason.label };
}
