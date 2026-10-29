"""Build the keyword content plan from the Keyword Planner exports.

Each page has one primary keyword. The slug, the <title> and the H1 all carry
that keyword's words in the same order. Close variants go into H2s and FAQs.
"""
import csv, glob, json, pathlib, re, sys

ROOT = pathlib.Path(sys.argv[1])
KW = {}
for f in glob.glob(str(ROOT / "research/keywords/*.csv")):
    for r in csv.DictReader(open(f, encoding="utf-8-sig")):
        k = r["Keyword"].strip().lower()
        v = int(r["Average monthly searches"] or 0) if (r["Average monthly searches"] or "0").isdigit() else 0
        KW[k] = max(KW.get(k, 0), v)


def vol(k):
    return KW.get(k.lower(), 0)


def slugify(k):
    return re.sub(r"[^a-z0-9]+", "-", k.lower()).strip("-")


PAGES = []


def page(cluster, tier, primary, title, h1, action, slug=None, current=None, h2=(), data="", notes=""):
    slug = slug or "/" + slugify(primary)
    words = slugify(primary)
    assert words in slug.strip("/").replace("/", "-"), f"slug {slug} lacks {primary}"
    assert primary.lower() in title.lower(), f"title lacks '{primary}': {title}"
    assert primary.lower() in h1.lower(), f"h1 lacks '{primary}': {h1}"
    PAGES.append(dict(cluster=cluster, tier=tier, primary=primary, volume=vol(primary), slug=slug, title=title,
                      h1=h1, action=action, current=current, secondary=[(k, vol(k)) for k in h2], data=data, notes=notes))


# ---------------------------------------------------------------- Money: wages and pay
page("Wages and pay", 1, "minimum wage scotland", "Minimum Wage Scotland 2026 and 2027: £12.71 to £13.21",
     "Minimum wage Scotland: what you earn in 2026 and 2027", "move", current="/blog/minimum-wage-take-home-pay-scotland-2026",
     h2=["national minimum wage scotland", "minimum salary scotland", "minimum wage scotland age 18", "minimum wage age 16 scotland",
         "national living wage scotland", "basic wage scotland"], data="GOV.UK rates, tax engine")
page("Wages and pay", 1, "take home pay calculator scotland", "Take Home Pay Calculator Scotland 2026/27",
     "Take home pay calculator Scotland 2026/27", "retitle", current="/take-home-pay-calculator-scotland",
     h2=["net pay calculator scotland", "salary after tax scotland", "calculate take home pay scotland", "net salary calculator scotland"],
     data="tax engine")
page("Wages and pay", 1, "average salary scotland", "Average Salary Scotland 2026: What Full Time Workers Earn by Council",
     "Average salary Scotland: what full time workers earn", "new",
     h2=["average wage in scotland", "average salary in edinburgh", "average salary in aberdeen"], data="ONS ASHE (held: nomis-ashe-pay-*.csv)")
page("Wages and pay", 1, "real living wage scotland", "Real Living Wage Scotland 2026: £14.10 vs Minimum Wage",
     "Real living wage Scotland: £14.10 an hour against the legal minimum", "move", current="/blog/real-living-wage-vs-minimum-wage-scotland",
     h2=["scotland living wage", "living wage glasgow", "edinburgh living wage"], data="Living Wage Foundation")
page("Wages and pay", 1, "minimum wage 2027", "Minimum Wage 2027: £13.21 From April, What It Means in Scotland",
     "Minimum wage 2027: every rate from 1 April", "new", data="GOV.UK rates", notes="Searches up 274% in 3 months; peaks March to April")
for city, kw in [("Glasgow", "minimum wage in glasgow scotland"), ("Edinburgh", "minimum wage in edinburgh scotland"),
                 ("Aberdeen", "minimum wage aberdeen"), ("Dundee", "minimum wage dundee")]:
    page("Wages and pay", 2, kw, f"{kw.title().replace('In ', 'in ')} 2026: Rates and Local Pay",
         f"{kw[0].upper() + kw[1:]}: the legal rate and what local jobs pay", "new",
         data="GOV.UK rates + ASHE by council", notes="Local pay data makes each page distinct")
