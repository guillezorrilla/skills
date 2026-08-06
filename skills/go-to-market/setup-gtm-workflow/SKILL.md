---
name: setup-gtm-workflow
description: Records how a sales, success or marketing team already works (which CRM and tools are connected, their real pipeline stages, sequencer, suppression rules, ICP and approvals) into one profile the other go-to-market skills read. Run this once per team before using them. Use whenever someone sets these skills up for a team, or when a skill needs to know the team's process and tools.
---

# Setup GTM workflow

## Overview

Every go-to-market team already has a process. They have a CRM with stage names somebody argued about, a place sends actually happen, a suppression list, rules about who may contact whom, and templates that work. A skill that ignores all of that and invents its own vocabulary gets used once.

This skill spends one conversation learning the existing setup and writing it down, so the other skills fit into the process instead of competing with it. It records and never redesigns. If the pipeline has seven stages with names nobody else would choose, those are the stage names.

## When to Use

- Before the first use of any other go-to-market skill with a new team.
- Someone is setting these skills up for their team.
- A skill needs the team's stage names, tools, ownership rules or ICP and cannot find the profile.
- The stack changed: a new CRM, a new sequencer, a new notes tool.

**Not for:** deciding what the process should be, which is the team's call and often a live argument; auditing or criticising the current process; or engineering conventions in a code repository, which is a different skill.

## What to detect before asking anything

Asking is the expensive channel. Look first, at whatever is connected in this session:

- CRM, such as HubSpot or Salesforce: the actual pipeline names and stage names, owners, required fields, lifecycle stages, and how many records sit in each stage.
- Inbox and calendar: who has been talking to whom, and what a real thread from this team looks like.
- Meeting notes, from tools such as Granola, Fireflies, Gong or Notion: how calls get recorded and where the notes land.
- Support desk: severity levels and what counts as an escalation, since one of the skills refuses to send cheerfully into an open one.
- Docs and wikis: an existing ICP definition, battle cards, pricing, approved claims.
- Product analytics or billing, where usage data lives.

Report what you found by name, and what is not connected. A missing tool is a fact about the setup, not a gap to fill with an assumption.

## Then ask only what cannot be detected

One message, short, every question carrying your best guess so they can correct rather than compose:

1. Which pipeline and stages are the live ones, when the CRM shows more than one.
2. Where sends actually happen: the CRM, a sequencer, or someone's own inbox.
3. Who is allowed to contact a named account, and how you check that first.
4. Where suppression and do-not-contact live, and who maintains them.
5. The ICP as they define it today, in their words.
6. Which regions their recipients sit in, since the rules differ.
7. Who signs off before anything goes out, if anyone.
8. Where a message or a note has to be logged so the next person sees it.

Take their answers as given. This is a recording exercise, not an interview about whether the process is any good.

## What to write

One profile, with these headings, so the other skills can find what they need:

```
# gtm-workflow

## Tools
crm: HubSpot (connected) · pipeline "New Business"
sequencer: HubSpot Sequences
notes: Granola, notes land in Notion "Call notes"
support: Zendesk, sev-1 means payments or outage
analytics: not connected

## Pipeline
stages: Discovery → Scoping → Proposal → Legal → Closed Won
owner per stage: AE owns through Proposal, then Ops

## Rules
account ownership: check CRM owner before any first touch
suppression: HubSpot "Do not contact" list, maintained by Ops
approval: nothing to VP+ titles without Dana
regions: US, Canada, UK, so CAN-SPAM, CASL and UK PECR apply
logging: every send logged as a CRM activity on the account

## ICP
<their words, unedited>

## Voice
best-performing messages live in: Notion "Outreach that worked"

## Unknown
whether marketing owns the nurture list
```

Fill only what you established. Anything you did not establish goes under Unknown, by name. An invented stage name is worse than a blank, because the next skill will use it in front of a customer.

## Where the profile lives

The team needs future chats to find this, and a chat has no memory of the last one. So put it somewhere the connectors can reach and say which:

- A doc in whatever the team uses, Notion, Google Drive, Confluence, named `gtm-workflow`. Future sessions search for that name.
- Or pasted into a Claude Project's instructions, when the team works inside a project. Then every chat in that project starts with it.

Say plainly which of those you did, and do not save it anywhere the user did not choose.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll just ask them all of it." | Half of it is sitting in the connected CRM. Asking for a fact you can read wastes the one channel they have to correct you. |
| "Their process has the standard stages." | Stage names never match, and using the wrong one in front of a customer is the tell that nobody looked. |
| "This pipeline is a mess, I'll suggest a better one." | Record, never redesign. Their process is usually a live argument you are not part of. |
| "Their ICP is vague, I'll tighten it." | Write it in their words. Another skill turns it into checkable filters without changing what they meant. |
| "I'll skip the approval question." | Then the first message goes out over someone's head, and the skills get banned rather than fixed. |
| "I'll note the tools I expect them to have." | Name only what is actually connected. An assumed tool becomes an assumed capability two skills later. |
| "I'll save the profile in the repo." | Most of this team has no repo. Put it where their connectors can reach it and where they asked. |
| "One tool per category is enough." | Notes in one place and logging in another is the normal state. Record both. |

## Red Flags

- A question asked that a connected tool could have answered.
- Stage names, list names or tool names that appear nowhere in their systems.
- No Unknown section, in a setup where something was clearly not established.
- A recommendation about how the process should change.
- The profile saved to a location the user did not pick.
- Regions left unrecorded, so nobody downstream knows which rules apply.
- Their ICP rewritten into better language.

## Verification

- [ ] Connected tools were inspected before any question was asked
- [ ] Every tool named in the profile is one you actually saw, or is marked not connected
- [ ] Pipeline and stage names came from the CRM, not from convention
- [ ] Ownership, suppression and approval rules are recorded
- [ ] Recipient regions are recorded, so compliance rules are known downstream
- [ ] The ICP is in the team's own words, unedited
- [ ] Where voice samples live is recorded
- [ ] Everything unestablished sits under Unknown, named
- [ ] The profile is saved where the user chose, and they were told where
- [ ] No suggestion was made about changing their process
