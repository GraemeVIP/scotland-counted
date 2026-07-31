import { NextResponse } from "next/server";
import { councils } from "@/lib/data/councils";
import type { Representative, RepresentativeLookup } from "@/lib/representatives";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };
const REQUEST_TIMEOUT_MS = 15_000;

type ScottishPostcodeResponse = {
  status: number;
  result?: {
    postcode: string;
    council_area: string | null;
    uk_parliamentary_constituency: string | null;
    codes: {
      council_area: string | null;
    };
  };
};

type CommonsMember = {
  id: number;
  nameDisplayAs: string;
  latestParty: { name: string };
  latestHouseMembership: {
    membershipFrom: string;
  };
};

type CommonsSearchResponse = {
  items?: Array<{ value: CommonsMember }>;
};

type CommonsContactResponse = {
  value?: Array<{
    type: string;
    line1: string | null;
    line2: string | null;
    line3: string | null;
    line4: string | null;
    line5: string | null;
    postcode: string | null;
    phone: string | null;
    email: string | null;
  }>;
};

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE_HEADERS });
}

function compactPostcode(value: string) {
  return value.toUpperCase().replace(/\s+/g, "");
}

function formatPostcode(value: string) {
  const compact = compactPostcode(value);
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

function isPossiblePostcode(value: string) {
  return /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(compactPostcode(value));
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
}

function decodeCloudflareEmail(encoded: string) {
  const key = Number.parseInt(encoded.slice(0, 2), 16);
  if (!Number.isFinite(key)) return "";

  let decoded = "";
  for (let index = 2; index < encoded.length; index += 2) {
    decoded += String.fromCharCode(Number.parseInt(encoded.slice(index, index + 2), 16) ^ key);
  }
  return decoded;
}

function parseConstituencyMsp(html: string): Representative | null {
  const sectionStart = html.search(/<h3 class="h4">Constituency MSP<\/h3>/i);
  const sectionEnd = html.search(/<h3 class="h4">Regional MSPs<\/h3>/i);
  if (sectionStart < 0 || sectionEnd <= sectionStart) return null;

  const section = html.slice(sectionStart, sectionEnd);
  const person = section.match(/<h3 class="h5"><a href="([^"]+)">([^<]+)<\/a><\/h3>/i);
  const party = section.match(/<div class="content-block__body">\s*<p>([^<]+)<\/p>/i);
  const constituency = section.match(/data-rc="([^"]+)"/i);
  const protectedEmail = section.match(/email-protection#([a-f\d]+)/i);

  if (!person || !party || !constituency || !protectedEmail) return null;
  const email = decodeCloudflareEmail(protectedEmail[1]);
  if (!email.includes("@")) return null;

  return {
    role: "MSP",
    name: decodeHtml(person[2]),
    party: decodeHtml(party[1]),
    constituency: decodeHtml(constituency[1]),
    email,
    profileUrl: `https://www.parliament.scot${decodeHtml(person[1])}`,
  };
}

async function getJson<T>(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Upstream request failed with ${response.status}`);
  return (await response.json()) as T;
}

async function getText(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Upstream request failed with ${response.status}`);
  return response.text();
}

function officeAddress(contact: NonNullable<CommonsContactResponse["value"]>[number]) {
  return [
    contact.line1,
    contact.line2,
    contact.line3,
    contact.line4,
    contact.line5,
    contact.postcode,
  ]
    .filter(Boolean)
    .join(", ");
}

export async function GET(request: Request) {
  const postcodeInput = new URL(request.url).searchParams.get("postcode")?.trim() ?? "";
  if (!isPossiblePostcode(postcodeInput)) {
    return error("Enter a full UK postcode, for example G12 8QQ.", 400);
  }

  const postcode = formatPostcode(postcodeInput);

  try {
    const geographyResponse = await fetch(
      `https://api.postcodes.io/scotland/postcodes/${encodeURIComponent(compactPostcode(postcode))}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    );

    if (geographyResponse.status === 404) {
      return error("That postcode was not found in Scotland. Check it and try again.", 400);
    }
    if (!geographyResponse.ok) throw new Error("Postcode lookup failed");

    const geography = (await geographyResponse.json()) as ScottishPostcodeResponse;
    const area = geography.result;
    if (!area?.uk_parliamentary_constituency || !area.codes.council_area) {
      return error("We could not match that postcode to its representatives.", 404);
    }

    const council = councils.find((item) => item.code === area.codes.council_area);
    if (!council) {
      return error("We found the postcode but could not match its council data.", 404);
    }

    const commonsUrl = new URL("https://members-api.parliament.uk/api/Members/Search");
    commonsUrl.searchParams.set("Location", area.uk_parliamentary_constituency);
    commonsUrl.searchParams.set("House", "1");
    commonsUrl.searchParams.set("IsCurrentMember", "true");
    commonsUrl.searchParams.set("skip", "0");
    commonsUrl.searchParams.set("take", "20");

    const holyroodUrl = new URL(
      "https://www.parliament.scot/msps/current-and-previous-msps/find-your-msp"
    );
    holyroodUrl.searchParams.set("postcode", postcode);

    const [commonsSearch, holyroodHtml] = await Promise.all([
      getJson<CommonsSearchResponse>(commonsUrl.toString()),
      getText(holyroodUrl.toString()),
    ]);

    const member = commonsSearch.items
      ?.map((item) => item.value)
      .find(
        (item) =>
          item.latestHouseMembership.membershipFrom.toLocaleLowerCase("en-GB") ===
          area.uk_parliamentary_constituency!.toLocaleLowerCase("en-GB")
      );
    const msp = parseConstituencyMsp(holyroodHtml);

    if (!member || !msp) {
      return error("We could not retrieve both of your current representatives. Try again shortly.", 502);
    }

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

    if (!emailContact?.email) {
      return error("Your MP was found, but Parliament did not return a public email address.", 502);
    }

    const mp: Representative = {
      role: "MP",
      name: member.nameDisplayAs,
      party: member.latestParty.name,
      constituency: member.latestHouseMembership.membershipFrom,
      email: emailContact.email,
      phone: phoneContact?.phone ?? undefined,
      officeAddress: constituencyContact ? officeAddress(constituencyContact) : undefined,
      profileUrl: `https://members.parliament.uk/member/${member.id}/contact`,
    };

    const result: RepresentativeLookup = {
      postcode: area.postcode || postcode,
      council: { name: council.name, slug: council.slug },
      mp,
      msp,
    };

    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch {
    return error("The representative lookup is temporarily unavailable. Please try again shortly.", 502);
  }
}
