# Repositioning QA report

What was done, what was verified, and what was not done.

Dated 3 August 2026. Seven commits on `worktree-blog-carousel-review`, none
pushed. `main` and `origin/main` are both still at `100fd9b`.

## Validation

Every command run against a local production build.

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | Clean |
| Types | `npx tsc --noEmit` | Clean |
| Tests | `npm test` | 100 passing, 0 failing (82 before) |
| Build | `npm run build` | Compiles, 624 static pages (620 before) |
| Proxy behaviour | `npm run check:proxy` | 10/10 |
| Indexability | `npm run check:indexability` | 410/410 URLs clean |
| Rendered spacing | `npm run check:spacing` | 406 pages, no glued words |
| Route smoke test | 23 critical routes plus 404 | All expected status codes |
| Em dashes | rendered output on 9 pages | Zero |

### Every check was proved able to fail

A check that cannot fail is worse than no check, because it is trusted. Each
one was verified by reintroducing the fault it exists to catch.

- `check:proxy`: renaming the config export back to `proxyConfig` fails it, and
  names the static asset that stopped being excluded.
- `check:indexability`: injecting a second H1 into `/accessibility` fails it and
  names the page and the fault.
- `houseStyle`: verified against the real repository, which had 438 offences.
- Navigation and sitemap tests: written after the bugs they describe, both of
  which were real.

## What changed

### Positioning
Umbrella moved from a poverty guide to independent public data for Scotland.
Poverty keeps a hub of its own at `/poverty` and every poverty URL still works.

### Homepage
Eleven competing sections reduced to a hero, five doors, three tools, one
featured piece, a trust strip, the newsletter and the FAQ. Nothing deleted;
every removed section has a recorded new home in the migration map.

### Navigation
Primary is now Your area, Your money, Councils, Who decides, Investigations.
One registry still feeds the header, both menus, `/browse` and the 404.

### Hubs
`/money`, `/who-decides` and `/poverty` are new. `/accessibility` is new.
`/areas`, `/councils` and `/blog` gained the content moved off the homepage.

### Councils
Unchanged by this work, other than navigation and the em dash sweep. The
council section was rebuilt in the preceding session.

### SEO
Proxy matcher fixed, sitemap completed, indexability checking added.

### Accessibility
Statement published, stating designed and tested against WCAG 2.2 AA rather
than claiming an audit nobody has done, and naming four known limitations.

### Documentation
Five new documents, listed in the deliverables section below.

## Bugs found and fixed along the way

Recorded because each was invisible to the build.

1. **Proxy matcher ignored.** `proxyConfig` is not a name Next.js reads, so the
   proxy ran unmatched on every static asset. Found by requesting a
   `_next/static` stylesheet and getting `X-Robots-Tag` back on a path the
   matcher excludes.
2. **Four pages missing from the sitemap.** `/money`, `/who-decides`,
   `/poverty` and `/accessibility`. The sitemap is a hand-written list. Found
   only because an injection test quietly passed.
3. **Em dash guard in `seo.tsx` broken by the sweep.** A check that threw when
   metadata contained an em dash became a check for comma-space, which would
   have rejected any title with a comma.
4. **The same thing to the navigation test's assertion.** Both now match on an
   escape so no future sweep can rewrite the rule.
5. **The HTML entity form survived the sweep** in the method note, so an em dash
   rendered on all 32 council records. Written as an entity in JSX it is
   invisible to a scan looking for the character. The entity is not spelled out
   here because the house style test scans this file too, which is the correct
   behaviour: documentation is covered by the rule like everything else.
6. **Two components orphaned by the homepage rewrite.** `AreaGrid` and
   `BlogCarousel` were rehomed rather than left as dead code.

## Bugs found in my own tooling before they did damage

1. The em dash script's tidy-up pass matched punctuation on 5,415 lines that
   contained no dash, which would have rewritten unrelated prose repository
   wide. Caught because the changed-line count was ten times the dash count.
