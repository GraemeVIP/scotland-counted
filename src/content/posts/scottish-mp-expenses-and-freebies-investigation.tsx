import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";

const TOP_10_NON_STAFF = [
  [
    <Link
      key="downie"
      href="/representatives/mps/dunfermline-and-dollar#donations-and-interests"
      className="font-[600]"
    >
      1. Graeme Downie (Labour)
    </Link>,
    "Dunfermline and Dollar",
    "£151,953.90",
    "£410,253.24",
    "£41,435 flat rent + £8,539 hotels (39 nights) + £29,820 flights + £3,308 parking + £11,882 trips to Taiwan, US & Spain",
  ],
  [
    <Link
      key="law"
      href="/representatives/mps/dundee-central#donations-and-interests"
      className="font-[600]"
    >
      2. Chris Law (SNP)
    </Link>,
    "Dundee Central",
    "£129,065.55",
    "£386,082.24",
    "£6,292.29 car parking (#1 in Scotland) + £11,619 hotels (77 nights) on top of £28,200 flat rent + £1,260 flat energy bills",
  ],
  [
    <Link
      key="doogan"
      href="/representatives/mps/angus-and-perthshire-glens#donations-and-interests"
      className="font-[600]"
    >
      3. Dave Doogan (SNP)
    </Link>,
    "Angus and Perthshire Glens",
    "£127,847.30",
    "£381,362.05",
    "£27,600 flat rent + £8,258 hotels + £26,217 flights + £2,458 parking + £1,860 Silverstone Formula 1 VIP tickets",
  ],
  [
    <Link
      key="carmichael"
      href="/representatives/mps/orkney-and-shetland#donations-and-interests"
      className="font-[600]"
    >
      4. Alistair Carmichael (Lib Dem)
    </Link>,
    "Orkney and Shetland",
    "£124,028.74",
    "£378,791.43",
    "£35,437.22 flights (#1 in Scotland) + £6,301.65 family travel + £1,611 second home council tax + rental property income",
  ],
  [
    <Link
      key="blackman"
      href="/representatives/mps/aberdeen-north#donations-and-interests"
      className="font-[600]"
    >
      5. Kirsty Blackman (SNP)
    </Link>,
    "Aberdeen North",
    "£121,470.95",
    "£377,344.08",
    "£39,951.21 flat rent + £5,473 hotels + £7,307.88 family travel (#2 in Scotland) + £27,472 flights + £2,910 taxis",
  ],
  [
    <Link
      key="bowie"
      href="/representatives/mps/west-aberdeenshire-and-kincardine#donations-and-interests"
      className="font-[600]"
    >
      6. Andrew Bowie (Conservative)
    </Link>,
    "West Aberdeenshire and Kincardine",
    "£121,470.92",
    "£369,657.75",
    "Voted NO to scrapping 2-child benefit cap; claimed £32,480 flat rent + £33,100 flights + £20,000 donor + £1,100 Silverstone F1 tickets",
  ],
  [
    <Link
      key="poynton"
      href="/representatives/mps/livingston#donations-and-interests"
      className="font-[600]"
    >
      7. Gregor Poynton (Labour)
    </Link>,
    "Livingston",
    "£115,007.84",
    "£372,851.44",
    "£5,232.79 taxis (#1 in Scotland) + £3,629.54 second home council tax (#2) + £6,232 family travel + £11,000 donations + £1,110 VIP cricket/football",
  ],
  [
    <Link
      key="ohara"
      href="/representatives/mps/argyll-bute-and-south-lochaber#donations-and-interests"
      className="font-[600]"
    >
      8. Brendan O&apos;Hara (SNP)
    </Link>,
    "Argyll, Bute and South Lochaber",
    "£114,984.88",
    "£365,343.24",
    "£29,322 flat rent + £4,979 hotels + £3,109 parking + employs wife as Office Manager + £1,525 Champions League & Hampden VIP boxes",
  ],
  [
    <Link
      key="ahmed"
      href="/representatives/mps/glasgow-south-west#donations-and-interests"
      className="font-[600]"
    >
      9. Dr Zubir Ahmed (Labour)
    </Link>,
    "Glasgow South West",
    "£111,044.90",
    "£367,245.39",
    "£43,475.49 across 323 London hotel nights (#1 hotel bill in Scotland) + £4,204 family travel + £30,000 private donation",
  ],
  [
    <Link
      key="ward"
      href="/representatives/mps/cowdenbeath-and-kirkcaldy#donations-and-interests"
      className="font-[600]"
    >
      10. Melanie Ward (Labour)
    </Link>,
    "Cowdenbeath and Kirkcaldy",
    "£101,035.36",
    "£346,629.85",
    "£7,932.47 family travel (#1 in Scotland) + £3,302.72 second home council tax (#3) + £5,957 Qatar trip + £2,202 Syria trip",
  ],
];

