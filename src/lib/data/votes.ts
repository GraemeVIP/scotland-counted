/**
 * How Scotland's MPs voted, from the official Commons Votes record.
 *
 * Snapshotted rather than fetched at request time so a page can never show a
 * different record on two different days, and so the figures can be checked
 * against the source by anyone. Regenerate from
 * https://commonsvotes-api.parliament.uk/data/division/<id>.json
 *
 * We describe what a vote was on and what each side meant. We do not say which
 * side was right, and we do not treat an absence as neglect — MPs miss votes
 * for many legitimate reasons, and the honest record simply says they were not
 * recorded.
 */

export type Side = "Aye" | "No" | "Absent";

export type Division = {
  id: number;
  /** The official title, exactly as published. */
  title: string;
  /** Six words a stranger understands. Used as the card headline. */
  headline: string;
  /** Where in the bill's life this vote came. */
  stage: string;
  /** What it was about, for someone who has never followed politics. */
  plain: string;
  /** What voting each way meant. Factual, not a verdict. */
  ayeMeans: string;
  noMeans: string;
  date: string;
  ayes: number;
  noes: number;
  /** Constituency slug -> how that MP was recorded. */
  votes: Record<string, { vote: Exclude<Side, "Absent">; name: string }>;
};

export const divisions: Division[] = [
  {
    id: 2253,
    title: "Universal Credit (Removal of Two Child Limit) Bill: Second Reading",
    headline: "Scrapping the two-child limit",
    stage: "The first Commons vote on the bill",
    plain: "The two-child limit was the rule that stopped families getting the usual support for a third or later child. This bill removed it.",
    ayeMeans: "Voting Aye meant backing the bill, and so backing the removal of the two-child limit.",
    noMeans: "Voting No meant opposing the bill at this stage.",
    date: "2026-02-03",
    ayes: 457,
    noes: 104,
    votes: {
      "aberdeen-north": { vote: "Aye", name: "Kirsty Blackman" },
      "aberdeenshire-north-and-moray-east": { vote: "Aye", name: "Seamus Logan" },
      "alloa-and-grangemouth": { vote: "Aye", name: "Brian Leishman" },
      "angus-and-perthshire-glens": { vote: "Aye", name: "Dave Doogan" },
      "arbroath-and-broughty-ferry": { vote: "Aye", name: "Stephen Gethins" },
      "argyll-bute-and-south-lochaber": { vote: "Aye", name: "Brendan O'Hara" },
      "ayr-carrick-and-cumnock": { vote: "Aye", name: "Elaine Stewart" },
      "bathgate-and-linlithgow": { vote: "Aye", name: "Kirsteen Sullivan" },
      "berwickshire-roxburgh-and-selkirk": { vote: "No", name: "John Lamont" },
      "central-ayrshire": { vote: "Aye", name: "Alan Gemmell" },
      "cowdenbeath-and-kirkcaldy": { vote: "Aye", name: "Melanie Ward" },
      "cumbernauld-and-kirkintilloch": { vote: "Aye", name: "Katrina Murray" },
      "dumfries-and-galloway": { vote: "No", name: "John Cooper" },
      "dumfriesshire-clydesdale-and-tweeddale": { vote: "No", name: "David Mundell" },
      "dundee-central": { vote: "Aye", name: "Chris Law" },
      "dunfermline-and-dollar": { vote: "Aye", name: "Graeme Downie" },
      "east-kilbride-and-strathaven": { vote: "Aye", name: "Joani Reid" },
      "edinburgh-east-and-musselburgh": { vote: "Aye", name: "Chris Murray" },
      "edinburgh-north-and-leith": { vote: "Aye", name: "Tracy Gilbert" },
      "edinburgh-south-west": { vote: "Aye", name: "Scott Arthur" },
      "edinburgh-west": { vote: "Aye", name: "Christine Jardine" },
      "falkirk": { vote: "Aye", name: "Euan Stainbank" },
      "glasgow-east": { vote: "Aye", name: "John Grady" },
      "glasgow-north": { vote: "Aye", name: "Martin Rhodes" },
      "glasgow-north-east": { vote: "Aye", name: "Maureen Burke" },
      "glasgow-south": { vote: "Aye", name: "Gordon McKee" },
      "glasgow-west": { vote: "Aye", name: "Patricia Ferguson" },
      "glenrothes-and-mid-fife": { vote: "Aye", name: "Richard Baker" },
      "gordon-and-buchan": { vote: "No", name: "Harriet Cross" },
      "hamilton-and-clyde-valley": { vote: "Aye", name: "Imogen Walker" },
      "inverclyde-and-renfrewshire-west": { vote: "Aye", name: "Martin McCluskey" },
      "inverness-skye-and-west-ross-shire": { vote: "Aye", name: "Angus MacDonald" },
      "kilmarnock-and-loudoun": { vote: "Aye", name: "Lillian Jones" },
      "lothian-east": { vote: "Aye", name: "Douglas Alexander" },
      "mid-dunbartonshire": { vote: "Aye", name: "Susan Murray" },
      "midlothian": { vote: "Aye", name: "Kirsty McNeill" },
      "moray-west-nairn-and-strathspey": { vote: "Aye", name: "Graham Leadbitter" },
      "motherwell-wishaw-and-carluke": { vote: "Aye", name: "Pamela Nash" },
      "na-h-eileanan-an-iar": { vote: "Aye", name: "Torcuil Crichton" },
      "north-ayrshire-and-arran": { vote: "Aye", name: "Irene Campbell" },
      "north-east-fife": { vote: "Aye", name: "Wendy Chamberlain" },
      "orkney-and-shetland": { vote: "Aye", name: "Alistair Carmichael" },
      "paisley-and-renfrewshire-south": { vote: "Aye", name: "Johanna Baxter" },
      "perth-and-kinross-shire": { vote: "Aye", name: "Pete Wishart" },
      "rutherglen": { vote: "Aye", name: "Michael Shanks" },
      "west-aberdeenshire-and-kincardine": { vote: "No", name: "Andrew Bowie" },
      "west-dunbartonshire": { vote: "Aye", name: "Douglas McAllister" },
    },
  },
  {
    id: 2265,
    title: "Universal Credit (Removal of Two Child Limit) Bill: Third Reading",
    headline: "Scrapping the two-child limit",
    stage: "The final Commons vote on the same bill",
    plain: "The last chance to stop or pass the bill. It passed, and the two-child limit ended in April 2026.",
    ayeMeans: "Voting Aye meant backing the finished bill that removed the two-child limit.",
    noMeans: "Voting No meant opposing it.",
    date: "2026-02-23",
    ayes: 362,
    noes: 84,
    votes: {
      "aberdeen-north": { vote: "Aye", name: "Kirsty Blackman" },
      "alloa-and-grangemouth": { vote: "Aye", name: "Brian Leishman" },
      "angus-and-perthshire-glens": { vote: "Aye", name: "Dave Doogan" },
      "arbroath-and-broughty-ferry": { vote: "Aye", name: "Stephen Gethins" },
      "argyll-bute-and-south-lochaber": { vote: "Aye", name: "Brendan O'Hara" },
      "berwickshire-roxburgh-and-selkirk": { vote: "No", name: "John Lamont" },
      "caithness-sutherland-and-easter-ross": { vote: "Aye", name: "Jamie Stone" },
      "central-ayrshire": { vote: "Aye", name: "Alan Gemmell" },
      "coatbridge-and-bellshill": { vote: "Aye", name: "Frank McNally" },
      "cumbernauld-and-kirkintilloch": { vote: "Aye", name: "Katrina Murray" },
      "dumfries-and-galloway": { vote: "No", name: "John Cooper" },
      "east-renfrewshire": { vote: "Aye", name: "Blair McDougall" },
      "edinburgh-east-and-musselburgh": { vote: "Aye", name: "Chris Murray" },
      "edinburgh-south": { vote: "Aye", name: "Ian Murray" },
      "edinburgh-south-west": { vote: "Aye", name: "Scott Arthur" },
      "edinburgh-west": { vote: "Aye", name: "Christine Jardine" },
      "falkirk": { vote: "Aye", name: "Euan Stainbank" },
      "glasgow-east": { vote: "Aye", name: "John Grady" },
      "glasgow-north": { vote: "Aye", name: "Martin Rhodes" },
      "glasgow-south": { vote: "Aye", name: "Gordon McKee" },
      "glasgow-south-west": { vote: "Aye", name: "Zubir Ahmed" },
      "glenrothes-and-mid-fife": { vote: "Aye", name: "Richard Baker" },
      "gordon-and-buchan": { vote: "No", name: "Harriet Cross" },
      "inverclyde-and-renfrewshire-west": { vote: "Aye", name: "Martin McCluskey" },
      "livingston": { vote: "Aye", name: "Gregor Poynton" },
      "lothian-east": { vote: "Aye", name: "Douglas Alexander" },
      "mid-dunbartonshire": { vote: "Aye", name: "Susan Murray" },
      "moray-west-nairn-and-strathspey": { vote: "Aye", name: "Graham Leadbitter" },
      "motherwell-wishaw-and-carluke": { vote: "Aye", name: "Pamela Nash" },
      "na-h-eileanan-an-iar": { vote: "Aye", name: "Torcuil Crichton" },
      "orkney-and-shetland": { vote: "Aye", name: "Alistair Carmichael" },
      "perth-and-kinross-shire": { vote: "Aye", name: "Pete Wishart" },
      "rutherglen": { vote: "Aye", name: "Michael Shanks" },
      "west-aberdeenshire-and-kincardine": { vote: "No", name: "Andrew Bowie" },
      "west-dunbartonshire": { vote: "Aye", name: "Douglas McAllister" },
    },
  },
];

/** How one constituency's MP was recorded in every division we hold. */
export function votesForConstituency(slug: string) {
  return divisions.map((d) => {
    const cast = d.votes[slug];
    return {
      division: d,
      side: (cast?.vote ?? "Absent") as Side,
      mpName: cast?.name,
    };
  });
}

/** Every MP recorded against a division, for the accountability round-up. */
export function scottishTally(d: Division) {
  const cast = Object.values(d.votes);
  return {
    aye: cast.filter((c) => c.vote === "Aye").length,
    no: cast.filter((c) => c.vote === "No").length,
    absent: 57 - cast.length,
  };
}
