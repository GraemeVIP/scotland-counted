/**
 * Server-side lookups against the UK Parliament Members API.
 *
 * Shared by /api/representatives (postcode -> MP + MSP) and /api/mp
 * (constituency -> MP). The contact-picking rules are fiddly enough that
 * duplicating them would guarantee the two routes drift apart.
 */

import type { Representative } from "@/lib/representatives";

export const REQUEST_TIMEOUT_MS = 15_000;

type CommonsMember = {
  id: number;
  nameDisplayAs: string;
  latestParty: { name: string };
  latestHouseMembership: { membershipFrom: string };
};

type CommonsSearchResponse = { items?: Array<{ value: CommonsMember }> };

type CommonsContact = {
  type: string;
  line1: string | null;
  line2: string | null;
  line3: string | null;
  line4: string | null;
  line5: string | null;
  postcode: string | null;
  phone: string | null;
  email: string | null;
};

type CommonsContactResponse = { value?: CommonsContact[] };

export async function getJson<T>(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Upstream request failed with ${response.status}`);
  return (await response.json()) as T;
}

export async function getText(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Upstream request failed with ${response.status}`);
  return response.text();
}

function officeAddress(contact: CommonsContact) {
  return [contact.line1, contact.line2, contact.line3, contact.line4, contact.line5, contact.postcode]
    .filter(Boolean)
    .join(", ");
}

/** Find the sitting MP whose seat matches this constituency name exactly. */
export async function findMemberForConstituency(constituency: string) {
  const url = new URL("https://members-api.parliament.uk/api/Members/Search");
  url.searchParams.set("Location", constituency);
  url.searchParams.set("House", "1");
  url.searchParams.set("IsCurrentMember", "true");
  url.searchParams.set("skip", "0");
  url.searchParams.set("take", "20");

  const search = await getJson<CommonsSearchResponse>(url.toString());
  return (
    search.items
      ?.map((item) => item.value)
      .find(
        (item) =>
          item.latestHouseMembership.membershipFrom.toLocaleLowerCase("en-GB") ===
          constituency.toLocaleLowerCase("en-GB")
      ) ?? null
  );
}

/**
 * Turn a member into a contactable Representative. Prefers the constituency
 * office, which is the address a constituent should be writing to.
 */
export async function toRepresentative(member: CommonsMember): Promise<Representative | null> {
  const contacts = await getJson<CommonsContactResponse>(
    `https://members-api.parliament.uk/api/Members/${member.id}/Contact`
  );

  const constituencyContact = contacts.value?.find(
    (contact) => contact.type === "Constituency office" && contact.email
  );
  const emailContact = constituencyContact ?? contacts.value?.find((contact) => contact.email);
  const phoneContact =
    contacts.value?.find((contact) => contact.type === "Constituency office" && contact.phone) ??
    contacts.value?.find((contact) => contact.phone);

  if (!emailContact?.email) return null;

  return {
    role: "MP",
    name: member.nameDisplayAs,
    party: member.latestParty.name,
    constituency: member.latestHouseMembership.membershipFrom,
    email: emailContact.email,
    phone: phoneContact?.phone ?? undefined,
    officeAddress: constituencyContact ? officeAddress(constituencyContact) : undefined,
    profileUrl: `https://members.parliament.uk/member/${member.id}/contact`,
  };
}

/** The whole MP lookup, from constituency name to a contactable person. */
export async function fetchMpForConstituency(constituency: string) {
  const member = await findMemberForConstituency(constituency);
  if (!member) return null;
  return toRepresentative(member);
}
