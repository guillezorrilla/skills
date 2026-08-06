---
name: handoff
description: "Compacts the current session into a handoff document another agent or person can pick up, separating what was verified from what was only assumed."
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Handoff

## Overview

A handoff fails in one specific way: confident prose the next reader inherits as fact. They act on an assumption you never labelled as one, and discover it was wrong three hours later, having also redone work you had already finished.

So the document's job is not to summarise the conversation. It is to separate what is *known* from what is *believed*, and to say what was deliberately not done.

## When to Use

- A session is ending with work unfinished, and someone (you tomorrow, another agent, a colleague) will pick it up.
- Context is about to be lost: a compaction, a switch to unrelated work, the end of a day.
- Handing a task to a different agent or harness that has none of this conversation.
- The user asks for a handoff, a summary to continue from, or a status write-up.

**Not for:** finished work, where the commit, PR and tests are the record; a status update for someone who will not continue the work (write them a message instead); or as a substitute for writing decisions into the plan or ADRs where they belong permanently.

## Where it goes

The OS temp directory, not the workspace. A handoff is scaffolding rather than a deliverable, and it should not appear in someone's diff. If the user wants it to persist for a multi-session project, they will say so; then put it where the project keeps docs.

Where there is no filesystem to write to, produce it as a downloadable file if you can make one, and otherwise in the reply itself. Either way the four sections below are the point; the file is just the container.

If arguments were passed, treat them as what the next session will focus on and tailor the document to that. A handoff for "finish the migration" and one for "review what I did" contain different things.

## The four sections

**Verified**: with the command and its result. `pnpm test → 41 passed`. `curl … → 200`. `nx build core → exit 0`. Facts with evidence attached, so the next reader does not re-run them out of doubt.

Where there are no commands to run, name the observable you actually checked: "row 42 of the export reads *Total: 1,240*", not "the numbers look right". Same standard, different evidence.

**Assumed**: believed, never checked. This is the section that saves the next session hours, and the one most often omitted because writing it feels like admitting weakness. It is the opposite: an unlabelled assumption is the failure mode.

Anything committed but not deployed, or fixed locally but unconfirmed on the running artefact, belongs here, not under verified.

**Left out on purpose**: scope deliberately not done, and why. Without this, the next agent either re-litigates a settled decision or "finishes" work the user chose to drop.

**Blocked**: what stopped, what it is waiting on, and who can unblock it.

## What not to include

Do not restate what already exists somewhere durable. Specs, plans, ADRs, issues, commits and diffs are all better sources than your summary of them. Reference them by path or URL.

If `docs/agents/tracker.md` and `docs/agents/forge.md` exist, use them to build real links: the ticket base URL and repo slug are recorded there, so the next reader gets a URL they can open rather than a bare key.

**Redact secrets.** API keys, tokens, passwords, personal data. A handoff lands in a temp file and gets pasted into other sessions; treat it as something that will be read by more people than you intended.

## Style

Short and blunt. A working note, not a report. No preamble, no summary of the summary, no narration of how the session went.

If the next reader has to get through three paragraphs to find the one command they need, the document failed. Put the commands where they can be copied.

End with a **suggested skills** line, which skills the next session should reach for, given what is left.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It'll be obvious from the transcript." | They will not have the transcript, and if they do, reading it costs more than you writing four sections. |
| "I'm fairly sure that part works." | Then it is assumed, not verified. Put it in the right section and the next reader knows what to check. |
| "I'll just summarise everything chronologically." | Chronology is how it happened, not what is true now. The reader needs current state. |
| "The commit message covers it." | A commit says what changed, not what remains unverified or was deliberately skipped. |
| "I'll leave out the stuff I didn't finish." | That is the most valuable section. Silence reads as "everything was attempted". |
| "I'll copy the plan in so it's all in one place." | Now there are two copies and the handoff is the stale one. Link it. |
| "It's a short session, no handoff needed." | Then it is four short sections. Length scales with the work. |
| "I'll save it in the repo so it isn't lost." | It appears in someone's diff as an artefact nobody asked for. Temp directory unless asked. |

## Red Flags

- No separation between what was verified and what was assumed.
- A claim of success with no command or exit code beside it.
- No "left out on purpose" section, in a session where scope was cut.
- Work described as done that was only done locally, in a project that deploys.
- The document restating a spec or plan instead of linking it.
- Secrets, tokens, or personal data in the text.
- Saved into the workspace without being asked.
- Longer than the work it describes.

## Verification

- [ ] Verified items each carry the command and its result, or the observable actually checked
- [ ] Assumed items are explicitly labelled as unverified
- [ ] Anything committed-but-not-deployed sits under assumed, not verified
- [ ] Scope deliberately dropped is listed, with the reason
- [ ] Blockers name what they wait on and who can clear them
- [ ] Existing artefacts are linked, not restated
- [ ] Secrets and personal data are redacted
- [ ] Written to the OS temp directory unless the user asked otherwise
- [ ] Ends with the skills the next session should use
