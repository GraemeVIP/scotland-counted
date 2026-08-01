import { OG_ALT, OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage();
}
