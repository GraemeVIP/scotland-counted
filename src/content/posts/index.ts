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
import DrugDeathsScotlandDeprivation from "./drug-deaths-scotland-deprivation";
import CrisisGrantAcceptanceRatesScotlandCouncils from "./crisis-grant-acceptance-rates-scotland-councils";
import GlasgowSexCrimeRiseMigrants from "./glasgow-sex-crime-rise-migrants";
import BestPerformingCouncilsScotland from "./best-performing-councils-scotland";
import ShopliftingScotlandRecordHigh from "./shoplifting-scotland-record-high";
import AdultDisabilityPayment from "./adult-disability-payment";
import AdultDisabilityPaymentPhoneNumber from "./adult-disability-payment-phone-number";
import CarerSupportPayment from "./carer-support-payment";
import BestStartGrant from "./best-start-grant";
import WinterFuelPaymentScotland from "./winter-fuel-payment-scotland";
import WinterHeatingPayment from "./winter-heating-payment";
import SocialSecurityScotlandPaymentDates from "./social-security-scotland-payment-dates";
import YoungCarersAllowanceScotland from "./young-carers-allowance-scotland";
import CrisisGrantPhoneNumber from "./crisis-grant-phone-number";
import MinimumWage2027 from "./minimum-wage-2027";
import AverageSalaryScotland from "./average-salary-scotland";
import MinimumWageInGlasgowScotland from "./minimum-wage-in-glasgow-scotland";
import MinimumWageInEdinburghScotland from "./minimum-wage-in-edinburgh-scotland";
import MinimumWageAberdeen from "./minimum-wage-aberdeen";
import MinimumWageDundee from "./minimum-wage-dundee";
import CheckCouncilTaxBand from "./check-council-tax-band";
import CouncilTaxReductionScotland from "./council-tax-reduction-scotland";
import SinglePersonDiscountCouncilTaxScotland from "./single-person-discount-council-tax-scotland";
import WaterRatesScotland from "./water-rates-scotland";
import ModernStudies from "./modern-studies";
import National5ModernStudies from "./national-5-modern-studies";
import HigherModernStudies from "./higher-modern-studies";
import HigherModernStudiesPastPapers from "./higher-modern-studies-past-papers";
import Nat5ModernStudiesPastPapers from "./nat-5-modern-studies-past-papers";
import AdvancedHigherModernStudies from "./advanced-higher-modern-studies";
import CausesOfPoverty from "./causes-of-poverty";
import WhoIsMyMsp from "./who-is-my-msp";
import WhoIsMyLocalCouncillorByPostcode from "./who-is-my-local-councillor-by-postcode";
import LifeExpectancyGlasgow from "./life-expectancy-glasgow";
import UnemploymentScotland from "./unemployment-scotland";
import CrimeRateGlasgow from "./crime-rate-glasgow";

/**
 * Slug to post body. Statically imported so every post is prerendered and no
 * runtime module resolution is needed. Adding a post means adding it here and
 * to src/lib/data/posts.ts.
 */
export const postBodies: Record<string, ComponentType> = {
  "shoplifting-scotland-record-high": ShopliftingScotlandRecordHigh,
  "glasgow-sex-crime-rise-migrants": GlasgowSexCrimeRiseMigrants,
  "best-performing-councils-scotland": BestPerformingCouncilsScotland,
  "operation-branchform-snp-money-timeline": OperationBranchformSnpMoneyTimeline,
  "drug-deaths-scotland-deprivation": DrugDeathsScotlandDeprivation,
  "crisis-grant-acceptance-rates-scotland-councils": CrisisGrantAcceptanceRatesScotlandCouncils,
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
  "adult-disability-payment": AdultDisabilityPayment,
  "adult-disability-payment-phone-number": AdultDisabilityPaymentPhoneNumber,
  "carer-support-payment": CarerSupportPayment,
  "best-start-grant": BestStartGrant,
  "winter-fuel-payment-scotland": WinterFuelPaymentScotland,
  "winter-heating-payment": WinterHeatingPayment,
  "social-security-scotland-payment-dates": SocialSecurityScotlandPaymentDates,
  "young-carers-allowance-scotland": YoungCarersAllowanceScotland,
  "crisis-grant-phone-number": CrisisGrantPhoneNumber,
  "minimum-wage-2027": MinimumWage2027,
  "average-salary-scotland": AverageSalaryScotland,
  "minimum-wage-in-glasgow-scotland": MinimumWageInGlasgowScotland,
  "minimum-wage-in-edinburgh-scotland": MinimumWageInEdinburghScotland,
  "minimum-wage-aberdeen": MinimumWageAberdeen,
  "minimum-wage-dundee": MinimumWageDundee,
  "check-council-tax-band": CheckCouncilTaxBand,
  "council-tax-reduction-scotland": CouncilTaxReductionScotland,
  "single-person-discount-council-tax-scotland": SinglePersonDiscountCouncilTaxScotland,
  "water-rates-scotland": WaterRatesScotland,
  "modern-studies": ModernStudies,
  "national-5-modern-studies": National5ModernStudies,
  "higher-modern-studies": HigherModernStudies,
  "higher-modern-studies-past-papers": HigherModernStudiesPastPapers,
  "nat-5-modern-studies-past-papers": Nat5ModernStudiesPastPapers,
  "advanced-higher-modern-studies": AdvancedHigherModernStudies,
  "causes-of-poverty": CausesOfPoverty,
  "who-is-my-msp": WhoIsMyMsp,
  "who-is-my-local-councillor-by-postcode": WhoIsMyLocalCouncillorByPostcode,
  "life-expectancy-glasgow": LifeExpectancyGlasgow,
  "unemployment-scotland": UnemploymentScotland,
  "crime-rate-glasgow": CrimeRateGlasgow,
};