const PARTY_ROWS = [
  [
    "Scottish Labour (37 MPs)",
    "£3,343,933 (£90,377/MP)",
    "£59,231 (73% of Scotland total)",
    "£152,908 (71% of Scotland total)",
    "£58,905 family · £29,317 taxis",
    "£169,931 (£105.6k donors · £57.3k trips)",
  ],
  [
    "SNP (8 MPs; 7 in 2025/26 IPSA)",
    "£778,624 (£111,232/MP)",
    "£7,761",
    "£38,638",
    "£19,749 family · £17,033 parking",
    "£11,902 (£0 donors · £7.5k trips · £4.4k gifts)",
  ],
  [
    "Conservatives (6 MPs; 5 in IPSA)",
    "£523,512 (£104,702/MP)",
    "£7,218",
    "£7,082",
    "£10,708 parking · £1,501 family",
    "£80,001 (£71.1k donors · £6.9k trips)",
  ],
  [
    "Liberal Democrats (6 MPs)",
    "£564,881 (£94,147/MP)",
    "£7,437",
    "£16,788",
    "£8,654 family · £6,422 taxis",
    "£35,061 (£28.6k donors · £4.9k trips)",
  ],
];

export default function Post() {
  return (
    <Prose>
      <Lead>
        Every Scottish MP gets paid a basic salary of £91,346 a year. That puts them comfortably in
        the top 5% of earners in the country before a single penny of expenses is claimed. Yet when
        you open the 7,268 individual receipt lines published by IPSA for 2025/26 alongside the
        House of Commons Register of Financial Interests, you find 47 of Scotland&apos;s MPs billing
        the taxpayer £81,646.92 to pay the council tax on their second homes, 38 MPs billing
        £39,218.00 for their second home gas, electricity and water bills, £43,475.49 for a single
        MP&apos;s London hotel rooms, £6,292.29 for one MP&apos;s car parking, and £296,894.97 in
        private donations, funded trips to Qatar, China and Taiwan, and VIP boxes at Silverstone,
        Murrayfield and Hampden.
      </Lead>

      <P>
        We pulled every single 2025/26 expense receipt and financial declaration across all 57
        Scottish constituencies and put them into our live{" "}
        <Link href="/mp-expenses-scotland">Scottish MP Expenses, Donations and Freebies Tracker</Link>{" "}
        and onto each individual <Link href="/representatives">MP profile page</Link>. Here is what
        the records show, named and itemised.
      </P>

      <BigStat
        value="£4,970,382"
        label="Billed to taxpayers by Scottish MPs in 2025/26 for their own London flats, council tax, heating bills, hotels, flights, parking, taxis, family travel and offices (on top of £13.57m for staff wages and a £91,346 salary)."
        exact="Plus £296,894.97 declared on the Register of Interests across 23 private donations (£205,242.29), 33 funded overseas visits (£76,556.68) and 22 VIP gifts and hospitality packages (£15,096.00)."
      />

      <H2 id="second-home-bills">
        1. Why do MPs even have second homes (and why are taxpayers paying bills on properties MPs
        already own)?
      </H2>
      <P>
        Most people assume that if you take a £91,346 job in London, you either pay your own rent or
        stay in a budget hotel when you need to be there. At Westminster, IPSA rules allow Scottish
        MPs to designate one house as their &quot;main home&quot; and bill the public for a{" "}
        <strong>second home</strong> (either a rented flat in London, or their house in Scotland if
        they already live in London).
      </P>
      <P>
        After the 2009 MPs&apos; expenses scandal, voters were told the system had been cleaned up
        so MPs could no longer use taxpayer money to pay off personal mortgages. What the public was
        never told is the loophole that replaced it: <strong>even if an MP already owns their second
        property outright and claims £0 in rent</strong>, IPSA still lets them bill taxpayers for
        the council tax, gas, electricity, water, factor fees, buildings insurance, broadband and
        even drain cleaning on that property.
      </P>
      <P>
        In 2025/26, 47 of the 55 Scottish MPs in the annual dataset billed taxpayers{" "}
        <strong>£81,646.92</strong> for their second home council tax, while 38 MPs billed taxpayers{" "}
        <strong>£39,218.00</strong> for their second home heating and utility bills:
      </P>
      <UL>
        <LI>
          <strong>Claiming £6,493 in bills on a property with £0 rent:</strong> Lothian East Labour
          MP and Government Minister{" "}
          <Link href="/representatives/mps/lothian-east#donations-and-interests">
            Douglas Alexander
          </Link>{" "}
          (who declares co-owning residential properties in East Lothian and Argyll) claimed{" "}
          <strong>£0 for rent</strong>, yet billed taxpayers <strong>£4,093.21</strong> for his
          second home council tax (the highest in Scotland), <strong>£1,683.00</strong> for factor
          service charges, <strong>£385.50</strong> for broadband and landline, and{" "}
          <strong>£330.81</strong> for buildings insurance.
        </LI>
        <LI>
          <strong>Drain jet-washing, buildings insurance and a £3,000 speech coach:</strong>{" "}
          Inverness, Skye and West Ross-shire Lib Dem MP{" "}
          <Link href="/representatives/mps/inverness-skye-and-west-ross-shire#donations-and-interests">
            Angus MacDonald
          </Link>{" "}
          (who declares a commercial office building in Stirling and forestry in Ayr) also claimed{" "}
          <strong>£0 for rent</strong>, but billed taxpayers <strong>£3,314.09</strong> for his
          second home utilities (highest in Scotland), <strong>£939.24</strong> for London flat
          service charges, <strong>£745.55</strong> for second home buildings insurance,{" "}
          <strong>£546.00</strong> for &quot;professional pressure jet wash and mechanical cable
          drainage cleaning&quot; at his accommodation, and <strong>£3,000.00</strong> for a
          &quot;personalised presentation and speech skills workshop&quot;.
        </LI>
        <LI>
          <strong>Claiming £6,394 in second home bills while renting out an Edinburgh flat:</strong>{" "}
          Former Scottish Secretary{" "}
          <Link href="/representatives/mps/edinburgh-south#donations-and-interests">
            Ian Murray
          </Link>{" "}
          (Edinburgh South, Labour, who declares earning rental income from a flat in Edinburgh)
          claimed <strong>£0 for rent</strong>, yet billed taxpayers <strong>£3,197.22</strong> for
          his second home utilities, <strong>£2,822.38</strong> for second home council tax, and{" "}
          <strong>£374.73</strong> for annual buildings insurance.
        </LI>
        <LI>
          <strong>Other top second home council tax claimants:</strong> Livingston Labour MP{" "}
          <Link href="/representatives/mps/livingston#donations-and-interests">Gregor Poynton</Link>{" "}
          claimed <strong>£3,629.54</strong>, Cowdenbeath and Kirkcaldy Labour MP{" "}
          <Link href="/representatives/mps/cowdenbeath-and-kirkcaldy#donations-and-interests">
            Melanie Ward
          </Link>{" "}
          claimed <strong>£3,302.72</strong>, and Glenrothes Labour MP{" "}
          <Link href="/representatives/mps/glenrothes-and-mid-fife#donations-and-interests">
            Richard Baker
          </Link>{" "}
          claimed <strong>£2,938.52</strong>.
        </LI>
      </UL>
      <P>
        Put that beside what their constituents face. Ordinary households in Scotland are dealing
        with <Link href="/council-tax-increase-scotland">steep council tax rises</Link> and an
        Ofgem <Link href="/energy-price-cap-scotland">energy price cap forecast at £2,166</Link>.
        Low income families in Scotland do not even receive the{" "}
        <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link> automatically and
        have to scramble to apply before supplier pots close, or turn to{" "}
        <Link href="/council-tax-reduction-scotland">means tested Council Tax Reduction</Link> and
        emergency <Link href="/crisis-grant-scotland">Scottish Welfare Fund Crisis Grants</Link>{" "}
        when their meter runs out.
      </P>

      <H2 id="flats-and-hotels">
        2. £3,500 a month London flats, £43,475 hotel tabs, and claiming both at the same time
      </H2>
      <P>
        Across Scotland&apos;s MPs, taxpayers paid <strong>£1,383,619.92</strong> for second home
        rent and <strong>£215,415.76</strong> for London hotel rooms in 2025/26. When you check the
        individual line items against average rents, three things stand out immediately:
      </P>
      <UL>
        <LI>
          <strong>£43,475.49 for 323 London hotel nights:</strong> Glasgow South West Labour MP{" "}
          <Link href="/representatives/mps/glasgow-south-west#donations-and-interests">
            Dr Zubir Ahmed
          </Link>{" "}
          did not rent a London flat in 2025/26. Instead, he billed taxpayers{" "}
          <strong>£43,475.49 across 323 London hotel nights</strong>, plus{" "}
          <strong>£4,204.44</strong> for family travel and <strong>£1,027.96</strong> for taxis. To
          put £43,475 for hotel rooms in perspective, a full time worker on the{" "}
          <Link href="/minimum-wage-scotland">Minimum Wage in Scotland</Link> takes home roughly
          £20,850 for a whole year&apos;s work after tax. In Dr Ahmed&apos;s{" "}
          <Link href="/constituencies/glasgow-south-west">Glasgow South West constituency</Link>,{" "}
          <strong>5,840 children (30.8%)</strong> live in poverty after housing costs. On top of his
          MP salary and expenses, Dr Ahmed also declared a <strong>£30,000.00</strong> private
          donation from Francesca Sainsbury Perrin.
        </LI>
        <LI>
          <strong>£42,000 a year (£3,500 a month) for a London flat:</strong> Glasgow East Labour MP{" "}
          <Link href="/representatives/mps/glasgow-east#donations-and-interests">John Grady</Link>{" "}
          claimed the maximum <strong>£42,000.00</strong> for London flat rent (£3,500 every month,
          more than triple a typical Glasgow private rent), plus <strong>£2,486.44</strong> for his
          second home council tax and <strong>£949.42</strong> for his utilities. In{" "}
          <Link href="/constituencies/glasgow-east">Glasgow East</Link>,{" "}
          <strong>6,729 children (34.4%)</strong> live in poverty after housing costs. On the
          Register of Interests, Mr Grady also declared a <strong>£7,000.00</strong> trip to Qatar
          paid for by the <strong>Ministry of Foreign Affairs of Qatar</strong>.
        </LI>
        <LI>
          <strong>Billing thousands for London hotels ON TOP of a rented London flat:</strong>{" "}
          Dundee Central SNP MP{" "}
          <Link href="/representatives/mps/dundee-central#donations-and-interests">Chris Law</Link>{" "}
          billed taxpayers <strong>£28,200.00</strong> (£2,350 a month) for a rented London flat,{" "}
          <strong>£762.88</strong> for its council tax and <strong>£1,260.25</strong> for its
          utilities, and then billed taxpayers an extra <strong>£11,618.57 for 77 nights in London
          hotels</strong> on top. Dunfermline and Dollar Labour MP{" "}
          <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
            Graeme Downie
          </Link>{" "}
          billed taxpayers <strong>£41,434.53</strong> (£3,453 a month) for second home rent plus{" "}
          <strong>£1,695.30</strong> for council tax, and still claimed an extra{" "}
          <strong>£8,539.00 for 39 nights in London hotels</strong>.
        </LI>
      </UL>

      <H2 id="family-parking-taxis">
        3. £7,932 for family flights, £6,292 for car parking, and £5,233 for taxis
      </H2>
      <P>
        In almost every normal job in Scotland, if you drive to the station, park your car, jump in
        a taxi, or want to bring your partner or children with you on a work trip, you pay for it
        out of your own wages. At Westminster, taxpayers pick up the tab:
      </P>
      <UL>
        <LI>
          <strong>£89,110.80 for family and spouse travel (35 MPs):</strong> Cowdenbeath and
          Kirkcaldy Labour MP{" "}
          <Link href="/representatives/mps/cowdenbeath-and-kirkcaldy#donations-and-interests">
            Melanie Ward
          </Link>{" "}
          topped Scotland by billing taxpayers <strong>£7,932.47</strong> for family travel
          (including <strong>£7,607.27</strong> for family flights), alongside{" "}
          <strong>£3,302.72</strong> for her second home council tax, <strong>£1,038.75</strong>{" "}
          for second home energy bills, and <strong>£19,140.03</strong> in flat rent (£1,595 a
          month, double the average private rent in Fife). In{" "}
          <Link href="/constituencies/cowdenbeath-and-kirkcaldy">Cowdenbeath and Kirkcaldy</Link>,{" "}
          <strong>4,581 children (26.2%)</strong> live in poverty. Ms Ward also declared a{" "}
          <strong>£5,957.00</strong> trip to Qatar funded by the Doha Forum and a{" "}
          <strong>£2,202.27</strong> trip to Syria. Aberdeen North SNP MP{" "}
          <Link href="/representatives/mps/aberdeen-north#donations-and-interests">
            Kirsty Blackman
          </Link>{" "}
          was second for family travel on <strong>£7,307.88</strong>, followed by{" "}
          <Link href="/representatives/mps/orkney-and-shetland#donations-and-interests">
            Alistair Carmichael
          </Link>{" "}
          (<strong>£6,301.65</strong>) and Livingston Labour MP{" "}
          <Link href="/representatives/mps/livingston#donations-and-interests">Gregor Poynton</Link>{" "}
          (<strong>£6,232.41</strong>).
        </LI>
        <LI>
          <strong>£58,237.33 for airport and station car parking (35 MPs):</strong> Dundee Central
          SNP MP{" "}
          <Link href="/representatives/mps/dundee-central#donations-and-interests">Chris Law</Link>{" "}
          billed taxpayers <strong>£6,292.29</strong> for car parking in a single year (the
          equivalent of £121 every week of the year just to park a car), followed by Labour&apos;s{" "}
          <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
            Graeme Downie
          </Link>{" "}
          (<strong>£3,308.30</strong>), Conservative MP{" "}
          <Link href="/representatives/mps/berwickshire-roxburgh-and-selkirk#donations-and-interests">
            John Lamont
          </Link>{" "}
          (<strong>£3,196.71</strong>), Labour&apos;s{" "}
          <Link href="/representatives/mps/north-ayrshire-and-arran#donations-and-interests">
            Irene Campbell
          </Link>{" "}
          (<strong>£3,192.83</strong>) and SNP MP{" "}
          <Link href="/representatives/mps/argyll-bute-and-south-lochaber#donations-and-interests">
            Brendan O&apos;Hara
          </Link>{" "}
          (<strong>£3,109.46</strong>).
        </LI>
        <LI>
          <strong>£45,320.45 for taxi fares (48 MPs):</strong> Livingston Labour MP{" "}
          <Link href="/representatives/mps/livingston#donations-and-interests">Gregor Poynton</Link>{" "}
          billed taxpayers <strong>£5,232.79</strong> for taxis (over £100 a week on cabs), on top
          of <strong>£3,629.54</strong> for his second home council tax, <strong>£1,611.21</strong>{" "}
          for second home energy bills, <strong>£24,290.75</strong> for flights and{" "}
          <strong>£6,232.41</strong> for family flights, while taking <strong>£11,000</strong> in
          private donations and <strong>£1,110</strong> in free VIP tickets to Lord&apos;s Cricket
          Ground and the Carabao Cup Final at Wembley.
        </LI>
      </UL>

      <H2 id="remote-voting-and-carbon">
        4. The 145-day Westminster week, remote voting, and £912,655 in flights
      </H2>
      <P>
        Two questions come up every time regular workers look at these numbers. First, why do MPs
        need full year £3,500 a month London flats and £43,000 hotel budgets when the House of
        Commons only sits for around <strong>145 days a year</strong> (typically Monday afternoon to
        Thursday)?
      </P>
      <P>
        During 2020 and 2021, Westminster proved beyond doubt that MPs could take part in committee
        hearings by video call on Microsoft Teams or Zoom and cast their division votes remotely by
        phone. The <strong>Scottish Parliament at Holyrood still uses digital remote voting</strong>{" "}
        today. Westminster chose to scrap remote voting and force MPs back into walking through
        wooden lobbies in person, a decision that locks in <strong>£1.38 million a year</strong> in
        London flat rents, <strong>£215,416</strong> in London hotels and{" "}
        <strong>£89,111</strong> in spouse and child travel for Scottish MPs alone.
      </P>
      <P>
        Second is the climate contradiction. Westminster sets the carbon budgets and net zero
        targets that households are asked to live within, and that shape what families pay for
        fuel, heating and travel. Yet in 2025/26, Scotland&apos;s 55 MPs billed taxpayers{" "}
        <strong>£912,654.62 for their own flights</strong>,
        plus <strong>£58,237.33 for airport and station car parking</strong>. That includes Central
        Belt MPs sitting right on the direct 4.5 hour East Coast main rail line to King&apos;s
        Cross, such as Dunfermline and Dollar MP{" "}
        <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
          Graeme Downie
        </Link>{" "}
        (<strong>£29,819.74</strong> on flights vs £3,935 on rail) and Livingston MP{" "}
        <Link href="/representatives/mps/livingston#donations-and-interests">Gregor Poynton</Link>{" "}
        (<strong>£24,290.75</strong> on flights vs £2,415 on rail).
      </P>

      <H2 id="voting-against-help">
        5. Voting against child poverty support while claiming £497,461 in expenses and F1 freebies
      </H2>
      <P>
        In February 2026, MPs voted on the bill to remove the{" "}
        <Link href="/scottish-child-payment">two child benefit limit on Universal Credit</Link>, the
        rule that denied low income families £3,514 a year for a third or subsequent child. Five
        Scottish Conservative MPs voted <strong>No</strong> to scrapping the two child cap:{" "}
        <Link href="/representatives/mps/west-aberdeenshire-and-kincardine#donations-and-interests">
          Andrew Bowie
        </Link>
        ,{" "}
        <Link href="/representatives/mps/berwickshire-roxburgh-and-selkirk#donations-and-interests">
          John Lamont
        </Link>
        ,{" "}
        <Link href="/representatives/mps/dumfriesshire-clydesdale-and-tweeddale#donations-and-interests">
          David Mundell
        </Link>
        ,{" "}
        <Link href="/representatives/mps/dumfries-and-galloway#donations-and-interests">
          John Cooper
        </Link>{" "}
        and{" "}
        <Link href="/representatives/mps/gordon-and-buchan#donations-and-interests">
          Harriet Cross
        </Link>
        .
      </P>
      <P>
        When you check the 2025/26 IPSA and Register of Interests files for those exact same five
        MPs, you find that between them they claimed <strong>£497,461.46 in non-staff
        expenses</strong> on top of their £91,346 salaries:
      </P>
      <UL>
        <LI>
          <strong>£144,680.23</strong> for their own London flat rents,{" "}
          <strong>£6,766.33</strong> for their second home council tax, and{" "}
          <strong>£4,033.24</strong> for their second home heating and utilities.
        </LI>
        <LI>
          <strong>£8,566.41</strong> for their own family and dependant travel to London (claimed by
          Andrew Bowie, John Lamont, David Mundell and Harriet Cross).
        </LI>
        <LI>
          <strong>£80,000.69</strong> in private donations, foreign trips and VIP gifts across the
          Conservative group, including <strong>£20,000</strong> from businessman Alasdair Locke and{" "}
          <strong>£1,100 in Silverstone British Grand Prix VIP tickets</strong> for{" "}
          <Link href="/representatives/mps/west-aberdeenshire-and-kincardine#donations-and-interests">
            Andrew Bowie
          </Link>
          , <strong>£11,100</strong> from the Coalition for Global Prosperity for{" "}
          <Link href="/representatives/mps/dumfriesshire-clydesdale-and-tweeddale#donations-and-interests">
            David Mundell
          </Link>
          , and <strong>£40,000</strong> in political donations plus a{" "}
          <strong>£925 Wentworth PGA Golf VIP ticket</strong> for{" "}
          <Link href="/representatives/mps/gordon-and-buchan#donations-and-interests">
            Harriet Cross
          </Link>
          .
        </LI>
      </UL>

      <H2 id="party-tally">
        6. The Party Tally: Scottish Labour accounts for 73% of second home council tax and 75% of
        foreign trips
      </H2>
      <P>
        Breaking the entire dataset down by political party shows where the claims and freebies are
        concentrated. Scottish Labour won 37 of Scotland&apos;s 57 seats (65%) on a promise to clean
        up Westminster politics. Yet Labour MPs account for <strong>73% of all second home council
        tax</strong> billed to taxpayers (£59,231), <strong>71% of all London hotel spending</strong>{" "}
        (£152,908), <strong>75% of all funded foreign trips</strong> (£57,288, including delegations
        to Qatar, China, Taiwan and Syria), and <strong>both commercial lobbying spouse
        declarations</strong> ({" "}
        <Link href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests">
          Joani Reid
        </Link>
        , whose husband works in lobbying and is a director of Earthcott Ltd, a company that also
        gave her £2,400 of free media training, and{" "}
        <Link href="/representatives/mps/paisley-and-renfrewshire-south#donations-and-interests">
          Johanna Baxter
        </Link>
        , whose husband is Executive Chairman of lobbying agency SEC Newgate UK).
      </P>

      <div className="my-7">
        <GuideTable
          kicker="2025/26 IPSA Expenses & Commons Register · By Party"
          title="How Scotland's four Westminster parties compare on expenses and private freebies"
          columns={[
            "Party",
            "Non-Staff Expenses (Avg/MP)",
            "2nd Home Council Tax",
            "London Hotels",
            "Family, Taxis & Parking",
            "Private Donations & Trips",
          ]}
          align={["left", "right", "right", "right", "right", "right"]}
          rows={PARTY_ROWS}
          caption="Source: Calculated from IPSA 2025/26 totalSpend and individualBusinessCosts datasets and the UK Parliament Register of Interests (checked 21 November 2026)."
        />
      </div>

      <H2 id="buried-receipts">
        7. What else is buried in the 7,268 receipts: £3,000 speech coaches, European hotels, PR
        agencies, £1,248 iPhones and duplicate claims
      </H2>
      <P>
        When you read past the headline categories and inspect the individual receipt descriptions
        in IPSA&apos;s raw 2025/26 <code>individualBusinessCosts</code> file, a second layer of
        spending appears:
      </P>
      <UL>
        <LI>
          <strong>£3,000 for a personal speech coach & £546 for drain jet-washing:</strong>{" "}
          Inverness, Skye and West Ross-shire Lib Dem MP{" "}
          <Link href="/representatives/mps/inverness-skye-and-west-ross-shire#donations-and-interests">
            Angus MacDonald
          </Link>{" "}
          billed taxpayers <strong>£3,000.00</strong> for a &quot;personalised presentation and
          speech skills workshop to assist MPs representational role in Parliament&quot;, plus{" "}
          <strong>£546.00</strong> across two claims (£312 and £234) for &quot;professional
          pressure jet wash and mechanical cable drainage cleaning&quot; at his accommodation.
        </LI>
        <LI>
          <strong>£40,449.35 on external PR, media and consultancy firms:</strong> Despite receiving
          a £255,000 staffing budget, MPs billed taxpayers tens of thousands for outside PR and
          creative agencies, including <strong>£4,000.00</strong> by{" "}
          <Link href="/representatives/mps/cowdenbeath-and-kirkcaldy#donations-and-interests">
            Melanie Ward
          </Link>{" "}
          for &quot;Communications Support&quot;, <strong>£3,500.00</strong> by{" "}
          <Link href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests">
            Joani Reid
          </Link>{" "}
          to Causeway Creative, <strong>£1,500.00</strong> by{" "}
          <Link href="/representatives/mps/kilmarnock-and-loudoun#donations-and-interests">
            Lillian Jones
          </Link>{" "}
          to Warriors Studio, <strong>£1,500.00</strong> by{" "}
          <Link href="/representatives/mps/central-ayrshire#donations-and-interests">
            Alan Gemmell
          </Link>{" "}
          for website design, and <strong>£1,100.00</strong> by{" "}
          <Link href="/representatives/mps/rutherglen#donations-and-interests">
            Michael Shanks
          </Link>{" "}
          for social media graphic templates.
        </LI>
        <LI>
          <strong>£9,193.95 for European hotels on IPSA expenses:</strong> Twelve Scottish MPs
          billed taxpayers for hotel stays in Europe on top of their UK travel, led by Dundee
          Central SNP MP{" "}
          <Link href="/representatives/mps/dundee-central#donations-and-interests">Chris Law</Link>{" "}
          (<strong>£2,821.90</strong>), Paisley South Labour MP{" "}
          <Link href="/representatives/mps/paisley-and-renfrewshire-south#donations-and-interests">
            Johanna Baxter
          </Link>{" "}
          (<strong>£1,004.48</strong>), Argyll and Bute SNP MP{" "}
          <Link href="/representatives/mps/argyll-bute-and-south-lochaber#donations-and-interests">
            Brendan O&apos;Hara
          </Link>{" "}
          (<strong>£822.38</strong>) and Kilmarnock Labour MP{" "}
          <Link href="/representatives/mps/kilmarnock-and-loudoun#donations-and-interests">
            Lillian Jones
          </Link>{" "}
          (<strong>£723.18</strong>).
        </LI>
        <LI>
          <strong>£20,384.74 in a single electricity bill claim:</strong> Kilmarnock and Loudoun
          Labour MP{" "}
          <Link href="/representatives/mps/kilmarnock-and-loudoun#donations-and-interests">
            Lillian Jones
          </Link>{" "}
          recorded a single <strong>£20,384.74</strong> payment to Yu Energy Utilities under the
          Miscellaneous budget category, on top of her accommodation and office costs.
        </LI>
        <LI>
          <strong>£1,248 for an iPhone, DFS sofas, 32 TV licences and £9,160 in newspapers:</strong>{" "}
          Berwickshire Conservative MP{" "}
          <Link href="/representatives/mps/berwickshire-roxburgh-and-selkirk#donations-and-interests">
            John Lamont
          </Link>{" "}
          billed taxpayers <strong>£1,248.00</strong> for an &quot;iPhone and protection
          case&quot;. Motherwell Labour MP{" "}
          <Link href="/representatives/mps/motherwell-wishaw-and-carluke#donations-and-interests">
            Pamela Nash
          </Link>{" "}
          billed <strong>£1,208.00</strong> to DFS Trading and <strong>£1,334.00</strong> to IKEA on
          top of <strong>£5,000.00</strong> for office carpet and refurbishment. Across all 55 MPs,
          taxpayers also paid <strong>£9,159.58</strong> for newspaper and magazine subscriptions
          and <strong>£3,862.66</strong> for 32 TV licences.
        </LI>
        <LI>
          <strong>17 duplicate or overclaimed expense claims that had to be repaid:</strong> The
          IPSA ledger records 17 instances where Scottish MPs submitted duplicate claims or
          overspent their budget and had to repay the money, including a{" "}
          <strong>£1,200.00 duplicate advertising claim</strong> repaid by{" "}
          <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
            Graeme Downie
          </Link>
          , <strong>£1,476.00</strong> and <strong>£270.00</strong> repaid by{" "}
          <Link href="/representatives/mps/na-h-eileanan-an-iar#donations-and-interests">
            Torcuil Crichton
          </Link>{" "}
          (including a duplicate claim for Legionella testing), <strong>£1,657.35</strong> across
          two claims repaid by{" "}
          <Link href="/representatives/mps/cowdenbeath-and-kirkcaldy#donations-and-interests">
            Melanie Ward
          </Link>
          , and duplicate advertising claims repaid by{" "}
          <Link href="/representatives/mps/north-east-fife#donations-and-interests">
            Wendy Chamberlain
          </Link>{" "}
          (£126) and{" "}
          <Link href="/representatives/mps/edinburgh-east-and-musselburgh#donations-and-interests">
            Chris Murray
          </Link>{" "}
          (£71.50).
        </LI>
      </UL>

      <H2 id="top-10-table">
        8. The Top 10 highest claiming Scottish MPs (non-staff expenses & perks)
      </H2>
      <P>
        Because every MP receives roughly the same staffing budget to pay local constituency
        caseworkers (around £250,000 to £263,000), stripping out staff payroll gives the true picture
        of what each MP claims for their own accommodation, travel, hotels and office running costs.
        Here are the top 10 in Scotland (you can search and filter all 57 MPs on our{" "}
        <Link href="/mp-expenses-scotland">full interactive leaderboard</Link>):
      </P>

      <div className="my-7">
        <GuideTable
          kicker="IPSA 2025/26 & Register of Interests · Top 10"
          title="Top 10 Scottish MPs by non-staff expenses (rent, bills, flights, hotels & office)"
          columns={[
            "Rank & MP",
            "Constituency",
            "Non-Staff Claimed",
            "Total incl. Staff",
            "Key receipts & declared freebies",
          ]}
          align={["left", "left", "right", "right", "left"]}
          rows={TOP_10_NON_STAFF}
          caption="Click any MP's name to open their full itemised profile page and pre-filled constituent email."
        />
      </div>

      <Aside title="Note for journalists and researchers using this data">
        <p>
          Every figure in this article and on our{" "}
          <Link href="/mp-expenses-scotland">Scottish MP Expenses and Freebies hub</Link> comes
          directly from the official IPSA 2025/26 <code>totalSpend</code> and{" "}
          <code>individualBusinessCosts</code> CSV files (7,268 individual Scottish claim lines) and
          the UK Parliament Register of Members&apos; Financial Interests API (210 registered
          entries across all 57 Scottish MPs, checked 21 November 2026). You are welcome to quote or
          reproduce these tables with attribution and a link to{" "}
          <Link href="/mp-expenses-scotland">scotlandcounted.org.uk/mp-expenses-scotland</Link>.
        </p>
      </Aside>

      <H2 id="ask-your-mp">9. Put the receipts to your own MP</H2>
      <P>
        MPs rely on the fact that IPSA spreadsheets and Register of Interests filings are buried in
        separate, hard to search databases that busy voters rarely have time to cross reference.
      </P>
      <P>
        We have put every Scottish MP&apos;s exact 2025/26 expense claims, second home bills,
        private donations, foreign trips and plain English voting record onto their{" "}
        <Link href="/representatives">individual profile page</Link>, alongside the child poverty
        rate in their constituency and a one click button that opens a ready drafted email asking
        them to explain their claims.
      </P>

      <PostCTA
        title="Check your own MP's expense tab and ask them to explain it"
        body="Open the full 57-MP leaderboard or enter your postcode to see every pound your MP claimed in 2025/26 and send them a pre-filled email."
        href="/mp-expenses-scotland"
        cta="See all 57 MPs ranked"
      />
    </Prose>
  );
}
