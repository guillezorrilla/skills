---
name: icp-lead-generation
description: Finds new target accounts against an ideal customer profile and proves each one fits, with filters written so they can come back false, a source and date on every row, and the rejects kept. Use whenever someone wants leads, a prospect list, target accounts, "companies like this customer", or wants an existing list tightened, even if they never say the words ICP or lead generation.
---

# ICP lead generation

## Overview

A target list is not finished when it is long. It is finished when someone else can check it. The usual output, two hundred rows that match a vague description in a way nobody recorded, costs more than it saves: every unchecked row turns into a rep's wasted hour and a stranger's wasted attention.

So the unit of work here is the filter that can come back false, and the citation that proves a row passed it. Twelve verified accounts beat two hundred unverified ones, because the twelve can be worked today and the two hundred have to be re-checked before anyone dares touch them.

## When to Use

- Someone wants leads, prospects, or target accounts, whether or not they use those words.
- A team knows its ideal customer well and needs more accounts that match it.
- Asked to find "companies like" a named customer.
- An ICP exists only as adjectives, mid-market, innovative, growing, and needs to become something checkable.
- A list is producing bad conversations and needs tightening rather than extending.

**Not for:** contacting anyone, which is a separate step with separate rules; researching accounts already on the list; scoring inbound leads who came to you, since their behaviour beats any external filter; or replacing a data provider the team already licenses. Use its export as an input here instead.

## Start from their ICP, not yours

Most teams asking for leads are not asking for a new ICP. They have one, they trust it, and they want more accounts that match. Take theirs as given.

If they handed you a definition, use it as written. Convert each line into a checkable filter, say which lines you cannot check from any source you are allowed to use, and get on with finding accounts. Do not argue with their segment. They have sat in the sales calls and you have not.

If they have not said what it is, ask once, in a single short message, for the smallest set of answers that makes the work possible:

- the filters they already use, in their own words
- two or three current customers who fit well, and one who did not work out
- geography and size band
- anything that rules an account out immediately

That is a request for facts, not an interview. Ask, then start on whatever part does not depend on the answer.

Derive an ICP from evidence only when they say they do not have one. In that case look at customers who renewed or expanded rather than customers who merely signed, find what is observable and common to them, then check the same traits against a few who churned or never closed. A trait shared by wins and losses is not a filter, however much it feels like one. Say plainly that the profile is a hypothesis and treat the first list as an experiment with a result to record.

## Work inside the team's setup

Before asking anything, look at what the team already has. If they keep a profile, a brief, or an ICP doc in whatever they use for documents, read it. If their CRM is connected, read the stage names and the suppression list out of it rather than asking. Asking is the expensive channel, and asking for something they have already written down is how a tool gets abandoned.

Three things decide whether the list is usable, so establish them one way or the other: which list or field holds their suppressions, how account ownership gets checked, and whether they license a data provider whose export should be the input here. Where you cannot establish one, say so in the output rather than guessing.

Never introduce a tool the team does not already use.

## Where the data may come from

Permitted sources, named in the output: the company's own site and blog, app-store listings, careers pages and job posts, public filings and registries, industry directories and associations, review sites, news and press releases, conference exhibitor lists, your own CRM, and any provider the team licenses.

Off limits: anything behind a login you were not given, anything a site's terms forbid collecting, which includes LinkedIn, paywalled content taken without access, and any collection that ignores robots.txt or hammers a server. A list built that way cannot be shown to a customer and puts the account it was built from at risk. When a fact is only available that way, mark it unknown and move on.

Say which sources you used. "Found online" is not a source.

## The Process

### 1. Write filters that can come back false

Every filter needs a named source that settles it, and a value that could turn out to be no. If you cannot say what evidence would disqualify a company, you have a mood rather than a filter.

```
Weak     innovative · mid-market · growing fast · tech-forward
Checkable  10 to 60 physical locations        → their own store locator
           has a customer-facing mobile app   → App Store or Play listing exists
           app updated in the last 90 days    → listing's "updated" date
           hiring ops or digital roles        → careers page, with post date
```

Sort them into two groups and keep the split visible. Hard filters disqualify: fail one and the account is out. Soft signals only rank, and never disqualify. A hard filter you are willing to waive is a soft signal, so move it before you start looking, not while you are staring at a company you have already fallen for.

