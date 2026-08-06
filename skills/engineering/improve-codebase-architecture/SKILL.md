---
name: improve-codebase-architecture
description: "Surveys a codebase for modules worth deepening, presents them ranked with before/after sketches, then grills through whichever one you pick. Proposes only, never rewrites working systems."
disable-model-invocation: true
---

# Improve Codebase Architecture

## Overview

Finds architectural friction and proposes fixes for it: shallow modules whose interfaces cost more than they hide, seams in the wrong place, code that cannot be tested through the boundary it presents.

**This skill proposes. It does not rewrite.** The output is a ranked set of candidates and a design session on the one you choose, never a refactor you did not ask for.

## When to Use

- Work in an area keeps being harder than it should be.
- Something is untestable through its current interface and you suspect the shape.
- Before starting a large feature in a subsystem, to decide whether to build on it or fix it first.
- A bug post-mortem concluded the architecture prevented the bug being pinned.

**Not for:** reducing complexity in code that works and is not being changed (`code-simplification`), designing one module's interface (`codebase-design`), or as a warm-up before real work, a survey nobody asked for is a survey nobody reads.

## Vocabulary

Use `codebase-design`'s terms exactly, module, interface, depth, seam, adapter, leverage, locality, and its tests: the deletion test, the interface is the test surface, one adapter is a hypothetical seam. Drifting into "component", "service" or "boundary" makes every candidate vaguer than it needs to be.

Where the project has a glossary, use its domain words. "The Order intake module", not "the OrderHandler".

## What counts as a candidate

Prefer the **systemic** fix over the bolt-on. A change that removes a category of problem beats one handling today's instances:

- A mapping table or `if` chain that grows by one entry per case, the good version derives the answer. If a new case means editing the list, the list is the bug.
- A special case bolted beside the general path, the good version makes the general path cover it.
- A wrapper adapting around a design rather than changing it. One adapter is hypothetical, two is real, three means the design should have moved.
- A module extracted purely for testability, where the real bugs live in how it is called. Pure functions with no locality do not pay back.
- Understanding one concept requiring a tour of six files.

Say so when the honest answer is that the design is wrong, rather than proposing a tidier workaround around it.

## What is not a candidate

**A module that is shallow but stable, understood, and off the change path.** However badly it scores, deepening it spends real risk to buy nothing. Weight recent churn heavily, deepening pays off through future changes, so a module nobody touches has no payoff to discount.

Say it out loud when a candidate is plausible but the code is working, so the user can decline it cheaply.

Anything an existing ADR settled is also out, unless the friction is now real enough to justify reopening it. Then mark it as contradicting that ADR, and say why it is worth revisiting. Do not list every refactor an ADR forbids.

## The Process

### 1. Scope before you scan

Decide where to look before looking.

- If the user named a direction, a module, a subsystem, a pain point, take it and skip the inference.
- Otherwise let the commit history choose: walk back a good stretch and find the hot spots, the files and areas that keep coming up. Those paths get attention first. If churn is evenly scattered with no hot spot, widen the net and say the survey is unfocused.

Read the glossary and any ADRs covering the area before forming opinions.

### 2. Explore in parallel

Dispatch read-only explorers across the candidate areas, **all in one message, not in staged waves**, and take back their findings rather than their file contents. Use plain subagents so each stays visible and individually interruptible.

Do not follow a rigid checklist. Note where *you* experience friction: what you had to re-read, what you could not predict, what you could not test without reaching inside.

Apply the deletion test to anything that looks shallow: would deleting it concentrate complexity, or merely move it? "Concentrates" is the signal.

### 3. Present candidates as a visual report

Architecture is shapes, and shapes do not survive being described in prose. Build a report.

**Where it goes**: in order of preference:

1. **Publish it as an artifact** if the harness has that capability, a shareable link, rendered anywhere, no local file to manage, and it can be sent to whoever else needs to weigh in.
2. **A self-contained HTML file in the OS temp directory** otherwise. Resolve the temp dir from `$TMPDIR` (`%TEMP%` on Windows), name it `architecture-review-<timestamp>.html` so each run is fresh, open it (`open` / `xdg-open` / `start`), and tell the user the absolute path. Never write it into the repo.

