---
name: domain-modeling
description: Keeps a project's shared vocabulary and its recorded decisions current, pinning terms in a glossary and writing an ADR when a decision is hard to reverse, surprising, and the result of a real trade-off. Use when terminology is ambiguous or used two ways, when a decision worth remembering has just been made, or when another skill needs the glossary or ADRs maintained as it works.
---

# Domain Modeling

## Overview

Two documents do most of the work of keeping a codebase comprehensible: one that says what the words mean, and one that says why things are the way they are.

Both fail the same way, written once at the start, never updated, and eventually so wrong that people stop reading them. Which is worse than never having written them, because a stale glossary is confidently misleading.

So the discipline is not "write documentation". It is capturing a term or a decision **at the moment it is settled**, and only when it will actually be needed later.

## When to Use

- The same word is being used for two things, or two words for one thing.
- A term got pinned down in conversation and will be used in code and tests.
- A decision was just made that a future reader would find surprising.
- Someone is about to re-litigate something already settled.
- Another skill is working and needs terms or decisions recorded as it goes, `grill-with-docs` does exactly this.

**Not for:** documenting how code works (the code and its tests do that), API reference material, or recording every decision made. Most decisions do not earn a file.

## The glossary

One term per entry, defined as it is used **in this project**, not as the industry uses it. The value is precision about local meaning, especially where local meaning differs from the obvious one.

```
Order        A confirmed intent to purchase. Becomes an Order only after payment
            authorises; before that it is a Cart. Never used for the line items.
Fulfilment  Physically getting goods to a customer. Does not include returns.
```

Two things make an entry worth writing: it distinguishes the term from something it gets confused with, and it says what the term is *not*. An entry that restates the obvious meaning is noise.

Write it when the term is agreed, in the same session. Create the file lazily, the first term that needs pinning is when it comes into existence, not before.

**When a term sharpens mid-conversation, update the entry there and then.** A glossary that lags the conversation it came from is already wrong.

## ADRs: the three tests

Offer an ADR only when **all three** hold:

1. **Hard to reverse.** Changing your mind later has real cost. If it is cheap to undo, you will simply undo it and the record was never needed.
2. **Surprising without context.** A future reader looking at the code will ask "why on earth did they do it this way?" If nobody would wonder, nobody needs the answer.
3. **The result of a real trade-off.** There were genuine alternatives and one was chosen for specific reasons. "We did the obvious thing" records nothing.

**Offer, do not assume.** *"Want this recorded so it doesn't get re-litigated?"* An ADR the user did not want is a file that has to be maintained forever.

### What qualifies

- **Architectural shape**: monorepo, event-sourced write model, projected reads.
- **Integration patterns**: two subsystems communicate by events rather than synchronous calls.
- **Technology choices carrying lock-in**: the database, the message bus, the auth provider. Not every library; the ones that would take a quarter to swap.
- **Boundary and ownership decisions**: who owns which data, and that others reference it by ID only. The explicit *nos* are as valuable as the yeses.
- **Deliberate deviations from the obvious path**: hand-written SQL instead of an ORM, and why. These stop the next engineer "fixing" something intentional.
- **Constraints invisible in the code**: a compliance rule, a partner's latency requirement.
- **A rejected alternative, when the rejection is non-obvious**: otherwise the same suggestion returns in six months.

### Format

`docs/adr/NNNN-slug.md`, numbered sequentially, scan the directory for the highest number and increment. Create the directory lazily, with the first ADR.

```md
# Short title of the decision

One to three sentences: the context, what was decided, and why.
```

That is genuinely it. An ADR can be one paragraph. The value is recording *that* a decision was made and *why*, not filling in sections.

Add more only when it earns its place: a status line when decisions get revisited, considered options when the rejected ones are worth remembering, consequences when a downstream effect is non-obvious.

## Recording a rejection

The most valuable ADR is often the one for something you decided *not* to do. Someone proposed it, there was a real reason not to, and without a record the same proposal returns.

Only record the reason if a future reader would need it. "Not worth it right now" is ephemeral and does not earn a file; "rejected because our event ordering guarantees do not survive it" does.

## Keeping both alive

- Update in the same session the change happens. Not at the end, not next week.
- When code contradicts the glossary, one of them is wrong, find out which, and fix that one. Do not leave both standing.
- Never let the glossary and the code use different words for the same concept. If the code renamed something, the glossary follows, and so do the tests.
- Do not restate an ADR's content anywhere else. Link it. Two copies means one is stale and you will not know which.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll write this all up at the end." | Reconstructed reasoning loses the part that mattered: why the alternative lost. |
| "This decision is worth recording." | Run the three tests. Hard to reverse, surprising, and a real trade-off, all three, or skip it. |
| "I'll record everything, storage is cheap." | Attention is not. A directory of trivial ADRs is one nobody reads, including the important entries. |
| "The term is obvious." | Then it needs no entry. If it is being used two ways, it was not obvious. |
| "The glossary says X but the code does Y, I'll follow the code." | Fine, but then say the glossary is wrong and fix it. Silently diverging is how it dies. |
| "I'll copy the decision into the plan too, for visibility." | Now there are two, and the copy goes stale. Link it. |
| "I'll write the ADR without asking." | It is a file the user maintains forever. Offer it. |
| "The industry defines this term as X." | Define it as this project uses it. Local meaning is the whole point. |

## Red Flags

- A glossary entry restating the industry definition with nothing local in it.
- An ADR for something reversible in an afternoon.
- An ADR with no alternative mentioned, for a decision that supposedly involved a trade-off.
- Sequential numbering with gaps or duplicates, the directory was not scanned.
- A decision recorded in the conversation only, with work now depending on it.
- Glossary and code using different names for one concept.
- An ADR's content duplicated into a plan, spec, or README.
- A file written without offering it first.
- A term sharpened in conversation and the entry left as it was.

## Verification

- [ ] Every term recorded says what it is *not*, or what it is distinguished from
- [ ] Terms were written when agreed, in the same session
- [ ] Every ADR passes all three tests: hard to reverse, surprising, a real trade-off
- [ ] Each ADR was offered, not assumed
- [ ] ADR numbering is sequential with no gaps, from scanning the directory
- [ ] Files were created lazily, no empty `docs/adr/` or stub glossary
- [ ] Where code and glossary disagreed, one was corrected rather than both left standing
- [ ] Nothing recorded here is duplicated elsewhere; other documents link to it