**Marketing numbers are not counts.** A brand's about page, its press releases and every aggregator will disagree with its own store locator, and they are wrong in both directions. One chain claiming a hundred plus locations turns out to have eighteen. Another that reads mid-size comes back at a hundred and nineteen and fails the band outright. Count the locator. Use a third party only to cross-check a first-party number, never as the number.

### 2. Search wide, then verify narrow

Keep the two phases apart, because casting wide is cheap and being wrong is expensive.

Gather candidates from several angles: directories, app-store categories, the language of job posts, conference exhibitor lists, competitors' customer logos, "integrates with" pages of tools your customers use. One search angle finds one slice of the market and reads as complete.

Then check each candidate against every hard filter, recording which source settled it and the date you looked. A row whose filters were probably fine is unverified, so label it that way or drop it.

Techniques that hold up, when the filters are about size, technology or recency:

- **Counts**: enumerate the store locator's per-store pages or its sitemap, or take the brand's own printed figure. Where the locator renders in JavaScript, the store API behind it usually returns the whole list.
- **Product and app facts**: the public app-store lookup endpoints return seller, bundle identifier, version, last-updated date, rating and rating count. Last updated is the fact that matters. A listing that has not moved in a year is a different prospect from one that shipped last week, and a listing marked inactive is a different prospect again.
- **Who the incumbent is**: bundle identifiers, the DNS records on an ordering subdomain, and the association files a vendor has to publish for deep links all name the vendor when the listing does not. Two brands shipping an identical build number on the same day are on the same templated platform, which tells you what a displacement conversation is actually against.

**Small samples are not evidence.** A two-star average from eight ratings says nothing at all; the same average from two hundred says something. Quote the count beside the rating or leave both out.

### 3. Keep the rejects

The rejected list is half the output. It stops the same company being re-found next quarter, and the reasons tell you whether the profile itself is wrong. Twenty rejects failing the same filter means either a filter set too tight or a segment that does not exist.

```
Rejected · Northwind Coffee · 4 locations, hard filter is 10 to 60 · store locator, 2026-08-06
```

### 4. Suppress from your own footprint, not only from the CRM

The CRM is the right suppression list: current customers, open opportunities, recent closed-lost, live sequences, and anyone who asked not to be contacted. A prospecting email to an existing customer is the fastest way to lose that account's trust in the team.

When the CRM is not connected, you are not stuck. **Your own public footprint is a suppression list you always have.** The products published under your company's own developer or vendor account, your logo wall, your case studies, your integration directory: every account that appears there is a customer, and excluding them needs no internal access at all.

Then say what that misses, because it is a lot. Open opportunities, past losses, and customers whose product ships under their own name rather than yours are all invisible to it. The list still needs a pipeline check before anyone sends.

**A former customer now running a competitor is not a reject.** It is a dated displacement fact and often the most useful row on the page. Record who they moved to and when the replacement shipped.

### 5. Contacts, when they are in scope

Name the role you need and why that role owns the problem. Then keep the provenance of every person: a contact found in a permitted source keeps that source, and a pattern-guessed address such as first.last@company.com is labelled guessed and unverified every single time. Guessing a format is normal practice. Presenting the guess as verified is not, and a run of bounces costs the sending domain's reputation for months.

Never invent a phone number or a personal address.

### 6. Hand over a list that shows its own limits

For each row: the company, the hard filters it passed, the source and date behind each, soft signals with their values, and one plain sentence on why it fits.

Then the part that gets skipped, a coverage note. How you searched, roughly what share of the segment you think you saw, and what you could not check. A list that hides its gaps gets read as the whole market.

Two caveats belong there every time, because they change how the list gets worked:

