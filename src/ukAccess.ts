export const VERCEL_COUNTRY_HEADER = "x-vercel-ip-country";

const UK_COUNTRY_CODE = "GB";

/**
 * Vercel supplies the country header in production. A missing header is
 * allowed only outside Vercel so local development and local checks still
 * work; a deployed request with unknown geography is denied.
 */
export function isUkVisitor(countryHeader: string | null, isVercelDeployment: boolean) {
  const country = countryHeader?.trim().toUpperCase();

  if (!country) return !isVercelDeployment;

  return country === UK_COUNTRY_CODE;
}
