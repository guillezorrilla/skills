---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

**First, read `docs/agents/` if it exists** — `conventions.md` for the default branch, branch naming and commit format, `verify.md` for the commands that define done, `review.md` for who approves, `forge.md` for whether this team says "pull request" or "merge request". Those files are the team's answer and override the defaults below. If the directory is absent, run `/setup-team-conventions` or fall back to the defaults here and say which you did.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

## Scope

Build what the spec says and stop. No features beyond the ask, no abstractions for single-use code, no "flexibility" nobody requested. If you notice unrelated problems, list them at the end — do not fix them in this change. Every changed line should trace to something in the spec.

If part of the spec turns out to be blocked or wrong, finish everything else in full and say plainly what you left out and why. Scaling the work down is the user's call, not yours.

## Verification before claiming done

"Done" is a claim about evidence, not a feeling. Before saying it:

- Run the check and **paste the command and its result**. Exit codes, not adjectives.
- If tests fail, say so with the output. A partial pass is a failure until stated otherwise.
- If you skipped a step, say which one.
- If the work only matters once running somewhere — a deployed site, an installed app, a shipped bundle — then committed is **not** done. Verify against the running artifact or say explicitly that you only verified locally.

## Git

Work on a branch. Never commit to or push the default branch — check `docs/agents/conventions.md` for which branch that is, because it is often `develop` or `trunk` rather than `main`, and assuming wrong is how work lands in the wrong place. Match the team's observed branch naming and commit format rather than your own preference; if their commits carry a ticket key, yours must too or their CI may reject it.

**Do not commit, push, or open pull requests.** The user runs those themselves. When implementation is complete, leave the working tree in a reviewable state and summarise what changed — they will take it from there. If they explicitly ask you to commit, do it, and add no co-author or tool-attribution trailers.

## Review

Ask the user to review the diff — human review is the safety system, not a formality. Keep any review notes you write short and blunt: three to five lines, the problem and the fix, no preamble and no multi-paragraph essays.

For infrastructure or deployment work, prefer changes that are additive and fail-safe: new behaviour behind new paths, old behaviour untouched, rolled out in stages you can verify one at a time.

---

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) 2026 Matt Pocock), adapted. See [ATTRIBUTION.md](../../../ATTRIBUTION.md).
