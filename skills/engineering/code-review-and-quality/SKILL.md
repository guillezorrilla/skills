---
name: code-review-and-quality
description: Reviews a change across correctness, clarity, design, security and performance, verifying each finding before reporting it and writing comments short enough to act on. Use before merging, after finishing an implementation, when evaluating code another agent or person wrote, or when asked to review a branch, diff or pull request.
---

# Code Review and Quality

## Overview

Review has two failure modes and they pull in opposite directions. One is waving through a change nobody understood. The other is a wall of findings, half of which are wrong and none of which are ranked, which costs the author more time than writing the code did.

The job is to find the things that will actually hurt, confirm they are real, and say them in a form somebody can act on in one read.

**The approval bar is "does this improve the codebase", not "is this how I would have written it".** Perfect code does not exist. A change that improves health and follows local convention gets approved, with nits marked as nits.

## When to Use

- Before merging any change, yours or anyone's.
- After finishing an implementation, before asking a human to look.
- When evaluating code another agent produced, especially when it arrived with a confident summary.
- After a bug fix, to review the fix **and** the regression test.

**Not for:**

- Hunting for complexity to delete, that is `code-simplification`.
- Reviewing an idea or a plan before code exists, that is `grilling`.
- A mechanical change with no judgement in it (a lockfile bump, a generated file).

## Verify before you report

**This comes first because it is the rule most often broken.** A plausible finding that turns out to be wrong costs more than silence: the author burns time disproving it, and every later finding you raise is discounted.

Before writing a finding down:

- **Read the actual code**: not the diff hunk in isolation. Half of "this will break" disappears once you see the guard three lines above the hunk, or the caller that makes the case impossible.
- **Name the failing input.** If you cannot say which input, state, or sequence produces the bad outcome, you have a suspicion, not a finding.
- **Check whether the tool already catches it.** If the type checker, linter, or test suite would fail on it, run them and cite the output instead of describing the problem.
- **When the behaviour turns out correct, say so and drop it.** Do not soften a wrong finding into a vague "consider whether…" to avoid having been wrong. Delete it.

Findings you could not confirm are still worth raising, labelled as a question, not as a defect.

## The five axes

**Correctness.** Does it do what it claims? Spec match, edge cases (empty, null, boundary, unicode), error paths and not just the happy one, off-by-one, ordering, concurrent access. Do the tests exercise the behaviour or just the shape of it?

**Clarity.** Could a colleague follow it without the author present? Names that say what they hold, control flow you can read top to bottom, no cleverness that has to be decoded. Dead artefacts, unused variables, commented-out blocks, compatibility shims for versions nobody runs, are findings, not noise.

**Design.** Does it fit the system, or fight it?

- A new conditional bolted onto an unrelated flow is a **design smell, not a nit**. The logic wants its own function, state, or policy.
- Repeated conditionals on the same shape mean a missing model. A "temporary" branch is permanent.
- Does a refactor *reduce* complexity or *relocate* it? Count the concepts a reader must hold. If that count is unchanged, the change is movement, not improvement.
- Is feature-specific logic leaking into a shared module? Keep logic in its owning layer, and reuse the canonical helper rather than adding a near-duplicate beside it.
- A gratuitous `any`, a cast, or a silent fallback is usually papering over an invariant nobody wants to state. Making the boundary explicit normally simplifies the code around it.

**Security.** Input validated at the trust boundary. Secrets absent from code, logs and history. Authorisation checked where it matters, not just authentication. Output encoded for its destination. Errors that do not leak internals.

**Performance.** Only where it is load-bearing: a query inside a loop, an unbounded fetch, an accidental O(n²) over user-controlled input, a missing index. Do not speculate about hot paths, if you cannot point at scale or a measurement, it is not a performance finding.

## Rank: and say what you would block on

Every finding carries a severity, and you state your verdict. An unranked list makes the author guess which of twenty comments is the one that matters.

| Level | Meaning |
| --- | --- |
| **Blocking** | Wrong behaviour, data loss, a security hole, or a design choice that is expensive to undo later |
| **Should fix** | Real, worth doing now, but does not have to gate the merge |
| **Nit** | Preference. Say it once, mark it, and never repeat it |
| **Question** | You do not understand something, or could not confirm a suspicion |

If nothing is blocking, say the change is approvable, plainly. Reviewers who never approve get routed around.

## Write comments people can act on

