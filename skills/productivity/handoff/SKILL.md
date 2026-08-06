---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS - not the current workspace.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

## Separate what you verified from what you assumed

The failure mode of a handoff is confident prose the next agent inherits as fact. Split the document explicitly:

- **Verified** — with the command and its result. `npm test → 41 passed`. `curl … → 200`. Facts with evidence attached.
- **Assumed / unverified** — believed but never run. Say so. This is the section that saves the next session hours.
- **Left out on purpose** — scope that was deliberately not done, and why. Otherwise the next agent re-litigates a decision that was already made, or worse, "finishes" work the user chose to drop.
- **Blocked** — what stopped, what it is waiting on, who can unblock it.

If something was committed but not deployed, or fixed locally but not confirmed on the running artifact, that belongs under **assumed**, not under done.

Keep it short and blunt. A handoff is a working note, not a report — no preamble, no summary of the summary. If the next agent has to read three paragraphs to find the one command they need, the document has failed.

---

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) 2026 Matt Pocock), adapted. See [ATTRIBUTION.md](../../../ATTRIBUTION.md).
