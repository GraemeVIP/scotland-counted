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
  msp: Representative;
};
