import type { ComponentType } from "react";
import DoPeopleInPovertyWork from "./do-people-in-poverty-work";
import WhatDoesPovertyMean from "./what-does-poverty-mean";
import WhatIsTheScottishChildPayment from "./what-is-the-scottish-child-payment";
import HowToContactYourMpOrMsp from "./how-to-contact-your-mp-or-msp";

/**
 * Slug to post body. Statically imported so every post is prerendered and no
 * runtime module resolution is needed. Adding a post means adding it here and
 * to src/lib/data/posts.ts.
 */
export const postBodies: Record<string, ComponentType> = {
  "do-people-in-poverty-work": DoPeopleInPovertyWork,
  "what-does-poverty-mean": WhatDoesPovertyMean,
  "what-is-the-scottish-child-payment": WhatIsTheScottishChildPayment,
  "how-to-contact-your-mp-or-msp": HowToContactYourMpOrMsp,
};
