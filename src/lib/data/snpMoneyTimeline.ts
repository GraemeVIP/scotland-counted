export type SnpTimelinePhase =
  | "foundations"
  | "fundraising"
  | "investigation"
  | "court"
  | "aftermath";

export type SnpTimelineStatus =
  | "court"
  | "official"
  | "reported"
  | "allegation"
  | "context"
  | "ongoing";

export type SnpTimelineSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  used: string;
  derivation?: string;
};

export type SnpTimelineEvent = {
  id: string;
  date: string;
  dateTime: string;
  group: string;
  groupLabel: string;
  phase: SnpTimelinePhase;
  status: SnpTimelineStatus;
  title: string;
  summary: string;
  explainer?: string;
  sourceIds: string[];
};

export const snpMoneyTimelineSources: SnpTimelineSource[] = [
  {
    id: "branchform-copfs-briefing",
    title: "Peter Murrell prosecution briefing",
    publisher: "Crown Office and Procurator Fiscal Service",
    url: "https://www.copfs.gov.uk/publications/peter-murrell-prosecution-briefing/html/",
    used:
      "The investigation and prosecution chronology, the different treatment of Murrell, Sturgeon and Beattie, the volume of evidence, the absence of any police fraud report and the warning not to treat omitted material as proved.",
  },
  {
    id: "murrell-agreed-narrative",
    title: "Peter Murrell agreed narrative",
    publisher: "Crown Office and Procurator Fiscal Service",
    url: "https://www.copfs.gov.uk/publications/peter-murrell-agreed-narrative/html/",
    used:
      "The facts admitted in court: £400,310.65 embezzled between August 2010 and October 2022, the methods used, the purchases and the motorhome, Volkswagen and Jaguar transactions.",
  },
  {
    id: "murrell-sentencing-judiciary",
    title: "HMA v Peter Murrell, sentencing statement",
    publisher: "Judiciary of Scotland",
    url: "https://www.judiciary.scot/home/sentences-judgments/sentences-and-opinions/2026/06/23/hma-v-peter-murrell",
    used:
      "The sentence of five years and three months, the seven-year starting point, credit for the guilty plea and Lord Young's assessment of the breach of trust.",
  },
  {
    id: "police-murrell-arrest-2023",
    title: "SNP funding and finances, man arrested",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2023/april/investigation-into-scottish-national-party-funding-and-finances-man-arrested/",
    used: "The 5 April 2023 arrest and searches of addresses in Glasgow and Edinburgh.",
  },
  {
    id: "police-beattie-arrest-2023",
    title: "SNP funding and finances, second man arrested",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2023/april/investigation-into-scottish-national-party-funding-and-finances-man-arrested-1/",
    used: "Colin Beattie's 18 April 2023 arrest and release without charge pending further investigation.",
  },
  {
    id: "police-murrell-charge-2024",
    title: "SNP finances, man charged",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2024/april/investigation-into-scottish-national-party-finances-man-charged/",
    used: "Murrell's 18 April 2024 rearrest and charge in connection with embezzlement of SNP funds.",
  },
  {
    id: "police-branchform-report-2024",
    title: "Operation Branchform report submitted to COPFS",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2024/may/operation-branchform-report-submitted-to-crown-office-and-procurator-fiscal-service/",
    used: "The 23 May 2024 submission of a prosecution report concerning Murrell.",
  },
  {
    id: "police-branchform-update-2025",
    title: "Operation Branchform update",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2025/march/operation-branchform-update/",
    used:
      "Confirmation on 20 March 2025 that Nicola Sturgeon and Colin Beattie had not been charged and were no longer under investigation.",
  },
  {
    id: "police-murrell-conviction-2026",
    title: "Statement following conviction of Peter Murrell",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2026/may/statement-following-conviction-of-peter-murrell/",
    used: "The 25 May 2026 guilty plea and remand for sentence.",
  },
  {
    id: "police-murrell-sentence-2026",
    title: "Sentencing of Peter Murrell",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2026/june/sentencing-of-peter-murrell",
    used: "The sentence and confirmation that court work to recover money gained through crime continued after it.",
  },
  {
    id: "copfs-murrell-sentence-2026",
    title: "Prosecution statement following sentencing of Peter Murrell",
    publisher: "Crown Office and Procurator Fiscal Service",
    url: "https://www.copfs.gov.uk/about-copfs/news/prosecution-statement-following-sentencing-of-peter-murrell/",
    used:
      "Confirmation that the prosecution was concluded while separate court action to recover criminal proceeds and decide what happened to seized property would follow.",
  },
  {
    id: "ec-snp-accounts-2020",
    title: "Scottish National Party annual report and financial statements 2020",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/23205",
    used:
      "The party's statement that independence-related appeals raised £666,953 from 2017 to 2020, £51,760 had been applied and the balance was internally earmarked rather than held in a separate account.",
    derivation:
      "Publication by the Commission does not mean it independently verified every statement in the accounts.",
  },
  {
    id: "ec-snp-accounts-2021",
    title: "Scottish National Party annual report and financial statements 2021",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/24333",
    used:
      "The year-end cash, net assets, deficit and disclosure that £107,620 had been advanced by executive management, with £60,000 outstanding.",
  },
  {
    id: "ec-murrell-loan-foi",
    title: "FOI 002-23, report of SNP loan",
    publisher: "Electoral Commission",
    url: "https://www.electoralcommission.org.uk/sites/default/files/2023-02/FOI%20002-23%20-%20Response%20%28redacted%29.pdf",
    used:
      "The timing and late reporting of a £107,620 loan made on 20 June 2021. The Commission provided guidance; this source does not establish a fine.",
  },
  {
    id: "ec-snp-accounts-2024",
    title: "Scottish National Party annual report and financial statements 2024",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/27288",
    used:
      "The accounting treatment and carrying value of the motorhome while it remained impounded, and the outstanding £60,000 former-executive loan.",
  },
  {
    id: "ec-snp-review-2026",
    title: "Electoral Commission letter to the Scottish Affairs Committee",
    publisher: "UK Parliament",
    url: "https://committees.parliament.uk/publications/53943/documents/300715/default/",
    used:
      "The £2,248,353 in public grants for party policy research and development received from 2010 to 2022, the absence of evidence of grant misuse in annual checks and the Commission's post-conviction review of past filings.",
  },
  {
    id: "stv-indyref2-fundraiser-2017",
    title: "SNP shuts down online fundraising drive for indyref2",
    publisher: "STV News archive",
    url: "https://archive.news.stv.tv/politics/1391116-snp-shuts-down-online-fundraising-drive-for-indyref2.html",
    used:
      "The March 2017 launch, the public total of almost £482,000 on 8 June and the page's removal by the following morning.",
  },
  {
    id: "press-journal-fundraiser-2019",
    title: "SNP launch major independence fundraising drive",
    publisher: "The Press and Journal",
    url: "https://www.pressandjournal.co.uk/fp/politics/scottish-politics/1733076/snp-launch-major-independence-fundraising-drive-after-nicola-sturgeon-announces-plans-for-indyref2/",
    used: "The April 2019 independence appeal and its stated campaigning purpose.",
  },
  {
    id: "stv-snp-finance-explainer-2023",
    title: "What is the latest in the SNP finance probe?",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/what-is-the-latest-in-the-snp-finance-probe-involving-nicola-sturgeon-peter-murrell-and-colin-beattie",
    used:
      "Contemporary reporting on the 2017 and 2019 appeals and the later questions about the balance shown in party accounts.",
  },
  {
    id: "stv-nec-video-2021",
    title: "Leaked video shows Sturgeon dismissing concerns over SNP finances",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/leaked-video-shows-nicola-sturgeon-dismissing-concerns-over-snp-finances",
    used:
      "The recording of Sturgeon's remarks at a 20 March 2021 SNP national executive meeting. The footage became public in 2023.",
  },
  {
    id: "press-journal-chapman-resigns-2021",
    title: "Douglas Chapman quits as SNP treasurer amid transparency concerns",
    publisher: "The Press and Journal",
    url: "https://www.pressandjournal.co.uk/fp/politics/scottish-politics/3187609/douglas-chapman-quits-as-snp-treasurer-amid-transparency-concerns/",
    used: "Chapman's 29 May 2021 resignation and his stated reason that he lacked enough information to perform his duties.",
  },
  {
    id: "stv-branchform-timeline",
    title: "Operation Branchform: key dates in the SNP finance investigation",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/operation-branchform-all-the-key-dates-of-police-scotlands-investigation-into-snp-finances",
    used: "Contemporary chronology of the 2021 launch and later public investigation milestones.",
  },
  {
    id: "sky-auditor-resigned-2023",
    title: "SNP auditors resigned six months before party disclosed it",
    publisher: "Sky News",
    url: "https://news.sky.com/story/scottish-first-minister-humza-yousaf-reveals-snp-auditors-resigned-six-months-ago-and-he-did-not-previously-know-12855153",
    used:
      "Johnston Carmichael's decision in 2022 not to conduct the next audit, and the public disclosure of that fact in April 2023.",
  },
  {
    id: "sky-new-auditor-2023",
    title: "SNP appoints AMS Accountants Group",
    publisher: "Sky News",
    url: "https://news.sky.com/story/snp-signs-contract-with-new-auditors-ams-accountants-group-as-deadlines-loom-12871919",
    used: "The appointment of a replacement auditor on 3 May 2023.",
  },
  {
    id: "sky-qualified-audit-2023",
    title: "SNP accounts to carry qualification over missing documentation",
    publisher: "Sky News",
    url: "https://news.sky.com/story/snp-to-meet-accounts-deadline-but-will-have-mark-against-them-for-missing-documentation-12912228",
    used:
      "The auditor's qualification because original records for some cash and cheque transactions were unavailable.",
  },
  {
    id: "stv-accounts-filed-2023",
    title: "SNP files annual accounts with Electoral Commission",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/snp-files-annual-accounts-with-electoral-commission",
    used: "The filing of the party's 2022 accounts in July 2023.",
  },
  {
    id: "independent-sturgeon-arrest-2023",
    title: "Nicola Sturgeon released without charge after arrest",
    publisher: "The Independent / PA Media",
    url: "https://www.the-independent.com/news/uk/nicola-sturgeon-snp-police-scotland-police-glasgow-b2355550.html",
    used: "Sturgeon's arrest by arrangement and release without charge on 11 June 2023.",
  },
  {
    id: "scotgov-branchform-case-updates",
    title: "Lord Advocate case updates, released correspondence",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/binaries/content/documents/govscot/publications/foi-eir-release/2026/04-e/foi-202600507614/documents/foi-202600507614---information-released---documents-1---4/foi-202600507614---information-released---documents-1---4/govscot%3Adocument/FOI%2B202600507614%2B-%2BInformation%2BReleased%2B-%2BDocuments%2B1%2B-%2B4.pdf",
    used:
      "Murrell's March 2025 petition appearance, the amount alleged at that stage and the £459,046.49 amount in the January 2026 indictment.",
  },
  {
    id: "stv-sturgeon-separation-2025",
    title: "Nicola Sturgeon announces separation from Peter Murrell",
    publisher: "STV News",
    url: "https://news.stv.tv/scotland/nicola-sturgeon-to-divorce-husband-peter-murrell-amid-police-investigation",
    used: "The 13 January 2025 announcement. It is included only as personal context, not as evidence about the case.",
  },
  {
    id: "stv-sturgeon-no-reelection-2025",
    title: "Sturgeon will not seek re-election",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/former-first-minister-nicola-sturgeon-will-not-seek-re-election-next-year",
    used: "The 12 March 2025 announcement. No causal connection to the investigation is asserted.",
  },
  {
    id: "scottish-parliament-review-motion-2026",
    title: "Motion S7M-00294, Peter Murrell prosecution",
    publisher: "Scottish Parliament",
    url: "https://www.parliament.scot/chamber-and-committees/votes-and-motions/S7M-00294",
    used:
      "The original Branchform-specific proposal, its amendment and the final 71–50 vote for an independently led review covering all political-party finances.",
  },
  {
    id: "itv-snp-recovery-2026",
    title: "SNP move to claim back stolen money",
    publisher: "ITV News",
    url: "https://www.itv.com/news/border/2026-06-04/exclusive-snp-move-to-claim-back-stolen-money",
    used: "The party executive's reported authorisation of civil recovery action after Murrell's plea.",
  },
  {
    id: "commons-committee-branchform-2026",
    title: "Scottish Affairs Committee writes to Holyrood committees",
    publisher: "UK Parliament",
    url: "https://committees.parliament.uk/committee/136/scottish-affairs-committee/news/214652/embezzlement-of-funds-from-the-snp-scottish-affairs-committee-writes-to-scottish-parliament-committees/",
    used:
      "The committee chair's approach about possible joint work; the announcement did not itself open a formal inquiry.",
  },
  {
    id: "police-foi-court-orders-2026",
    title: "FOI 26-1508, Branchform court orders to the SNP",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2026/july/26-1508-branchform-snp-court-orders-to-snp-re-financial-documents/",
    used:
      "The narrow confirmation that police sought no court orders compelling the SNP itself to supply financial or other information.",
  },
  {
    id: "police-foi-advice-request-2026",
    title: "FOI 26-1903, Branchform advice and guidance submission",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2026/july/26-1903-branchform-snp-timeline-advice-guidance-submission-reviews-copfs-report-communications-briefings/",
    used:
      "Confirmation of the August 2024 advice request and where the prosecution reviews and 542-page report were held.",
  },
  {
    id: "stv-yes-scotland-complaint-2026",
    title: "Police make inquiries over Yes Scotland complaint",
    publisher: "STV News / PA Media",
    url: "https://news.stv.tv/scotland/police-make-inquiries-over-yes-scotland-campaign-missing-money-complaint",
    used:
      "Police confirmation in July 2026 that a complaint about Yes Scotland finances had been received and inquiries were ongoing, alongside Yes Scotland's denial.",
  },
  {
    id: "companies-house-yes-scotland",
    title: "Yes Scotland Limited filing history",
    publisher: "Companies House",
    url: "https://find-and-update.company-information.service.gov.uk/company/SC422720/filing-history",
    used:
      "The company's filed accounts and dormant-company records. Companies House warns that it does not check the accuracy of information filed.",
  },
  {
    id: "ec-scottish-referendum-2014",
    title: "Report on the Scottish independence referendum",
    publisher: "Electoral Commission",
    url: "https://www.electoralcommission.org.uk/research-reports-and-data/our-reports-and-data-past-elections-and-referendums/report-scottish-independence-referendum",
    used: "The 18 September 2014 referendum result and turnout.",
  },
  {
    id: "gov-eu-referendum-response-2016",
    title: "First Minister's response to the EU referendum result",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/first-minister-eu-referendum-result/",
    used:
      "Sturgeon's 24 June 2016 statement that a second independence referendum had to be considered after Scotland voted Remain while the UK voted Leave.",
  },
  {
    id: "gov-indyref2-speech-2017",
    title: "First Minister's Bute House speech",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/first-ministers-speech-bute-house-march-2017/",
    used: "The 13 March 2017 announcement seeking authority for a second referendum.",
  },
  {
    id: "parliament-indyref2-vote-2017",
    title: "Meeting of the Parliament, 28 March 2017",
    publisher: "Scottish Parliament",
    url: "https://www.parliament.scot/api/sitecore/CustomMedia/OfficialReport?meetingId=10869",
    used: "The 69–59 vote authorising the First Minister to seek a Section 30 order.",
  },
  {
    id: "gov-indyref2-reset-2017",
    title: "EU negotiations and Scotland's future",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/eu-negotiations-and-scotland-future-first-ministers-speech/",
    used: "Sturgeon's 27 June 2017 decision to delay the immediate referendum plan until the Brexit position was clearer.",
  },
  {
    id: "ec-snp-accounts-2017",
    title: "Scottish National Party annual report and financial statements 2017",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/20553",
    used: "The party's 2017 income, expenditure, cash and net-liability figures.",
  },
  {
    id: "ec-snp-accounts-2018",
    title: "Scottish National Party annual report and financial statements 2018",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/21513",
    used: "The party's 2018 cash and net-asset figures.",
  },
  {
    id: "ec-snp-accounts-2019",
    title: "Scottish National Party annual report and financial statements 2019",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/22612",
    used: "The fall in year-end cash to £96,854 and the 2019 net-asset figure.",
  },
  {
    id: "national-beattie-earmark-2020",
    title: "SNP responds to questions over independence appeal money",
    publisher: "The National",
    url: "https://www.thenational.scot/news/18828133.snp-try-quash-rumours-independence-fighting-fund-already-spent/",
    used:
      "Colin Beattie's October 2020 statement that £593,501 was earmarked and could be deployed instantaneously, while being woven through the party's overall income.",
  },
  {
    id: "stv-chapman-resigns-2021",
    title: "SNP finance boss quits over lack of information",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/snp-finance-boss-quits-over-lack-of-information",
    used: "Douglas Chapman's statement on resigning as national treasurer in May 2021.",
  },
  {
    id: "ec-murrell-loan-record",
    title: "Loan record AL0559123",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/English/Loans/AL0559123",
    used:
      "The £107,620 loan, the two repayments in 2021, the £60,000 remaining balance and the later publication of the lender's identity.",
  },
  {
    id: "supreme-court-referendum-2022",
    title: "Reference on a proposed Scottish independence referendum bill",
    publisher: "UK Supreme Court",
    url: "https://www.supremecourt.uk/cases/uksc-2022-0098",
    used:
      "The unanimous 23 November 2022 ruling that Holyrood could not legislate for the proposed referendum without Westminster authorisation.",
  },
  {
    id: "gov-sturgeon-resigns-2023",
    title: "First Minister to resign",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/news/first-minister-to-resign/",
    used:
      "Sturgeon's 15 February 2023 resignation announcement. No official source establishes that the police investigation caused it.",
  },
  {
    id: "stv-membership-row-2023",
    title: "SNP media chief resigns over membership figures",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/snp-media-chief-murray-foote-resigns-over-serious-issues-with-membership-numbers-issued-to-press",
    used:
      "The March 2023 disclosure of 72,186 eligible leadership voters and Murray Foote's resignation. This was a governance controversy, not a criminal finding.",
  },
  {
    id: "stv-murrell-resigns-2023",
    title: "Peter Murrell resigns as SNP chief executive",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/peter-murrell-resigns-as-snp-chief-executive-amid-row-over-membership-numbers",
    used:
      "Murrell's 18 March 2023 resignation over the party's handling of membership-number statements, not as an admission about finances.",
  },
  {
    id: "police-murrell-release-2023",
    title: "SNP funding and finances, arrest update",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2023/april/investigation-into-scottish-national-party-funding-and-finances-update/",
    used: "Murrell's release without charge pending further investigation on 5 April 2023.",
  },
  {
    id: "police-sturgeon-arrest-2023",
    title: "SNP funding and finances, 11 June update",
    publisher: "Police Scotland",
    url: "https://www.scotland.police.uk/what-s-happening/news/2023/june/investigation-into-scottish-national-party-funding-and-finances-update/",
    used:
      "Sturgeon's arrest as a suspect at 10:09 and release without charge pending further investigation at 17:24 on 11 June 2023.",
  },
  {
    id: "ec-snp-accounts-2022",
    title: "Scottish National Party annual report and financial statements 2022",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/25329",
    used:
      "The 2022 financial figures and qualified audit opinion concerning missing original documentation for a defined group of cash and cheque receipts.",
  },
  {
    id: "ec-snp-accounts-2023",
    title: "Scottish National Party annual report and financial statements 2023",
    publisher: "Electoral Commission",
    url: "https://search.electoralcommission.org.uk/Api/Accounts/Documents/26188",
    used:
      "The 2023 income, surplus, net assets and repeat qualification concerning some pre-July-2023 cash and cheque records.",
  },
  {
    id: "stv-governance-review-2023",
    title: "SNP NEC orders governance and transparency review",
    publisher: "STV News",
    url: "https://news.stv.tv/politics/snp-ruling-body-nec-orders-review-to-increase-transparency",
    used: "The internal review established by the SNP's national executive on 15 April 2023.",
  },
  {
    id: "ap-sturgeon-response-2026",
    title: "Sturgeon rejects blame for former husband's embezzlement",
    publisher: "Associated Press",
    url: "https://apnews.com/article/c5612badc986e82738c44beb59244490",
    used:
      "Sturgeon's attributed May 2026 statement that she did not know about Murrell's crimes and was not responsible for them.",
  },
  {
    id: "parliament-snp-recovery-2026",
    title: "Meeting of the Parliament, 11 June 2026",
    publisher: "Scottish Parliament",
    url: "https://www.parliament.scot/chamber-and-committees/official-report/search-what-was-said-in-parliament/meeting-of-parliament-11-06-2026?iob=223793&meeting=20169",
    used:
      "John Swinney's statement that he had acted as the SNP's principal trustee to seek return of the money.",
  },
  {
    id: "independent-yes-scotland-accounts-2026",
    title: "Yes Scotland hands accounts to police after complaint",
    publisher: "The Independent / PA Media",
    url: "https://www.the-independent.com/news/uk/home-news/snp-police-scotland-glasgow-b3014435.html",
    used:
      "Yes Scotland's provision of accounts to police and its response that the money was accounted for and no wrongdoing occurred.",
  },
];