- **Counts at the very edge of the band.** Name them. They are the first rows to re-confirm and the first to fall out.
- **A band that sits outside your existing customers.** If the proof you have comes from ten-location operators and this list is fifty-location chains, say so plainly. The case studies will not transfer, the cycle is longer, procurement is more formal, and a franchisee-consent problem may exist that has never come up before. That is worth knowing before the segment gets a quarter of someone's time.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Two hundred rows shows it worked." | Volume is the easy half. Each unverified row spends a rep's hour and a stranger's attention on a guess. |
| "I'll verify during outreach." | That means verifying by interrupting people, and the wrong rows are the ones that damage the sender. |
| "Their ICP is too vague, I'll write a better one." | They have sat in the calls. Convert their definition into checkable filters and ask one question about the part you cannot check. |
| "I'll infer the ICP from the website instead of asking." | One short question costs a minute. A list built on the wrong segment costs a quarter. |
| "LinkedIn has all of this." | Behind a login and against its terms. The list becomes unusable and the account is at risk. Mark those facts unknown. |
| "This one is close enough on size." | Then size is a soft signal. Decide that before you look at a company you already like, not after. |
| "I know this industry, I don't need a source per row." | The next person does, and so does the version of you defending the list. Unsourced rows get re-checked from scratch. |
| "I can guess the email format." | You can, and you label it guessed. Bounces cost domain reputation for months. |
| "The rejects don't matter." | They are the only evidence that the profile is wrong, and they stop dead accounts being re-found next quarter. |
| "Our best customers all have this trait." | Check the losses too. A trait shared by wins and losses filters nothing. |
| "The model knows which companies fit." | Training data is stale and confidently wrong about company facts. Every row needs a source looked at today. |
| "One good search covers the segment." | Directories, app stores, job posts and exhibitor lists surface different companies. One angle looks complete and is not. |
| "Their about page says 45 locations." | Marketing numbers are wrong in both directions, and one of them will put the account outside the band. Count the locator. |
| "No CRM, so I cannot dedupe." | Your own public footprint is a suppression list you always have. Use it, then write down what it misses. |
| "They churned to a competitor, so cross them off." | That is a dated displacement fact and probably the best row on the page. Record who they moved to and when. |
| "The app is on two stars, that is the whole pitch." | From eight ratings that is noise. Quote the sample size or drop the claim. |
| "The band is a bit above our current customers, close enough." | Then the case studies do not transfer and the cycle is longer. Say it in the coverage note rather than letting someone find out in month two. |

## Red Flags

- A row with no source, or a source recorded as "web search".
- Filters that cannot come back false: innovative, modern, fast-growing, tech-forward.
- No rejected list, or rejects with no reason attached.
- A hard filter quietly waived for a company that felt right.
- Contact addresses presented as verified when they were pattern-guessed.
- The list is what one obvious search returns, in that order.
- Existing customers, open opportunities or suppressed contacts in the output.
- No coverage note, so the list reads as the whole market.
- Data taken from behind a login, a paywall, or against a site's terms.
- Every row scored 8 out of 10. A score that never rejects is decoration.
- The team's own ICP quietly replaced with a better-sounding one.
- A location count taken from press or an aggregator with no first-party check.
- A rating or review count quoted without its sample size.
- No suppression at all, on the grounds that the CRM was not connected.
- Accounts sitting at the very edge of the band, presented as solidly inside it.
- A former customer now on a competitor silently dropped instead of recorded.
- A list far outside the size band of every existing customer, with no note that the proof does not transfer.

## Verification

- [ ] The team's own ICP was used where they have one, converted rather than replaced
- [ ] Every hard filter names the source that settles it and could return false
- [ ] Hard filters and soft signals are separated, and no hard filter was waived
- [ ] Every row carries a source and the date it was checked, per filter
- [ ] Rejected accounts are listed with the filter each one failed
- [ ] The list is deduped against customers, open opportunities and suppressions
- [ ] Pattern-guessed contact details are labelled unverified
- [ ] Only permitted sources were used, and they are named
- [ ] A coverage note states how you searched and what you could not check
- [ ] Location and size facts come from a first-party source, with third parties used only to cross-check
- [ ] Product and app facts include the last-updated date, and any rating carries its sample size
- [ ] Suppression used the CRM where connected and your own public footprint where not, with the gap named
- [ ] Former customers now running a competitor are recorded with dates, not dropped
- [ ] Counts at the edge of the band are flagged for re-confirmation
- [ ] Where the band sits outside the existing customer base, the output says so
- [ ] Where the profile is still a hypothesis, the output says so