**Three to five lines.** The problem, the failing case, the fix. No preamble, no restating the code back, no multi-paragraph essay.

```
Blocking, `parseLimit` returns NaN when the query param is absent, and NaN
silently becomes an unbounded fetch at line 88. `?limit=` on an empty table is
the case. Default to 50 before the cast.
```

That is a complete finding. What makes it complete: severity, mechanism, the specific input, and the fix. What is missing on purpose: an apology, a compliment sandwich, and an explanation of what a NaN is.

Nits get one line and a label, or they get dropped. Praise is fine when it is specific and rare, "this test name is the clearest thing in the file" lands; "great work overall!" is noise.

## The Process

1. **Get the change and its intent.** `git diff <base>...HEAD` for the code, plus the ticket, spec, or description for what it was meant to do. A review without the intent can only check style.
2. **Read the diff whole first.** Do not comment on the way through. First pass is for the shape of the change and whether it matches the intent.
3. **Run what runs.** Tests, type check, lint, build. If the project records its commands (`docs/agents/verify.md` when present), use those, they came from CI, which is the authority. Paste the results into the review. A failing suite outranks every opinion you were about to offer.
4. **Second pass per axis**, gathering candidate findings without writing them up yet.
5. **Verify each candidate** against the rules above. Drop the ones that do not survive.
6. **Rank, then write.** Blocking first, nits last, verdict at the top.
7. **Say what you did not review.** Generated files, a vendored directory, an area you lack context on. Silent partial review reads as full coverage.

## Scope

Review the change in front of you. Pre-existing problems in files the change happens to touch are not this change's job, note them separately, once, so the author can decide.

The exception is when the change makes an existing problem materially worse. Then it is in scope, and say why.

## Reviewing an agent's work

Treat the summary as a claim, not a report. Confident prose is the default output style, not evidence of correctness.

- No exit codes in the summary means the checks were not run. Run them yourself.
- Verify the cited line references exist and say what the summary claims they say.
- Check the diff against the *brief*, not against the summary. A summary describes intent; the diff is what happened.
- Look for scope creep. An agent that fixed four things when asked for one has made the change unreviewable.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll flag it as a question, so it's fine if I'm wrong." | A question you could answer by reading three more lines is homework you handed to the author. |
| "It's probably fine, I'll approve it." | Then say what you actually checked. An approval nobody verified is worse than no review, because it converts doubt into false confidence. |
| "I'd have written it differently." | Not a finding. Convention and improvement are the bar, not your taste. |
| "I'll list everything and let them triage." | Ranking is the reviewer's job. An unranked list of twenty items hides the one that matters. |
| "More findings means a more thorough review." | Precision means thorough. Volume means unread. |
| "The tests pass so the logic is fine." | Only if a test covers this path. Check what exercises it before trusting green. |
| "While I'm here I'll mention that unrelated mess." | Note it once, separately. Mixing it in makes the real findings harder to see. |
| "The summary says it works." | The summary is the thing being reviewed, not the evidence for it. |
| "This is a nit but I'll explain it thoroughly." | A nit that needs a paragraph is not a nit. Either it matters and gets ranked properly, or it gets one line. |
| "It's my own code, I know it's correct." | Reviewing your own work is where verify-before-reporting matters most, because you are checking a claim you already believe. |

## Red Flags

- A finding with no specific input, state, or sequence that triggers it.
- "Consider whether…", usually a finding the reviewer could not confirm and did not want to drop.
- A review with no verdict, so the author cannot tell whether they may merge.
- No severity labels, so everything reads as equally urgent.
- Comments longer than the code they discuss.
- Findings a linter or type checker would have produced, reported by hand and unrun.
- Approving without having run the tests, or having said you did not run them.
- A performance concern with no scale and no measurement behind it.
- Reviewing an agent's summary rather than its diff.
- Silence about what was not reviewed.

## Verification

- [ ] The intent of the change was read before the code
- [ ] Tests, type check and lint were run and the output is in the review
- [ ] Every finding names a specific failing input, state, or sequence
- [ ] Findings that did not survive checking were deleted, not softened
- [ ] Every finding has a severity, and the review has an explicit verdict
- [ ] Comments are three to five lines: problem, case, fix
- [ ] Nits are labelled as nits and said once
- [ ] Pre-existing issues are noted separately, not mixed into the change's findings
- [ ] Anything not reviewed is stated
- [ ] For agent-authored work, the diff was checked against the brief rather than the summary
