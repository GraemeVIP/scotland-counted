import type { ComponentType } from "react";
import DoPeopleInPovertyWork from "./do-people-in-poverty-work";
import WhatDoesPovertyMean from "./what-does-poverty-mean";
import WhatIsTheScottishChildPayment from "./what-is-the-scottish-child-payment";
import HowToContactYourMpOrMsp from "./how-to-contact-your-mp-or-msp";
import WhyIsTheCostOfLivingSoHigh from "./why-is-the-cost-of-living-so-high";
import CouncilTaxInScotlandGuide from "./council-tax-in-scotland-guide";
import CouncilTaxRisesScotland202627 from "./council-tax-rises-scotland-2026-27";
import MinimumWageTakeHomePayScotland2026 from "./minimum-wage-take-home-pay-scotland-2026";
import RealLivingWageVsMinimumWageScotland from "./real-living-wage-vs-minimum-wage-scotland";
import UniversalCreditWhenYouWorkMoreHours from "./universal-credit-when-you-work-more-hours";
import LocalHousingAllowanceRentShortfallScotland from "./local-housing-allowance-rent-shortfall-scotland";
import EnergyPriceCapScotland2026Explained from "./energy-price-cap-scotland-2026-explained";
import WhyFoodPricesStayHighWhenInflationFalls from "./why-food-prices-stay-high-when-inflation-falls";
import CrisisGrantScotlandHowToApply from "./crisis-grant-scotland-how-to-apply";
import DiscretionaryHousingPaymentScotland from "./discretionary-housing-payment-scotland";
import FreeSchoolMealsClothingGrantScotland from "./free-school-meals-clothing-grant-scotland";
import OperationBranchformSnpMoneyTimeline from "./operation-branchform-snp-money-timeline";

/**
 * Slug to post body. Statically imported so every post is prerendered and no
 * runtime module resolution is needed. Adding a post means adding it here and
 * to src/lib/data/posts.ts.
 */
export const postBodies: Record<string, ComponentType> = {
  "operation-branchform-snp-money-timeline": OperationBranchformSnpMoneyTimeline,
  "how-council-tax-works-scotland": CouncilTaxInScotlandGuide,
  "council-tax-rises-scotland-2026-27": CouncilTaxRisesScotland202627,
  "minimum-wage-take-home-pay-scotland-2026": MinimumWageTakeHomePayScotland2026,
  "real-living-wage-vs-minimum-wage-scotland": RealLivingWageVsMinimumWageScotland,
  "universal-credit-when-you-work-more-hours": UniversalCreditWhenYouWorkMoreHours,
  "local-housing-allowance-rent-shortfall-scotland": LocalHousingAllowanceRentShortfallScotland,
  "energy-price-cap-scotland-2026-explained": EnergyPriceCapScotland2026Explained,
  "why-food-prices-stay-high-when-inflation-falls": WhyFoodPricesStayHighWhenInflationFalls,
  "crisis-grant-scotland-how-to-apply": CrisisGrantScotlandHowToApply,
  "discretionary-housing-payment-scotland": DiscretionaryHousingPaymentScotland,
  "free-school-meals-clothing-grant-scotland": FreeSchoolMealsClothingGrantScotland,
  "why-is-the-cost-of-living-so-high": WhyIsTheCostOfLivingSoHigh,
  "do-people-in-poverty-work": DoPeopleInPovertyWork,
  "what-does-poverty-mean": WhatDoesPovertyMean,
  "what-is-the-scottish-child-payment": WhatIsTheScottishChildPayment,
  "how-to-contact-your-mp-or-msp": HowToContactYourMpOrMsp,
};