2. The same script used a whitespace class that matches newlines, so a dash at
   a line break joined two lines and reflowed the file.
3. `check-proxy` originally used `fetch`, which silently drops a `host` header
   because it is forbidden by the Fetch spec. Ten checks passed while testing
   nothing. Rewritten with `node:http`.

## Browser verification

Checked at 390px and 1280px in the in-app browser against the production build.

- No horizontal overflow at either width. `scrollWidth` equals `innerWidth` and
  no element extends past the viewport at 390px.
- Exactly one H1 on every page sampled.
- Navigation renders the five new primary items.
- All 39 navigation destinations return 200.

### Not verified in a real browser

- **768px, 1024px and 1440px.** Overflow was checked at the two extremes only.
- **Keyboard journeys, focus visibility, menu open and close.** Asserted in the
  accessibility statement as tested by hand, which was true of the previous
  session's work, not re-run here.
- **Dark mode and reduced motion on the new pages.** They use existing tokens
  and existing components, so they inherit both, but this was not confirmed
  visually.
- **Real iOS Safari.** Still outstanding, as the accessibility statement says.

## Deliverables

| Deliverable | Status |
| --- | --- |
| `docs/site-repositioning-plan.md` | Done, including the homepage migration map |
| `docs/search-console-launch-checklist.md` | Done |
| `docs/distribution-playbook.md` | Done |
| `docs/product-roadmap.md` | Done |
| `docs/success-metrics.md` | Done |
| `docs/repositioning-qa-report.md` | This file |
| Homepage migration map | Done, inside the plan |
| Automated SEO and indexability checks | Done, `check:indexability` and `check:proxy` |
| Accessibility statement | Done |
| Automated accessibility testing | **Not done** |
| Updated navigation and command search | Done |
| New or strengthened section hubs | Done for money, who-decides, poverty. Partial for councils and areas |
| Improved homepage | Done |
| Improved postcode journey | **Not done** |
| Updated publisher and structured-data model | **Not done** |
| Press release generation tooling | **Not done** |

## Not done

Stated plainly rather than described as partial.

**Phase 6, the postcode journey.** Untouched. The existing flow works and is
linked from the new hubs, but the richer local civic result described in the
brief was not built.

**Phase 7, publisher identity and structured data.** The entity model was not
reviewed. The About page was not rewritten. `orgJsonLd` still describes the
organisation using the old poverty-led wording, which now disagrees with the
site's positioning. This is the most visible remaining inconsistency.

**Phase 9, automated accessibility testing.** No Playwright, axe or Lighthouse
tooling was added. The accessibility statement is written and honest about
what has actually been tested, which is manual and automated contrast and
keyboard checking from the previous session, not an automated suite.

**Phase 10, performance.** No measurement was taken and no performance work was
done. The homepage rewrite removed a client-side carousel from the first load,
which should help, but that is a reasonable expectation rather than a measured
result and should not be reported as an improvement.

**Phase 11, press release generation tooling.** The distribution playbook is
written. The generator is not built. `scripts/build-council-csv.mjs` from the
previous session is the closest thing that exists.

**Phase 5, partially.** Multi-year trends, similar-council comparison and
population or deprivation context were not added to council pages. Following
the brief, the interface was left out rather than shipped against data that
does not exist. A defensible peer grouping is the blocker: an arbitrary
similarity rule would breach the no-invented-comparisons rule.

**Phase 14, partially.** Regression coverage was added for navigation, sitemap
completeness, house style and proxy behaviour. Not added: representative
freshness, social card presence, broken downloadable assets.

## Out of scope, and untouched

Analytics, Microsoft Clarity, analytics consent, cookie consent, tracking, the
privacy page and the analytics-related Content Security Policy rules. None were
edited. The privacy page appears in the em dash sweep diff for that reason only:
two dashes in body copy, no change to wording, policy or behaviour.

`docs/success-metrics.md` defines event names for whoever implements tracking
later. It adds no tracking code.