page("Wages and pay", 2, "salary after tax scotland", "Salary After Tax Scotland 2026/27: Every Salary From £15,000 to £150,000",
     "Salary after tax Scotland: take home pay for every salary", "new", data="tax engine",
     notes="Hub linking to one page per salary below")
for n in [15000, 18000, 20000, 22000, 24000, 25000, 26000, 28000, 30000, 32000, 35000, 38000, 40000, 45000, 50000,
          55000, 60000, 65000, 70000, 75000, 80000, 90000, 100000, 120000, 150000]:
    page("Salary after tax", 2 if n in (20000, 25000, 30000, 35000, 40000, 50000) else 3, f"{n} after tax scotland",
         f"{n} After Tax Scotland 2026/27: Monthly, Weekly and Yearly",
         f"{n} after tax Scotland: what you take home", "new", data="tax engine",
         notes="Exact keyword uses digits with no comma, as people type it")

# ---------------------------------------------------------------- Council tax
COUNCILS = [("aberdeen-city", "aberdeen"), ("aberdeenshire", "aberdeenshire"), ("angus", "angus"),
            ("argyll-and-bute", "argyll and bute"), ("city-of-edinburgh", "edinburgh"), ("clackmannanshire", "clackmannanshire"),
            ("dumfries-and-galloway", "dumfries and galloway"), ("dundee-city", "dundee"), ("east-ayrshire", "east ayrshire"),
            ("east-dunbartonshire", "east dunbartonshire"), ("east-lothian", "east lothian"), ("east-renfrewshire", "east renfrewshire"),
            ("falkirk", "falkirk"), ("fife", "fife"), ("glasgow-city", "glasgow"), ("highland", "highland"), ("inverclyde", "inverclyde"),
            ("midlothian", "midlothian"), ("moray", "moray"), ("na-h-eileanan-siar", "western isles"), ("north-ayrshire", "north ayrshire"),
            ("north-lanarkshire", "north lanarkshire"), ("orkney-islands", "orkney"), ("perth-and-kinross", "perth and kinross"),
            ("renfrewshire", "renfrewshire"), ("scottish-borders", "scottish borders"), ("shetland-islands", "shetland"),
            ("south-ayrshire", "south ayrshire"), ("south-lanarkshire", "south lanarkshire"), ("stirling", "stirling"),
            ("west-dunbartonshire", "west dunbartonshire"), ("west-lothian", "west lothian")]
H2_EXTRA = {
    "glasgow": ["glasgow council tax", "council tax glasgow pay", "glasgow council tax phone number", "council tax discount glasgow",
                "glasgow council tax band checker", "council tax glasgow single person discount", "council tax register glasgow"],
    "edinburgh": ["edinburgh council tax", "edinburgh council tax payments", "edinburgh council tax contact number",
                  "council tax band d edinburgh", "council tax online edinburgh", "edinburgh council tax reduction", "edinburgh council tax register"],
}
for old, name in COUNCILS:
    kw = f"{name} council tax bands"
    title_name = name.title().replace(" And ", " and ")
    h2 = H2_EXTRA.get(name, []) + [f"council tax reduction {name}", f"{name} council tax single person discount", f"{name} council tax band checker"]
    page("Council tax", 1 if name in ("glasgow", "edinburgh") else 2, kw,
         f"{title_name} Council Tax Bands 2026/27: Band A to H Prices", f"{title_name} council tax bands 2026/27", "move",
         current=f"/council-tax-bands-scotland/{old}", h2=h2, data="council tax data held (councilTax.ts)",
         notes="Slug also contains '<council> council tax', the bigger search for Glasgow (14,800) and Edinburgh (12,100)")
