import { NextResponse } from "next/server";
import { councils } from "@/lib/data/councils";
import type { Representative, RepresentativeLookup } from "@/lib/representatives";
import { findMemberForConstituency, getText, toRepresentative } from "@/lib/parliament";
import { POSTCODE_MESSAGES, lookupPostcodeArea } from "@/lib/postcode";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

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

export async function GET(request: Request) {
  const postcodeInput = new URL(request.url).searchParams.get("postcode")?.trim() ?? "";
  if (!isPossiblePostcode(postcodeInput)) {
    return error("Enter a full UK postcode, for example G12 8QQ.", 400);
  }

  const postcode = formatPostcode(postcodeInput);

  try {
    const geography = await lookupPostcodeArea(compactPostcode(postcode));
    if (!geography.ok) {
      const status = geography.reason === "unavailable" ? 502 : 400;
      return error(POSTCODE_MESSAGES[geography.reason], status);
    }

    const area = geography.area;
    const council = councils.find((item) => item.code === area.councilCode);
    if (!council) {
      return error("I found the postcode but could not match its council data.", 404);
    }

    const holyroodUrl = new URL(
      "https://www.parliament.scot/msps/current-and-previous-msps/find-your-msp"
    );
    holyroodUrl.searchParams.set("postcode", postcode);

    /**
     * The MP comes from Parliament's official API; the MSP has to be scraped
     * from parliament.scot, which has no API. They are settled independently so
     * a change to that page's markup cannot take the MP down with it.
     */
    const [memberResult, holyroodResult] = await Promise.allSettled([
      findMemberForConstituency(area.constituency),
      getText(holyroodUrl.toString()),
    ]);

    const member = memberResult.status === "fulfilled" ? memberResult.value : null;
    const msp =
      holyroodResult.status === "fulfilled"
        ? parseConstituencyMsp(holyroodResult.value)
        : null;

    if (!member) {
      return error("I could not find your MP just now. Please try again shortly.", 502);
    }

    const mp = await toRepresentative(member);
    if (!mp) {
      return error("Your MP was found, but Parliament did not return a public email address.", 502);
    }

    const result: RepresentativeLookup = {
      postcode: area.postcode || postcode,
      council: { name: council.name, slug: council.slug },
      mp,
      msp,
      /** Set when Holyrood could not be reached, so the page can say so plainly. */
      mspUnavailable: msp
        ? undefined
        : "The Scottish Parliament's website could not be reached just now, so your MSP could not be found. Your MP email is ready below.",
    };

    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch {
    return error("The representative lookup is temporarily unavailable. Please try again shortly.", 502);
  }
}