**Self-contained means self-contained.** Inline the CSS and any script; embed images as data URIs. Do not load Tailwind, Mermaid, or fonts from a CDN, a published artifact runs under a strict content-security policy that blocks every external host, so a CDN-linked report renders blank. Artifacts do render Mermaid natively from a fenced ```mermaid block or a `<pre class="mermaid">`, so use that rather than shipping the library.

Make it readable in light and dark, since you do not know which the reader is using.

**One card per candidate:**

| Field | Holds |
| --- | --- |
| Strength | `Strong` · `Worth exploring` · `Speculative`, as a visible badge |
| Files | the modules involved |
| Friction | what is costing time now, concretely, not "this is coupled" |
| Proposal | what would change, in plain language |
| Payback | the leverage and locality bought, and how testing improves |
| Risk | what could go wrong, plus how much churn this area actually sees |
| Before / after | a diagram, side by side |

The before/after diagram is the point of using HTML at all. Draw the shallowness and draw the deepening, a graph where the relationships are graph-shaped, hand-built markup where something more editorial communicates better (mass, layering, a collapse). A card with no diagram may as well have been a bullet.

End the report with a **top recommendation** and why. Then ask, in the conversation, which one to explore, do not make them reply inside the document.

**Propose nothing about interfaces yet.** That comes next, with the user in the room.

### 4. Grill the chosen one

Run `grilling` on the candidate they pick: constraints, dependencies, where the seam goes, what sits behind it, which tests survive, what gets deleted.

For an interface that matters, use `codebase-design`'s design-it-twice: two or three genuinely different designs explored in parallel, compared on depth, locality and seam placement.

Capture what the session settles as it lands, via `domain-modeling`, a new name for a deepened module goes in the glossary, and a candidate rejected for a load-bearing reason gets an offered ADR so future surveys stop re-suggesting it.

### 5. Stop

The deliverable is a chosen, designed candidate, not an implemented one. Hand off to `planning-and-task-breakdown` and `implement` if the user wants it built now.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The top candidate is obviously right, I'll start it." | The user picks. Starting unasked converts a proposal into a refactor nobody approved. |
| "This module scores badly, so it needs fixing." | Scoring badly and being worth fixing are different. No churn means no payback. |
| "I'll describe the candidates in prose, it's faster." | Architecture is shapes, and prose loses them. The before/after diagram is why the report exists. |
| "I'll survey the whole codebase to be thorough." | An unfocused survey produces a list nobody acts on. Let churn choose the scope. |
| "An ADR forbids this, so I won't mention it." | Mention it when the friction is now real, marked as contradicting the ADR. That is how ADRs get revisited. |
| "I'll propose the interface at the same time as the candidate." | Then the user is choosing between designs before choosing a problem. Separate the two. |
| "I'll wrap it rather than change it, less risky." | Three wrappers deep is not less risky, it is the same risk plus indirection. |
| "This is a small refactor, I'll fold it into the current work." | Then the diff mixes a structural change with a functional one and neither can be reviewed. |

## Red Flags

- Editing implementation files during the survey.
- Starting the top candidate without being asked.
- A candidate in code with no recent churn, presented without that caveat.
- A report that loads anything from a CDN, under an artifact's CSP it renders blank.
- A candidate card with no before/after diagram.
- The report written into the repo rather than to temp or a published artifact.
- Recommendations using "component", "service" or "boundary" instead of the precise terms.
- Proposing interfaces before the user has chosen a candidate.
- A candidate list with no risk or churn assessment.
- Contradicting an ADR silently.
- Only one design considered for a seam that is expensive to move.

## Verification

- [ ] Scope came from the user's direction or from commit churn, and is stated
- [ ] The glossary and any relevant ADRs were read before forming candidates
- [ ] Exploration was dispatched in one message, read-only, findings returned rather than file contents
- [ ] The deletion test was applied to everything suspected of being shallow
- [ ] Candidates are ranked in a visual report, published as an artifact, or self-contained HTML in the temp directory
- [ ] The report loads nothing externally, and reads in both light and dark
- [ ] Every structural candidate carries a before/after diagram
- [ ] Any candidate in stable, low-churn code is flagged as such
- [ ] Anything contradicting an ADR is marked, with a reason to reopen
- [ ] No interface was proposed before the user chose a candidate
- [ ] No implementation file was modified
- [ ] Terms and decisions settled in the session were captured as they landed