page("Council tax", 1, "council tax bands scotland", "Council Tax Bands Scotland 2026/27: Prices A to H for Every Council",
     "Council tax bands Scotland 2026/27", "retitle", current="/council-tax-bands-scotland",
     h2=["council tax rates scotland", "council tax increase scotland", "water rates scotland"])
for b in "abcdefgh":
    page("Council tax", 2, f"council tax band {b} scotland", f"Council Tax Band {b.upper()} Scotland 2026/27: Monthly Cost by Council",
         f"Council tax band {b.upper()} Scotland: monthly and yearly cost", "move", current=f"/council-tax-bands-scotland/band-{b}",
         h2=[f"council tax band {b}"])
page("Council tax", 1, "check council tax band", "Check Council Tax Band in Scotland: Find My Council Tax Band",
     "Check council tax band: find your band in Scotland", "new",
     h2=["find my council tax band", "check my council tax band", "how to find out your council tax band", "council tax check scotland"],
     data="Scottish Assessors portal (link out), band values", notes="2,400 a month; also the route to appeals")
page("Council tax", 2, "council tax reduction scotland", "Council Tax Reduction Scotland: Who Qualifies and How to Apply",
     "Council tax reduction Scotland: who qualifies and how much", "new",
     h2=["council tax reduction edinburgh", "south lanarkshire council tax reduction", "north lanarkshire council tax reduction"],
     data="gov.scot / mygov.scot")
page("Council tax", 2, "council tax increase scotland", "Council Tax Increase Scotland 2026/27: Every Council's Rise",
     "Council tax increase Scotland: every council's rise in 2026/27", "move", current="/blog/council-tax-rises-scotland-2026-27",
     notes="Update for 2027/28 in February and March")
page("Council tax", 3, "single person discount council tax scotland", "Single Person Discount Council Tax Scotland: 25% Off and How to Claim",
     "Single person discount council tax Scotland: how to claim 25% off", "new",
     h2=["council tax discounts scotland"], data="mygov.scot")
page("Council tax", 3, "water rates scotland", "Water Rates Scotland 2026/27: Charges by Council Tax Band",
     "Water rates Scotland: what every band pays in 2026/27", "new", data="Scottish Water charges (held in councilTax.ts)")

# ---------------------------------------------------------------- Benefits
page("Benefits", 1, "adult disability payment", "Adult Disability Payment 2026/27: Rates, Who Qualifies, How to Apply",
     "Adult disability payment: rates, eligibility and how to apply", "new",
     h2=["apply for adult disability payment", "adult disability payment rates", "adult disability payment login", "adult disability payments"],
     data="Social Security Scotland, mygov.scot")
page("Benefits", 1, "adult disability payment phone number", "Adult Disability Payment Phone Number: Call Times and What to Have Ready",
     "Adult disability payment phone number", "new", h2=["adult disability payment number"], data="Social Security Scotland")
page("Benefits", 1, "winter fuel payment", "Winter Fuel Payment Scotland 2026: Who Gets It, How Much and When",
     "Winter fuel payment in Scotland: who gets it, how much and when", "new", slug="/winter-fuel-payment-scotland",
     h2=["winter fuel payment dates", "winter fuel payment for pensioners", "do all pensioners get winter fuel allowance",
         "how much is the winter fuel payment", "when is the winter fuel payment paid", "winter fuel payment and pip"],
     data="Social Security Scotland (Pension Age Winter Heating Payment)", notes="8,100 a month; Scotland has its own payment, verify before writing")
page("Benefits", 1, "crisis grant", "Crisis Grant Scotland: How to Apply, What You Get, Phone Numbers",
     "Crisis grant Scotland: how to apply and what you get", "move", slug="/crisis-grant-scotland", current="/blog/crisis-grant-scotland-how-to-apply",
     h2=["apply for crisis grant", "crisis grant application", "crisis grant apply online", "apply for crisis loan"],
     data="Scottish Welfare Fund statistics (held)")