export const snpMoneyTimelineSourcesById = Object.fromEntries(
  snpMoneyTimelineSources.map((source) => [source.id, source])
);

export const snpMoneyTimelineEvents: SnpTimelineEvent[] = [
  {
    id: "murrell-becomes-chief-executive",
    date: "2001",
    dateTime: "2001",
    group: "2010-2016",
    groupLabel: "2001–2016 · control and what court later proved",
    phase: "foundations",
    status: "court",
    title: "Murrell is the SNP's chief executive",
    summary:
      "Peter Murrell became the SNP's chief executive in 2001. The agreed court narrative says he was effectively the party's administrative head and had substantial control over its principal bank account, staff cards, invoices and accounting information.",
    explainer:
      "This position of trust is why the offence was embezzlement: he was authorised to handle party money, but not to use it for himself.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "embezzlement-begins",
    date: "August 2010",
    dateTime: "2010-08",
    group: "2010-2016",
    groupLabel: "2001–2016 · control and what court later proved",
    phase: "foundations",
    status: "court",
    title: "The embezzlement begins",
    summary:
      "Murrell later admitted that his unauthorised use of SNP money began in August 2010. He used direct bank transfers, his own party card and cards assigned to two unsuspecting staff members, then disguised spending with misleading descriptions and account codes.",
    explainer:
      "The public did not know this in 2010. It became an established fact only when Murrell pleaded guilty in 2026.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "first-independence-referendum",
    date: "18 September 2014",
    dateTime: "2014-09-18",
    group: "2010-2016",
    groupLabel: "2001–2016 · control and what court later proved",
    phase: "fundraising",
    status: "official",
    title: "Scotland votes No in the independence referendum",
    summary:
      "The final result was 55.25% No and 44.65% Yes. That vote is the political starting point for the later appeals asking supporters to fund a campaign for another referendum.",
    sourceIds: ["ec-scottish-referendum-2014"],
  },
  {
    id: "volkswagen-golf",
    date: "29 March 2016",
    dateTime: "2016-03-29",
    group: "2010-2016",
    groupLabel: "2001–2016 · control and what court later proved",
    phase: "foundations",
    status: "court",
    title: "£16,489 of party money goes towards a Volkswagen Golf",
    summary:
      "The SNP transferred £16,489 towards a Volkswagen Golf that became Murrell's personal car. The agreed narrative treats that payment as part of the embezzled total.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "brexit-result",
    date: "23–24 June 2016",
    dateTime: "2016-06-24",
    group: "2010-2016",
    groupLabel: "2001–2016 · control and what court later proved",
    phase: "fundraising",
    status: "official",
    title: "Scotland votes Remain while the UK votes to leave the EU",
    summary:
      "The next morning Sturgeon said a second independence referendum had to be considered. That political change led directly to the referendum proposal and appeal launched the following March.",
    sourceIds: ["gov-eu-referendum-response-2016"],
  },
  {
    id: "first-indyref2-appeal",
    date: "13 March 2017",
    dateTime: "2017-03-13",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "reported",
    title: "The SNP launches an independence appeal",
    summary:
      "After Nicola Sturgeon announced plans to seek authority for another independence referendum, the SNP launched an online appeal with a £1 million target. Donors were told the money would support the referendum campaign.",
    sourceIds: ["gov-indyref2-speech-2017", "stv-indyref2-fundraiser-2017"],
  },
  {
    id: "holyrood-authorises-request",
    date: "28 March 2017",
    dateTime: "2017-03-28",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "official",
    title: "Holyrood votes to seek referendum powers",
    summary:
      "MSPs voted 69–59 to authorise Sturgeon to request a Section 30 order from the UK Government. The order would have transferred legal power to hold another referendum.",
    sourceIds: ["parliament-indyref2-vote-2017"],
  },
  {
    id: "appeal-page-removed",
    date: "8–9 June 2017",
    dateTime: "2017-06-08",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "reported",
    title: "The public page shows almost £482,000, then disappears",
    summary:
      "STV recorded a total of almost £482,000 on 8 June. By the next morning the fundraising page had been removed. The SNP said it had always planned a short campaign and that the money remained available for a future referendum.",
    explainer:
      "That public total was not the later court-proved theft figure. The two numbers describe different things and cannot simply be subtracted from each other.",
    sourceIds: ["stv-indyref2-fundraiser-2017"],
  },
  {
    id: "ringfenced-statement",
    date: "13–14 June 2017",
    dateTime: "2017-06-13",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "reported",
    title: "The SNP says the appeal money is ring-fenced",
    summary:
      "Responding to questions after the page closed, the party said the money was ring-fenced for the stated referendum purpose and had not been used for the general election.",
    explainer:
      "The original appeal did not promise a legally separate bank account. But 'ring-fenced' commonly sounds stronger than the internal earmark and future-cashflow treatment described later.",
    sourceIds: ["stv-indyref2-fundraiser-2017", "stv-snp-finance-explainer-2023"],
  },
  {
    id: "referendum-plan-reset",
    date: "27 June 2017",
    dateTime: "2017-06-27",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "official",
    title: "Sturgeon delays the immediate referendum timetable",
    summary:
      "After the SNP lost 21 Westminster seats, Sturgeon said the plan would pause until the terms of Brexit were clearer. This helps explain why the appeal money was not immediately deployed.",
    sourceIds: ["gov-indyref2-reset-2017"],
  },
  {
    id: "two-watches",
    date: "June–July 2017",
    dateTime: "2017-06-08",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "Two watches are bought and coded as event merchandise",
    summary:
      "Murrell used party money to buy watches costing £4,555.25 and £4,795. The payments were coded as event merchandise. Police later recovered the watches from SNP headquarters.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "watch-roll",
    date: "November 2017",
    dateTime: "2017-11",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "A £332 watch roll is hidden in other expense codes",
    summary:
      "A Smythson watch roll was paid for with party money and described in the records as hotel and staff expenditure. It formed part of the offending admitted in court.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "accounts-2017-published",
    date: "20 August 2018",
    dateTime: "2018-08-20",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "official",
    title: "The first post-appeal annual accounts show £7,906 cash",
    summary:
      "The SNP's 2017 accounts reported £5.80 million income, £5.10 million expenditure, £7,906 cash and £528,276 net liabilities. They did not itemise the appeal as a separate fund.",
    explainer:
      "Low cash raised a reasonable question, but it did not by itself prove misuse: annual accounts include assets, liabilities and internal commitments, not only bank balances.",
    sourceIds: ["ec-snp-accounts-2017"],
  },
  {
    id: "accounts-2018-published",
    date: "1 August 2019",
    dateTime: "2019-08-01",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "official",
    title: "The 2018 accounts report £411,042 cash",
    summary:
      "The next annual filing showed £411,042 cash and £591,077 net assets. The referendum appeal still did not appear as its own bank account or line item.",
    sourceIds: ["ec-snp-accounts-2018"],
  },
  {
    id: "second-independence-appeal",
    date: "24–25 April 2019",
    dateTime: "2019-04-25",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "reported",
    title: "A second independence fundraiser begins",
    summary:
      "The SNP launched another appeal after Sturgeon set out a route towards a possible referendum. The party said donations would help send an independence guide to 2.46 million Scottish households.",
    sourceIds: ["press-journal-fundraiser-2019"],
  },
  {
    id: "false-expense-claims",
    date: "January 2019–September 2020",
    dateTime: "2019-01",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "False expense claims move £18,408.91 to Murrell",
    summary:
      "Murrell submitted false expense claims totalling £18,408.91. The court narrative also describes false supporting invoices, including one made to look like a £12,042 Apple invoice and another for £2,478 from Manufactum.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "jaguar-purchase",
    date: "1 November 2019",
    dateTime: "2019-11-01",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "£57,500 of SNP money helps buy a Jaguar i-Pace",
    summary:
      "Two SNP transfers totalling £57,500 were used towards a Jaguar i-Pace costing £81,277. A false invoice made the payments look connected to event staging. The car was for Murrell's personal use.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "parking-ticket",
    date: "30 October 2019",
    dateTime: "2019-10-30",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "A £30 parking ticket is paid with the party card",
    summary:
      "Murrell used an SNP card for his own parking penalty. The amount was small, but the court included it as another unauthorised use of party money.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "amazon-home-deliveries",
    date: "From April 2020",
    dateTime: "2020-04",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "Hundreds of online purchases are delivered to Murrell's home",
    summary:
      "The court record lists 383 Amazon purchases costing £42,660.74. From April 2020, almost all were delivered to Murrell's home. Another 238 purchases from other retailers between 2015 and 2022 totalled £139,971.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "egg-poacher",
    date: "7 July 2020",
    dateTime: "2020-07-07",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "An egg poacher is recorded as computer hardware",
    summary:
      "A £23.98 egg poacher was bought with party money and coded as computer hardware and an Ethernet connection. It is a small purchase, but a clear example of how descriptions were changed to conceal personal spending.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "accounts-2019-published",
    date: "12 October 2020",
    dateTime: "2020-10-12",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "official",
    title: "The 2019 accounts show cash falling to £96,854",
    summary:
      "Cash fell from £411,042 to £96,854 and net assets were £271,916. Because the appeal money was not shown separately, the filing intensified public questions about how the commitment to donors was being accounted for.",
    explainer:
      "A cash balance below the publicly discussed appeal total was not proof that £600,000 had been stolen or lost.",
    sourceIds: ["ec-snp-accounts-2019"],
  },
  {
    id: "beattie-instantly-available",
    date: "28 October 2020",
    dateTime: "2020-10-28",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "reported",
    title: "Treasurer Beattie says £593,501 can be deployed instantly",
    summary:
      "Beattie said the referendum appeal balance was woven through the party's overall income rather than shown separately, but could be deployed instantaneously for a referendum campaign.",
    explainer:
      "That description and the later future-cashflow explanation are materially different. This timeline presents both and leaves readers to judge whether the wording met donor expectations.",
    sourceIds: ["national-beattie-earmark-2020", "ec-snp-accounts-2020"],
  },
  {
    id: "motorhome-ordered",
    date: "14 October 2020",
    dateTime: "2020-10-14",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "foundations",
    status: "court",
    title: "Murrell orders a £124,550 motorhome",
    summary:
      "A £12,500 deposit was placed on an unbranded motorhome. On 7 December, four transfers from the SNP's account paid the remaining £112,050. A false invoice described a different type of vehicle.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "accounts-explain-earmark",
    date: "31 December 2020",
    dateTime: "2020-12-31",
    group: "2017-2020",
    groupLabel: "2017–2020 · appeals, spending and questions",
    phase: "fundraising",
    status: "official",
    title: "The party accounts say £666,953 was raised for independence work",
    summary:
      "The SNP's 2020 accounts said appeals from 2017 to 2020 raised £666,953 and £51,760 had been applied. They said the remainder was internally earmarked, not kept in a separate bank account, and was managed through normal cashflow.",
    explainer:
      "This is what the party stated in a regulated filing. The Electoral Commission's publication of an account is not a guarantee that every statement inside it was independently proved.",
    sourceIds: ["ec-snp-accounts-2020"],
  },
  {
    id: "motorhome-delivered",
    date: "22 January 2021",
    dateTime: "2021-01-22",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "foundations",
    status: "court",
    title: "The motorhome is taken to Murrell's mother's home",
    summary:
      "The motorhome was delivered at Halbeath and driven to Murrell's mother's driveway in Dunfermline. Other party staff did not use or see it. When police seized it in 2023, it had four miles on the odometer and contained no campaign material.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "finance-committee-resignations",
    date: "19–20 March 2021",
    dateTime: "2021-03-19",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "reported",
    title: "Three finance and audit committee members resign",
    summary:
      "Frank Ross, Cynthia Guthrie and Allison Graham said delay and inadequate financial information prevented them carrying out their duties. Their resignations were put before the SNP national executive the next day.",
    explainer:
      "Their stated concern was that they could not scrutinise the finances properly. A resignation is not, by itself, proof that a crime occurred.",
    sourceIds: ["stv-branchform-timeline"],
  },
  {
    id: "sturgeon-nec-finance-remarks",
    date: "20 March 2021",
    dateTime: "2021-03-20",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "reported",
    title: "Sturgeon tells the party executive its finances are strong",
    summary:
      "At the same national executive meeting, Sturgeon said the party had never been in a stronger financial position and cautioned members against suggesting there were financial problems. A recording became public in April 2023.",
    explainer:
      "The words are documented. They are not evidence that Sturgeon knew about Murrell's embezzlement, and prosecutors later decided she should not be charged or investigated further.",
    sourceIds: ["stv-nec-video-2021", "branchform-copfs-briefing"],
  },
  {
    id: "first-police-complaint",
    date: "25 March 2021",
    dateTime: "2021-03-25",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "investigation",
    status: "allegation",
    title: "Police receive the first complaint about independence donations",
    summary:
      "A complaint alleged possible mishandling of the money raised for another referendum. More complaints followed. Police first assessed the allegations before opening a formal investigation in July.",
    explainer:
      "A complaint is a request to investigate, not a finding. COPFS later said that this wider inquiry uncovered Murrell's separate course of embezzlement.",
    sourceIds: ["branchform-copfs-briefing", "stv-branchform-timeline"],
  },
  {
    id: "chapman-resigns",
    date: "29 May 2021",
    dateTime: "2021-05-29",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "reported",
    title: "National treasurer Douglas Chapman resigns",
    summary:
      "Chapman said he had not received the support or financial information required to carry out his fiduciary duties. Colin Beattie returned as national treasurer the following month.",
    sourceIds: ["stv-chapman-resigns-2021", "press-journal-chapman-resigns-2021"],
  },
  {
    id: "ipad-sale",
    date: "June 2021",
    dateTime: "2021-06",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "foundations",
    status: "court",
    title: "Murrell sells a party iPad and keeps £701",
    summary:
      "Murrell sold an SNP iPad and arranged for the proceeds to be paid into his personal bank account. The transaction formed part of the embezzlement admitted in court.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "murrell-loan",
    date: "20 June 2021",
    dateTime: "2021-06-20",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "official",
    title: "Murrell lends the SNP £107,620",
    summary:
      "Murrell made an interest-free loan to help the party's working capital after the Holyrood election. The party repaid £26,905 in August and £20,715 in October, leaving £60,000 outstanding.",
    explainer:
      "The loan was not the theft. It was real money advanced to the party, but the lender-specific regulatory report was submitted late.",
    sourceIds: ["ec-murrell-loan-record", "ec-murrell-loan-foi", "ec-snp-accounts-2021"],
  },
  {
    id: "formal-investigation-opens",
    date: "13 July 2021",
    dateTime: "2021-07-13",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "investigation",
    status: "official",
    title: "Police open the formal investigation later called Operation Branchform",
    summary:
      "After receiving seven complaints and consulting prosecutors, Police Scotland opened a formal investigation into the SNP's funding and finances.",
    sourceIds: ["stv-branchform-timeline", "branchform-copfs-briefing"],
  },
  {
    id: "jaguar-sold",
    date: "27 August 2021",
    dateTime: "2021-08-27",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "foundations",
    status: "court",
    title: "Murrell sells the Jaguar and keeps £47,378.76",
    summary:
      "The proceeds from selling the Jaguar i-Pace were paid into Murrell's personal account. The vehicle had been partly bought with SNP money and was not a party asset.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "accounts-2021",
    date: "31 December 2021",
    dateTime: "2021-12-31",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "official",
    title: "The next accounts show a £487,487 internal independence earmark",
    summary:
      "The SNP later reported £740,822 of cumulative appeal income and £253,335 of qualifying spending, leaving £487,487 internally earmarked. Year-end cash was £144,975 and the annual deficit was £751,572.",
    explainer:
      "An earmark is an internal promise about future use. It is not the same as cash sitting untouched in its own bank account.",
    sourceIds: ["ec-snp-accounts-2021"],
  },
  {
    id: "loan-reported-late",
    date: "August–September 2022",
    dateTime: "2022-08",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "official",
    title: "Murrell's loan is reported to the regulator late",
    summary:
      "The Electoral Commission was told the lender's identity in August 2022 and published the record on 2 September. The original loan and repayments should have been reported in the relevant 2021 quarters.",
    explainer:
      "Late reporting is a regulatory failure. The Commission's correspondence records guidance; it does not establish that a fine was imposed.",
    sourceIds: ["ec-murrell-loan-record", "ec-murrell-loan-foi"],
  },
  {
    id: "auditor-gives-notice",
    date: "September–October 2022",
    dateTime: "2022-09",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "reported",
    title: "Johnston Carmichael tells the SNP it will stop auditing the party",
    summary:
      "The firm gave notice months before the 2023 police searches. The SNP later said the decision followed a review of the firm's client portfolio and resources. The departure did not become public until April 2023.",
    explainer:
      "No cited source says the auditor found fraud or left because of a police raid. The timing rules out saying the April 2023 raid caused the departure.",
    sourceIds: ["sky-auditor-resigned-2023"],
  },
  {
    id: "embezzlement-ends",
    date: "October 2022",
    dateTime: "2022-10",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "foundations",
    status: "court",
    title: "The admitted course of embezzlement ends",
    summary:
      "The public court narrative gives October 2022 as the end of Murrell's offending. By then it had run for more than 12 years.",
    sourceIds: ["murrell-agreed-narrative"],
  },
  {
    id: "supreme-court-blocks-route",
    date: "23 November 2022",
    dateTime: "2022-11-23",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "official",
    title: "The Supreme Court blocks Holyrood's proposed referendum route",
    summary:
      "The court unanimously ruled that the Scottish Parliament could not legislate for the proposed referendum without Westminster authorisation. The intended October 2023 vote could not proceed by that route.",
    explainer:
      "This explains why the purpose named in the appeals remained politically unresolved. It does not decide whether the SNP's accounting treatment matched what donors expected.",
    sourceIds: ["supreme-court-referendum-2022"],
  },
  {
    id: "loan-becomes-news",
    date: "13–14 December 2022",
    dateTime: "2022-12-14",
    group: "2021-2022",
    groupLabel: "2021–2022 · complaints become an investigation",
    phase: "fundraising",
    status: "reported",
    title: "The Murrell loan becomes a major public story",
    summary:
      "The SNP said Murrell had personally contributed money to help cashflow after the 2021 election. The named Electoral Commission loan record had already been published in September, but broad public attention arrived in December.",
    sourceIds: ["ec-murrell-loan-record", "stv-snp-finance-explainer-2023"],
  },
  {
    id: "sturgeon-resignation",
    date: "15 February 2023",
    dateTime: "2023-02-15",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "context",
    title: "Sturgeon announces that she will step down",
    summary:
      "Sturgeon said she would resign as First Minister and SNP leader once a successor was chosen. No official evidence establishes that Operation Branchform caused her decision.",
    sourceIds: ["gov-sturgeon-resigns-2023"],
  },
  {
    id: "membership-figures-disclosed",
    date: "16–17 March 2023",
    dateTime: "2023-03-16",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "context",
    title: "A separate membership-number row erupts",
    summary:
      "The SNP said 72,186 members could vote in its leadership contest, down from 103,884 reported at the end of 2021. Communications chief Murray Foote resigned after the party's earlier public response was shown to be inaccurate.",
    explainer:
      "This was a party-governance controversy, not a police or court finding about money.",
    sourceIds: ["stv-membership-row-2023"],
  },
  {
    id: "murrell-resigns-chief-executive",
    date: "18 March 2023",
    dateTime: "2023-03-18",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "context",
    title: "Murrell resigns as SNP chief executive",
    summary:
      "Murrell accepted responsibility for the party's response to the membership figures and resigned after more than two decades as chief executive. His statement was not an admission about the finance investigation.",
    sourceIds: ["stv-murrell-resigns-2023"],
  },
  {
    id: "warrants-requested",
    date: "20 March–3 April 2023",
    dateTime: "2023-03-20",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "Prosecutors authorise applications for search and arrest warrants",
    summary:
      "Police sent draft warrant applications to COPFS on 20 March. Crown Counsel instructed prosecutors to apply, and a sheriff granted the warrants on 3 April. Additional orders later obtained evidence from banks, retailers, HMRC and accountants.",
    explainer:
      "A sheriff-approved warrant gives police legal authority to search or arrest. It is not a verdict.",
    sourceIds: ["branchform-copfs-briefing"],
  },
  {
    id: "murrell-first-arrest-searches",
    date: "5 April 2023",
    dateTime: "2023-04-05",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "Murrell is arrested; home, headquarters and the motorhome are searched",
    summary:
      "Police arrested Murrell at 07:45 and searched the home he shared with Sturgeon, SNP headquarters and the motorhome at his mother's driveway. He was released at 18:57 without charge pending further investigation.",
    explainer:
      "The seizure did not itself prove how the motorhome had been bought. Its purchase with party money was established later through Murrell's guilty plea and the agreed court narrative.",
    sourceIds: [
      "police-murrell-arrest-2023",
      "police-murrell-release-2023",
      "murrell-agreed-narrative",
    ],
  },
  {
    id: "auditor-exit-public",
    date: "7–11 April 2023",
    dateTime: "2023-04-07",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "reported",
    title: "The SNP reveals that its auditor left months earlier",
    summary:
      "It became public that Johnston Carmichael would not audit the next accounts. New First Minister Humza Yousaf said he had learned this only after becoming leader. The firm had notified the party in 2022, before the searches.",
    sourceIds: ["sky-auditor-resigned-2023"],
  },
  {
    id: "governance-review-launched",
    date: "15 April 2023",
    dateTime: "2023-04-15",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "The SNP starts an internal governance review",
    summary:
      "The party's national executive created a Governance and Transparency Review Group to examine governance and financial oversight. It was an internal party process, not an independent police, court or regulator inquiry.",
    sourceIds: ["stv-governance-review-2023"],
  },
  {
    id: "beattie-arrest",
    date: "18–19 April 2023",
    dateTime: "2023-04-18",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "Treasurer Colin Beattie is arrested, released, then resigns the role",
    summary:
      "Police arrested Beattie as a suspect and released him later that day without charge pending further investigation. He resigned as SNP national treasurer the following day.",
    explainer:
      "Beattie was never charged. Police formally ended their investigation of him in March 2025.",
    sourceIds: ["police-beattie-arrest-2023", "police-branchform-update-2025"],
  },
  {
    id: "replacement-auditor",
    date: "3 May 2023",
    dateTime: "2023-05-03",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "AMS Accountants Group becomes the replacement auditor",
    summary:
      "The SNP appointed AMS to audit both the central party and Westminster group accounts as filing deadlines approached. An appointment is not an audit conclusion or a finding about the police case.",
    sourceIds: ["sky-new-auditor-2023"],
  },
  {
    id: "sturgeon-arrest",
    date: "11 June 2023",
    dateTime: "2023-06-11",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "Sturgeon is arrested and released without charge",
    summary:
      "Sturgeon attended by arrangement, was arrested as a suspect at 10:09 and was released at 17:24 without charge pending further investigation. She said afterwards that she had done nothing wrong.",
    explainer:
      "At this point she was not cleared: inquiries could continue. That changed in March 2025, when police said she was no longer under investigation.",
    sourceIds: ["police-sturgeon-arrest-2023", "independent-sturgeon-arrest-2023"],
  },
  {
    id: "qualified-audit-2022-accounts",
    date: "29 June–7 July 2023",
    dateTime: "2023-06-29",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "The 2022 accounts receive a qualified audit opinion and are filed",
    summary:
      "AMS could not obtain original documentation for some cash and cheque receipts involving membership, donations and raffle income. The Electoral Commission received the accounts by the July deadline.",
    explainer:
      "A qualification means the auditor lacked enough evidence for a defined area. It is not automatically a finding of theft, false accounting or embezzlement.",
    sourceIds: ["ec-snp-accounts-2022", "sky-qualified-audit-2023", "stv-accounts-filed-2023"],
  },
  {
    id: "ec-publishes-2022-accounts",
    date: "22 August 2023",
    dateTime: "2023-08-22",
    group: "2023",
    groupLabel: "2023 · arrests, searches and public scrutiny",
    phase: "investigation",
    status: "official",
    title: "Published accounts show an £804,278 deficit and £46,766 cash",
    summary:
      "The 2022 accounts reported £4.25 million income, £5.05 million expenditure, net liabilities of £219,629 and £46,766 cash. Publication made the submitted numbers public; it did not mean the regulator had verified every figure.",
    sourceIds: ["ec-snp-accounts-2022"],
  },
  {
    id: "murrell-rearrested-charged",
    date: "18 April 2024",
    dateTime: "2024-04-18",
    group: "2024",
    groupLabel: "2024 · one charge and two unresolved investigations",
    phase: "investigation",
    status: "allegation",
    title: "Murrell is rearrested and police charge him in connection with embezzlement",
    summary:
      "Police rearrested Murrell at 09:13, questioned him and charged him at 18:35 in connection with embezzlement of SNP funds. He was released and the evidence was prepared for prosecutors.",
    explainer:
      "A police charge is a formal allegation. It was not yet a conviction or even a prosecutor's decision to take the case to court.",
    sourceIds: ["police-murrell-charge-2024"],
  },
  {
    id: "prosecution-report-submitted",
    date: "23 May 2024",
    dateTime: "2024-05-23",
    group: "2024",
    groupLabel: "2024 · one charge and two unresolved investigations",
    phase: "investigation",
    status: "official",
    title: "Police submit the Murrell prosecution report",
    summary:
      "Police passed prosecutors a standard prosecution report containing one embezzlement charge, then covering alleged conduct from 2016 to 2023. COPFS began its independent evidence and public-interest assessment.",
    explainer:
      "Later examination traced the proved offending back to 2010 and narrowed the final amount. Earlier dates and totals remained allegations until the plea was agreed.",
    sourceIds: ["police-branchform-report-2024", "branchform-copfs-briefing"],
  },
  {
    id: "advice-request-sturgeon-beattie",
    date: "9 August 2024",
    dateTime: "2024-08-09",
    group: "2024",
    groupLabel: "2024 · one charge and two unresolved investigations",
    phase: "investigation",
    status: "official",
    title: "Police ask prosecutors for advice about Sturgeon and Beattie",
    summary:
      "Police submitted an advice-and-guidance request, including whether more inquiries were needed. It was not a prosecution report and neither person had been charged.",
    explainer:
      "The distinction matters: police did not submit either Sturgeon or Beattie for prosecution.",
    sourceIds: ["branchform-copfs-briefing", "police-foi-advice-request-2026"],
  },
  {
    id: "chief-constable-confirms-live",
    date: "14 August 2024",
    dateTime: "2024-08-14",
    group: "2024",
    groupLabel: "2024 · one charge and two unresolved investigations",
    phase: "investigation",
    status: "official",
    title: "Police say the Sturgeon and Beattie investigations remain live",
    summary:
      "Chief Constable Jo Farrell confirmed that the inquiries concerning Sturgeon and Beattie were still ongoing and gave no completion date. This was the accurate public position at the time.",
    sourceIds: ["stv-branchform-timeline", "branchform-copfs-briefing"],
  },
  {
    id: "accounts-2023-published",
    date: "15 August 2024",
    dateTime: "2024-08-15",
    group: "2024",
    groupLabel: "2024 · one charge and two unresolved investigations",
    phase: "investigation",
    status: "official",
    title: "The 2023 accounts show a surplus, with an audit limitation repeated",
    summary:
      "The accounts reported £4.75 million income, a £661,568 surplus, £441,939 net assets and £42,448 cash. The auditor again lacked documentation for some cash and cheque receipts from before July 2023.",
    sourceIds: ["ec-snp-accounts-2023"],
  },
  {
    id: "sturgeon-murrell-separation",
    date: "13 January 2025",
    dateTime: "2025-01-13",
    group: "2025",
    groupLabel: "2025 · charging decisions are made",
    phase: "court",
    status: "context",
    title: "Sturgeon announces that she and Murrell have separated",
    summary:
      "Sturgeon said the couple had separated some time earlier and were ending their marriage. This is personal context only; no causal connection to a charging decision or the facts of the offence is asserted.",
    sourceIds: ["stv-sturgeon-separation-2025"],
  },
  {
    id: "sturgeon-no-reelection",
    date: "12 March 2025",
    dateTime: "2025-03-12",
    group: "2025",
    groupLabel: "2025 · charging decisions are made",
    phase: "court",
    status: "context",
    title: "Sturgeon says she will not stand at the 2026 Holyrood election",
    summary:
      "The announcement marked the approaching end of her parliamentary career. It is not evidence about the finance case, and this timeline does not claim the investigation caused it.",
    sourceIds: ["stv-sturgeon-no-reelection-2025"],
  },
  {
    id: "sturgeon-beattie-cleared",
    date: "20 March 2025",
    dateTime: "2025-03-20",
    group: "2025",
    groupLabel: "2025 · charging decisions are made",
    phase: "court",
    status: "official",
    title: "Police end the Sturgeon and Beattie investigations without charge",
    summary:
      "Police Scotland said Nicola Sturgeon and Colin Beattie had not been charged and were no longer under investigation. Scotland's prosecution service later said senior prosecutors found no charge or further inquiry was required, and a second independent senior lawyer agreed.",
    explainer:
      "For Operation Branchform, this is the present legal status. A separate July 2026 complaint about Yes Scotland's finances does not publicly name Sturgeon as a suspect.",
    sourceIds: ["police-branchform-update-2025", "branchform-copfs-briefing"],
  },
  {
    id: "murrell-petition-appearance",
    date: "20 March 2025",
    dateTime: "2025-03-20",
    group: "2025",
    groupLabel: "2025 · charging decisions are made",
    phase: "court",
    status: "allegation",
    title: "Murrell attends his first private court hearing",
    summary:
      "Murrell made no plea and was released on bail while the serious criminal case continued. The allegation at this early stage was described as more than £460,000.",
    explainer:
      "This was the first private court hearing in a serious criminal case. No plea was taken, and prosecutors were allowed to keep preparing the case. The amount later proved was £400,310.65.",
    sourceIds: ["scotgov-branchform-case-updates", "branchform-copfs-briefing"],
  },
  {
    id: "murrell-indicted",
    date: "19 January 2026",
    dateTime: "2026-01-19",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "allegation",
    title: "Prosecutors serve a High Court indictment",
    summary:
      "The indictment alleged that Murrell had embezzled £459,046.49. That figure was still an allegation: prosecutors and the defence later agreed a narrower proved total and an earlier start date.",
    sourceIds: ["scotgov-branchform-case-updates", "branchform-copfs-briefing"],
  },
  {
    id: "evidence-statement-served",
    date: "4 February 2026",
    dateTime: "2026-02-04",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "official",
    title: "A 318-page statement of agreed evidence is served",
    summary:
      "Prosecutors served a Statement of Uncontroversial Evidence and draft schedules running to 118 pages and more than 1,000 purchases. This reduced what would have needed to be proved by witnesses at a trial.",
    sourceIds: ["branchform-copfs-briefing", "murrell-agreed-narrative"],
  },
  {
    id: "preliminary-hearing-adjourned",
    date: "20 February 2026",
    dateTime: "2026-02-20",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "official",
    title: "The preliminary hearing is moved to 25 May",
    summary:
      "The Crown and defence jointly asked for more preparation time because of the volume of material and the defence's position. A High Court judge granted the application.",
    explainer:
      "The official record gives an ordinary case-preparation reason. It provides no basis for claims that the date was moved for political advantage.",
    sourceIds: ["branchform-copfs-briefing"],
  },
  {
    id: "plea-discussions-begin",
    date: "3 March 2026",
    dateTime: "2026-03-03",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "court",
    title: "Murrell instructs his lawyers to explore a guilty plea",
    summary:
      "This was not public at the time. COPFS disclosed after sentencing that Murrell's lawyers began discussions in March and formally confirmed on 21 May that he would plead guilty.",
    sourceIds: ["branchform-copfs-briefing"],
  },
  {
    id: "murrell-guilty-plea",
    date: "25 May 2026",
    dateTime: "2026-05-25",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "court",
    title: "Murrell pleads guilty to one charge of embezzlement",
    summary:
      "At the High Court in Edinburgh, Murrell admitted embezzling £400,310.65 from the SNP between August 2010 and October 2022. He was remanded in custody for sentence.",
    explainer:
      "This is the definitive criminal finding. Police never reported anyone for fraud, so describe the conviction as embezzlement, not fraud.",
    sourceIds: ["police-murrell-conviction-2026", "branchform-copfs-briefing"],
  },
  {
    id: "sturgeon-public-response",
    date: "31 May 2026",
    dateTime: "2026-05-31",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "reported",
    title: "Sturgeon says she did not know about the crimes",
    summary:
      "Sturgeon said Murrell had betrayed her trust, denied knowing about his offending and said she was not responsible for it. This is her attributed account; the established legal fact is that she was not charged and no longer under investigation.",
    sourceIds: ["ap-sturgeon-response-2026", "police-branchform-update-2025"],
  },
  {
    id: "agreed-narrative-read",
    date: "2 June 2026",
    dateTime: "2026-06-02",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "court",
    title: "The full agreed account is read in court",
    summary:
      "The public finally receives the detailed, admitted story: hundreds of personal purchases, false expense claims and invoices, a Volkswagen, a Jaguar and the £124,550 motorhome. The total proved is £400,310.65.",
    explainer:
      "COPFS warned that investigative material left out of this agreement was not proved and must not be treated as fact. The court record does not identify unnamed recipients or make Sturgeon responsible for omitted purchases.",
    sourceIds: ["murrell-agreed-narrative", "branchform-copfs-briefing"],
  },
  {
    id: "party-recovery-action",
    date: "4–11 June 2026",
    dateTime: "2026-06-04",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "aftermath",
    status: "ongoing",
    title: "The SNP says it is seeking recovery of the stolen money",
    summary:
      "The party executive reportedly authorised civil recovery action. John Swinney later told Parliament that, as the SNP's principal trustee, he had acted to seek return of the money.",
    explainer:
      "Action to recover money is not the same as successful repayment. No cited source says the full loss has yet been returned.",
    sourceIds: ["itv-snp-recovery-2026", "parliament-snp-recovery-2026"],
  },
  {
    id: "parliament-finance-review-motion",
    date: "10 June 2026",
    dateTime: "2026-06-10",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "aftermath",
    status: "official",
    title: "Holyrood backs a broader independent review of party finance",
    summary:
      "An original Labour motion proposed a parliamentary inquiry specifically into Branchform and Murrell's conviction. An amendment replaced that with an independently led review covering all political parties. The amended motion passed 71–50.",
    explainer:
      "It is incomplete to say simply that Parliament either approved or rejected a Branchform inquiry: the wording was changed before the final vote.",
    sourceIds: ["scottish-parliament-review-motion-2026"],
  },
  {
    id: "murrell-sentenced",
    date: "23 June 2026",
    dateTime: "2026-06-23",
    group: "2026-court",
    groupLabel: "2026 · guilty plea, proof and sentence",
    phase: "court",
    status: "court",
    title: "Murrell is sentenced to five years and three months",
    summary:
      "Lord Young set a seven-year sentence, then reduced it for the early guilty plea and backdated it to 25 May. The judge described prolonged, calculated dishonesty and a serious breach of trust, while also recording remorse and a low risk of reoffending.",
    sourceIds: ["murrell-sentencing-judiciary"],
  },
  {
    id: "asset-recovery-remains",
    date: "23 June 2026",
    dateTime: "2026-06-23",
    group: "2026-after",
    groupLabel: "After sentence · the parts that remain live",
    phase: "aftermath",
    status: "ongoing",
    title: "The prosecution ends, but asset and property work continues",
    summary:
      "Scotland's prosecution service said the criminal case had concluded. Separate court action would try to recover money gained through the crime and decide what happened to seized property. Police confirmed that this work remained unfinished.",
    explainer:
      "That is why this page does not say every part of Operation Branchform is closed.",
    sourceIds: ["copfs-murrell-sentence-2026", "police-murrell-sentence-2026"],
  },
  {
    id: "ec-review-under-way",
    date: "30 June 2026",
    dateTime: "2026-06-30",
    group: "2026-after",
    groupLabel: "After sentence · the parts that remain live",
    phase: "aftermath",
    status: "ongoing",
    title: "The Electoral Commission reviews earlier SNP filings",
    summary:
      "The Commission said it was reviewing past accounts, declarations and disclosures after the conviction. It also said its annual checks found no evidence that £2,248,353 in public grants for party policy research and development had been misused.",
    explainer:
      "A review is not a finding of wrongdoing. The public-grant checks and the wider post-conviction account review are two different things.",
    sourceIds: ["ec-snp-review-2026"],
  },
  {
    id: "commons-explores-joint-work",
    date: "1 July 2026",
    dateTime: "2026-07-01",
    group: "2026-after",
    groupLabel: "After sentence · the parts that remain live",
    phase: "aftermath",
    status: "official",
    title: "A Commons committee explores joint scrutiny with Holyrood",
    summary:
      "The Scottish Affairs Committee wrote to Scottish Parliament committees about possible joint work. Its announcement did not itself open a formal inquiry.",
    sourceIds: ["commons-committee-branchform-2026"],
  },
  {
    id: "yes-scotland-complaint",
    date: "5 July 2026",
    dateTime: "2026-07-05",
    group: "2026-after",
    groupLabel: "After sentence · the parts that remain live",
    phase: "aftermath",
    status: "ongoing",
    title: "Police make inquiries into a separate Yes Scotland complaint",
    summary:
      "Police confirmed that they had received a complaint alleging that just over £1.5 million in Yes Scotland income was unaccounted for. Yes Scotland denied money was missing and later provided its accounts to police.",
    explainer:
      "This is separate from Operation Branchform. As at 2 August, police had not publicly named Sturgeon, or anyone else, as a suspect, and no wrongdoing had been established.",
    sourceIds: [
      "stv-yes-scotland-complaint-2026",
      "independent-yes-scotland-accounts-2026",
      "companies-house-yes-scotland",
    ],
  },
  {
    id: "branchform-foi-records",
    date: "13 July 2026",
    dateTime: "2026-07-13",
    group: "2026-after",
    groupLabel: "After sentence · the parts that remain live",
    phase: "aftermath",
    status: "official",
    title: "Police release narrow records about warrants and the advice request",
    summary:
      "Police said they had sought no court orders compelling the SNP itself to provide financial information. A separate response confirmed the August 2024 advice request but withheld it and said the Crown held the 542-page prosecution review.",
    explainer:
      "These disclosures answer limited questions. They do not prove broad claims that the party either fully co-operated with or obstructed every part of the inquiry.",
    sourceIds: ["police-foi-court-orders-2026", "police-foi-advice-request-2026"],
  },
  {
    id: "latest-status",
    date: "2 August 2026",
    dateTime: "2026-08-02",
    group: "2026-after",
    groupLabel: "After sentence · the parts that remain live",
    phase: "aftermath",
    status: "ongoing",
    title: "The latest verified position",
    summary:
      "Murrell is serving a five-year-three-month sentence. Sturgeon and Beattie were not charged and are no longer under investigation in Operation Branchform. Asset recovery, the Electoral Commission review and police inquiries into the separate Yes Scotland complaint remain unfinished.",
    explainer:
      "This page will change when an official source changes that position, not simply when a new allegation or anonymous claim appears.",
    sourceIds: [
      "murrell-sentencing-judiciary",
      "police-branchform-update-2025",
      "copfs-murrell-sentence-2026",
      "ec-snp-review-2026",
      "stv-yes-scotland-complaint-2026",
    ],
  },
];
