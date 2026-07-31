export type Representative = {
  role: "MP" | "MSP";
  name: string;
  party: string;
  constituency: string;
  email: string;
  phone?: string;
  officeAddress?: string;
  profileUrl: string;
};

export type RepresentativeLookup = {
  postcode: string;
  council: {
    name: string;
    slug: string;
  };
  mp: Representative;
  /**
   * Null when parliament.scot could not be read. The MP comes from an official
   * API and the MSP from a scrape, so the weaker source must not be able to
   * take the stronger one down with it.
   */
  msp: Representative | null;
  /** A plain-English reason to show the reader when msp is null. */
  mspUnavailable?: string;
};

/** Carries a postcode from the homepage to the action tool in this browser tab only. */
export const POSTCODE_SESSION_KEY = "scotland-counted-postcode";