page("Benefits", 1, "crisis grant phone number", "Crisis Grant Phone Number for Every Scottish Council",
     "Crisis grant phone number: every council in Scotland", "new", data="32 council websites", notes="Table of 32 numbers and opening hours")
page("Benefits", 1, "carer support payment", "Carer Support Payment 2026/27: Rates, Who Qualifies, How to Apply",
     "Carer support payment: rates, eligibility and how to apply", "new", data="Social Security Scotland")
page("Benefits", 1, "best start grant", "Best Start Grant 2026/27: Pregnancy, Early Learning and School Payments",
     "Best start grant: what you get and how to apply", "new",
     h2=["best start grant early learning payment", "apply for best start grant", "best start early learning payment"], data="Social Security Scotland")
page("Benefits", 2, "winter heating payment", "Winter Heating Payment 2026: Who Gets It and When It Is Paid",
     "Winter heating payment: who gets it and when", "new", h2=["winter heating allowance"], data="Social Security Scotland")
page("Benefits", 2, "social security scotland payment dates", "Social Security Scotland Payment Dates 2026 Including Christmas",
     "Social security Scotland payment dates for 2026", "new", data="Social Security Scotland", notes="Christmas dates drive a December peak")
page("Benefits", 3, "young carers allowance", "Young Carers Allowance Scotland: The Young Carer Grant Explained",
     "Young carers allowance in Scotland: the Young Carer Grant", "new", slug="/young-carers-allowance-scotland", data="Social Security Scotland")
page("Benefits", 2, "scottish child payment", "Scottish Child Payment 2026/27: How Much and How to Apply",
     "Scottish child payment: how much it is and how to apply", "move", current="/blog/what-is-the-scottish-child-payment",
     notes="No planner volume returned; GSC shows 224 impressions")

# ---------------------------------------------------------------- Representatives
page("Who represents you", 1, "who is my local councillor by postcode", "Who Is My Local Councillor by Postcode? Find Your Councillors",
     "Who is my local councillor by postcode?", "new",
     h2=["find my councillor", "who are my councillors", "local councillor for my area", "councillors in my area", "my local councillor"],
     data="Postcodes.io ward lookup + council councillor pages", notes="About 3,000 a month across variants; peaks in May, and the council elections are 6 May 2027")
page("Who represents you", 1, "who is my msp", "Who Is My MSP? Find Your MSP and MP by Postcode",
     "Who is my MSP? Find your MSP and MP by postcode", "new",
     h2=["who is my msp by postcode", "find my msp", "my msp", "msp for my area"],
     data="Existing finder", notes="Planner returned no MSP data; Search Console shows ~4,800 impressions in 3 months. /find-my-mp-and-msp redirects here")

# ---------------------------------------------------------------- Local data
page("Your area", 2, "life expectancy glasgow", "Life Expectancy Glasgow: How Long People Live, Area by Area",
     "Life expectancy Glasgow: the figures and the gap", "new", h2=["average life expectancy glasgow", "glasgow male life expectancy"],
     data="ONS/NRS (held: ons-life-expectancy-glasgow-scotland.csv)")
page("Your area", 2, "unemployment scotland", "Unemployment Scotland 2026: Rate, Trend and Council Figures",
     "Unemployment Scotland: the rate, the trend and your council", "new",
     h2=["scotland unemployment rate", "youth unemployment scotland", "scotland employment rate"], data="ONS APS + claimant count (held)")
page("Your area", 2, "crime rate glasgow", "Crime Rate Glasgow: Recorded Crime by Type and Year",
     "Crime rate Glasgow: what the police figures show", "new", h2=["crime stats glasgow"], data="Recorded Crime in Scotland (partly held)")
