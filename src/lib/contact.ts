export type ContactReasonId = "charity-help" | "correction" | "tip" | "press" | "general";

export type ContactReason = {
  id: ContactReasonId;
  label: string;
  shortLabel: string;
  summary: string;
  messageHint: string;
  showOrganisation: boolean;
  organisationLabel: string;
  showPageUrl: boolean;
  showTimeframe: boolean;
  timeframeLabel: string;
};

export const CONTACT_REASONS: ContactReason[] = [
  {
    id: "charity-help",
    label: "Free data help for a charity or group",
    shortLabel: "Charity data help",
    summary: "Local numbers, charts or checks for a charity, community group or school.",
    messageHint: "Tell us your council area, your question, who will read it and when you need it. Leave out private case notes.",
    showOrganisation: true,
    organisationLabel: "Charity, school or group name (optional)",
    showPageUrl: false,
    showTimeframe: true,
    timeframeLabel: "When do you need it? (optional)",
  },
  {
    id: "correction",
    label: "Report a mistake or newer figure",
    shortLabel: "Report a mistake",
    summary: "Tell us if a figure looks wrong, a link is broken or a new official release is out.",
    messageHint: "Tell us what looks wrong and share the official link or source if you have it.",
    showOrganisation: false,
    organisationLabel: "Organisation (optional)",
    showPageUrl: true,
    showTimeframe: false,
    timeframeLabel: "Deadline (optional)",
  },
  {
    id: "tip",
    label: "Share public records or a local tip",
    shortLabel: "Share a tip",
    summary: "Send an FOI reply, council paper or spending record worth checking.",
    messageHint: "Tell us what the record shows, which council or body it covers and where to find it.",
    showOrganisation: false,
    organisationLabel: "Group or role (optional)",
    showPageUrl: true,
    showTimeframe: false,
    timeframeLabel: "Deadline (optional)",
  },
  {
    id: "press",
    label: "Press, research or reuse",
    shortLabel: "Press or research",
    summary: "Ask about quoting our figures, reusing a chart or checking how a number was worked out.",
    messageHint: "Tell us what you are writing or checking and which numbers you need.",
    showOrganisation: true,
    organisationLabel: "Newsroom or organisation (optional)",
    showPageUrl: true,
    showTimeframe: true,
    timeframeLabel: "Deadline (optional)",
  },
  {
    id: "general",
    label: "General question or feedback",
    shortLabel: "General",
    summary: "Anything else about Scotland Counted or how the site works.",
    messageHint: "Write your question or note here.",
    showOrganisation: false,
    organisationLabel: "Organisation (optional)",
    showPageUrl: false,
    showTimeframe: false,
    timeframeLabel: "Deadline (optional)",
  },
];

const REASON_MAP = new Map<string, ContactReason>(CONTACT_REASONS.map((r) => [r.id, r]));

export function getContactReason(value: string | null | undefined): ContactReason {
  if (!value) return CONTACT_REASONS[0];
  return REASON_MAP.get(value.trim().toLowerCase()) ?? CONTACT_REASONS[0];
}

export type ContactPayload = {
  reason: ContactReasonId;
  name: string;
  email: string;
  wantsReply: boolean;
  organisation: string;
  pageUrl: string;
  timeframe: string;
  message: string;
};

export type ContactValidationResult =
  | { ok: true; data: ContactPayload; honeypot: boolean }
  | { ok: false; error: string; field?: string };

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").trim().slice(0, max);
}

function cleanSingleLine(value: unknown, max: number) {
  return cleanText(value, max).replace(/[\r\n]+/g, " ");
}

function asBool(value: unknown) {
  return value === true || value === "true" || value === "on" || value === "1";
}

export function validateContactInput(raw: Record<string, unknown>): ContactValidationResult {
  const botcheck = cleanSingleLine(raw.botcheck, 120);
  if (botcheck) {
    return {
      ok: true,
      honeypot: true,
      data: {
        reason: "general",
        name: "",
        email: "",
        wantsReply: false,
        organisation: "",
        pageUrl: "",
        timeframe: "",
        message: "",
      },
    };
  }

  const reasonRaw = cleanSingleLine(raw.reason, 40).toLowerCase();
  const reasonObj = REASON_MAP.get(reasonRaw);
  if (!reasonObj) {
    return { ok: false, error: "Choose what your message is about.", field: "reason" };
  }

  const wantsReply = asBool(raw.wantsReply);
  const name = cleanSingleLine(raw.name, 80);
  const email = cleanSingleLine(raw.email, 254).toLowerCase();
  const organisation = cleanSingleLine(raw.organisation, 120);
  const pageUrl = cleanSingleLine(raw.pageUrl, 300);
  const timeframe = cleanSingleLine(raw.timeframe, 80);
  const message = cleanText(raw.message, 4000);

  if (wantsReply && !email) {
    return { ok: false, error: "Add your email address so we can reply, or choose No reply needed.", field: "email" };
  }
  if (email && (email.length < 5 || !/^\S+@\S+\.\S+$/.test(email))) {
    return { ok: false, error: "Enter a valid email address.", field: "email" };
  }
  if (message.length < 15) {
    return { ok: false, error: "Write at least 15 characters so we know how to help.", field: "message" };
  }

  return {
    ok: true,
    honeypot: false,
    data: {
      reason: reasonObj.id,
      name,
      email,
      wantsReply,
      organisation,
      pageUrl,
      timeframe,
      message,
    },
  };
}
