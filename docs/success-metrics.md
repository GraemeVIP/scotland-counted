# Success metrics

What counts as this site working, and how to tell.

Analytics implementation is out of scope for this work, so nothing here adds or
changes tracking code. This document defines the events and definitions so that
whoever wires them up has one place to work from, and so the definitions are
agreed before the numbers exist to argue about.

## North star

**Unique monthly visitors who complete at least one useful outcome.**

Not visits, not page views. A person who reads a council page and leaves has
been informed, which is worth something, but the site exists to move someone
from a question to an action. One person completing one outcome is the unit.

Counted per person per month, so somebody who drafts four emails in a week
counts once. That keeps the metric honest when a single local story sends a
burst of traffic.

## What counts as a useful outcome

| Outcome | Event | Fires when |
| --- | --- | --- |
| Local result seen | `local_result_viewed` | A postcode resolves and the result renders |
| Calculator completed | `calculator_completed` | A calculation returns a figure, not on page load |
| Council compared | `council_compared` | A council record page is scrolled past the compare block |
| Data downloaded | `data_downloaded` | A CSV or chart download starts |
| Source opened | `source_opened` | An outbound link to an official document is clicked |
| Email drafted | `representative_email_opened` | The mail client is opened with a prepared draft |
| Local page shared | `page_shared` | The share control is used |
| Alert signup | `alert_subscribed` | The newsletter form returns success |

### Properties

Every event carries: `page_path`, `section` (area, money, councils,
who-decides, investigations), `is_returning`.

Outcome-specific: `calculator_completed` carries `calculator` (`take_home_pay`
or `council_tax`). `council_compared` and `local_result_viewed` carry
`council_slug`. `source_opened` carries `publisher`.

**No event carries a postcode, a salary or any figure the visitor typed.**
`local_result_viewed` carries the resolved council slug, which is public
geography, not the postcode that produced it.

## Funnel

```
land  ->  local or personal result  ->  understand  ->  responsible body  ->  act
```

| Stage | Event | Question it answers |
| --- | --- | --- |
| Land | `page_view` | Did they arrive? |
| Result | `local_result_viewed` or `calculator_completed` | Did they get something about themselves? |
| Understand | `council_compared` or `source_opened` | Did they look at the evidence? |
| Responsible | `who_decides_viewed` | Did they find out who to ask? |
| Act | `representative_email_opened` | Did they do something? |

The drop between Understand and Responsible is the one to watch. It is the step
the repositioning was meant to fix, and the reason `/who-decides` exists.

## Guardrails

Metrics that must not get worse while the north star improves:

- **Bounce on hub pages.** If `/money` sends people straight back out, the doors
  are wrong.
- **Corrections raised.** A rise is good news about trust and bad news about
  accuracy. Read alongside corrections upheld.
- **Time to first result.** If the postcode journey slows, the funnel narrows
  at the top.
- **Share of outcomes from one council.** If a single local story dominates for
  more than a month, the growth is borrowed, not built.

## Avoiding double counting

- Deduplicate the north star on a **visitor and calendar month** basis, not per
  session. A person who returns four times in a month is one person.
- `calculator_completed` fires on a settled result, not on every keystroke.
  Debounce it, or an idle user typing a salary generates twenty completions.
- `source_opened` and `data_downloaded` can both fire for the same click on the
  data page. Count the download, not the outbound link, when both apply.
- A local story produces one spike across many pages. Attribute at visitor
  level, not page level, or the same person counts once per council page they
  read.

## Supporting categories

| Category | Measures | Leading or lagging |
| --- | --- | --- |
| Reach | Unique visitors, referring domains, coverage secured | Leading |
| Use | Outcomes per visitor, calculator completions | Leading |
| Trust | Source opens, corrections raised, returning visitors | Lagging |
| Action | Emails drafted, representative responses recorded | Lagging |
| Sharing | Shares, inbound links from community groups | Leading |
| Retention | Month two return rate, alert subscribers | Lagging |
| Quality | Reading age, broken links, failed checks | Leading |
| Authority | Citations by journalists and campaign groups | Lagging |

## What not to optimise

Page views, session duration and social followers. Each can be raised by making
the site worse: more pagination, slower answers, more posting. The site is
useful when somebody gets an answer quickly and does something with it, which
looks like a short session.