page("Your area", 2, "poverty in scotland", "Poverty in Scotland: The Figures, the Causes and Who Can Fix It",
     "Poverty in Scotland: the figures, the causes and who can fix it", "move", current="/poverty", h2=["poverty statistics scotland", "poverty rates in scotland"])
page("Your area", 2, "energy price cap", "Energy Price Cap January 2027: What It Means in Scotland",
     "Energy price cap: what it means in Scotland", "move", slug="/energy-price-cap-scotland", current="/blog/energy-price-cap-scotland-2026-explained",
     h2=["ofgem price cap", "price cap"], notes="Ofgem announces the January cap in late November")
page("Your area", 3, "house prices in edinburgh", "House Prices in Edinburgh 2026: Average Price by Area and Type",
     "House prices in Edinburgh: the average and the trend", "new", h2=["average house price edinburgh"], data="Registers of Scotland (not held yet)")
page("Your area", 3, "simd postcode checker", "SIMD Postcode Checker: How Deprived Is Your Area?",
     "SIMD postcode checker: look up your area's deprivation rank", "new", data="SIMD 2020v2 (not held yet)")
page("Your area", 3, "food banks glasgow", "Food Banks Glasgow: Where They Are and How to Get Help",
     "Food banks Glasgow: where to get help", "new", data="Needs a maintained directory", notes="Only if it can be kept current")
page("Your area", 3, "best council in scotland", "Best Council in Scotland 2026: All 32 Ranked",
     "Best council in Scotland: all 32 ranked", "move", current="/blog/best-performing-councils-scotland")

# ---------------------------------------------------------------- Schools
page("Schools", 1, "higher modern studies past papers", "Higher Modern Studies Past Papers and Practice Questions With Real Data",
     "Higher modern studies past papers and practice questions", "new", h2=["sqa past papers higher modern studies"],
     data="Links to SQA's own papers; practice questions from site data", notes="Peaks April to May; never rehost SQA papers")
page("Schools", 1, "national 5 modern studies", "National 5 Modern Studies: Course Guide, Notes and Real Data",
     "National 5 modern studies: the course in plain English", "new",
     h2=["national 5 modern studies revision notes", "national 5 modern studies model answers"])
page("Schools", 1, "higher modern studies", "Higher Modern Studies: Course Guide, Skills and Real Data",
     "Higher modern studies: the course, the skills and the evidence", "new", h2=["bbc bitesize higher modern studies"])
page("Schools", 1, "modern studies", "Modern Studies: Free Resources for Pupils and Teachers in Scotland",
     "Modern studies: free resources for pupils and teachers", "new", h2=["modern studies resources", "modern studies revision"],
     notes="Hub for the schools section")
page("Schools", 2, "nat 5 modern studies past papers", "Nat 5 Modern Studies Past Papers and Practice Questions",
     "Nat 5 modern studies past papers and practice questions", "new", h2=["modern studies nat 5 past papers"])
page("Schools", 2, "advanced higher modern studies", "Advanced Higher Modern Studies: Course Guide and Data Sources",
     "Advanced higher modern studies: the course and where to find data", "new")
page("Schools", 3, "causes of poverty", "Causes of Poverty: What the Scottish Evidence Shows",
     "Causes of poverty: what the evidence shows in Scotland", "new", h2=["effects of poverty", "impact of poverty", "effects of childhood poverty"])

out = ROOT / "research/keywords/content-plan.json"
out.write_text(json.dumps(PAGES, indent=1, ensure_ascii=False))
moves = [p for p in PAGES if p["action"] == "move"]
print(f"{len(PAGES)} pages: {sum(p['action']=='new' for p in PAGES)} new, {len(moves)} moved, "
      f"{sum(p['action']=='retitle' for p in PAGES)} retitled. Primary demand {sum(p['volume'] for p in PAGES):,}/month")
for t in (1, 2, 3):
    ps = [p for p in PAGES if p["tier"] == t]
    print(f"tier {t}: {len(ps)} pages, {sum(p['volume'] for p in ps):,}/month")
