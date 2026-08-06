---
name: implement
description: "Builds work from a spec or tickets in small verified increments — keeping the tree green, the scope narrow, and commits in the user's hands."
disable-model-invocation: true
---

# Implement

## Overview

Implementation goes wrong in one of two ways. Either it lands as one enormous change nobody can review or revert, or it quietly grows past what was asked and the extra work becomes the reviewer's problem.

The counter to both is the same: small increments, each one verified, each one scoped to something the spec actually asked for.

## When to Use

A spec, plan, or set of tickets exists and needs building. If it does not exist yet, use `grilling` to confirm intent and `planning-and-task-breakdown` to order the work — implementing against an unconfirmed ask produces precise work in the wrong direction.

## Read the team's conventions first

If `docs/agents/` exists, read it before writing anything:

- `conventions.md` — the default branch, branch naming, commit format
- `verify.md` — the commands that define done
- `review.md` — who approves, and how many
- `forge.md` — whether this team says "pull request" or "merge request"

Those are this team's answers and they override every default below. If the directory is absent, run `setup-team-conventions` or fall back to the defaults here — and say which you did.

## Simplicity first

Before writing code, work down this ladder and stop at the first rung that holds:

1. Does this need to exist at all? Speculative need means skip it, and say so in one line.
2. Does the standard library do it?
3. Does the platform do it natively?
4. Does a dependency already present do it? Never add one for what a few lines cover.
5. Can it be one line?
6. Only then: the smallest code that works.

No abstraction with one implementation. No config for a value that never changes. No error handling for a state that cannot occur. If you wrote two hundred lines and fifty would do, rewrite it.

## Scope discipline

Build what the spec says and stop.

- No features beyond the ask, no "while I'm here" fixes, no adjacent tidying.
- Do not refactor and implement in the same change. Both become harder to review and impossible to bisect.
- Noticed something worth fixing? List it at the end. Do not fix it.

Every changed line should trace to something in the spec. If part of the spec turns out blocked or wrong, finish everything else in full and say plainly what you left out and why — scaling the work down is the user's call, not yours.

## The increment cycle

Repeat per slice:

1. **Pick the next slice** from the plan — vertical where possible, so something observable works end to end however thin.
2. **Make it work.** Smallest change that satisfies this slice.
3. **Verify it.** Run the relevant test file and the type check now, not at the end.
4. **Leave the tree green.** Every increment ends compilable with tests passing. A broken intermediate state means the next failure has two causes.
5. **Stop and look.** Is this still the slice you meant to build?

Run the full suite once at the end, not after every slice.

Do not re-run a command that already passed unless the code changed since. Repeating a green check for reassurance is not verification.

## Incomplete features stay invisible

If a feature is half-built, it must not be reachable by a user. Put it behind a flag, default it off, and say the flag exists.

Prefer changes that are additive and reversible: new behaviour behind a new path, old behaviour untouched, safe defaults when config is missing, and a rollback that does not need a migration to undo. For infrastructure work, roll out in stages you can verify one at a time.

## Verification before claiming done

"Done" is a claim about evidence, not a feeling.

- Run the check and **paste the command and its result.** Exit codes, not adjectives.
- If tests fail, say so with the output. A partial pass is a failure until you say which part.
- If you skipped a step, name it.
- **Committed is not deployed.** If the work only matters once running somewhere, verify against that artefact or state explicitly that you only verified locally.
- Pre-existing failures unrelated to your change are a finding to report, not work to absorb.

## Git

Work on a branch. **Never commit to or push the default branch** — check `conventions.md` for which branch that is, because it is often `develop` or `trunk` rather than `main`, and assuming wrong puts work in the wrong place.

Match the team's observed branch naming and commit format rather than your own preference. If their commits carry a ticket key, yours must too — some CI setups reject the ones that do not.

**Do not commit, push, or open pull requests.** The user does those. When the work is done, leave the tree reviewable and summarise what changed. If they explicitly ask you to commit, do it — and add no co-author or tool-attribution trailers.

## Review

Ask for human review; it is the safety system, not a formality. Run `code-review-and-quality` on your own diff first, so the reviewer is not finding what you could have.

Keep any review notes short and blunt: three to five lines, the problem and the fix, no preamble.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll verify it all at the end." | A bug in slice one makes slices two through five wrong. You will be debugging five slices instead of one. |
| "It's faster to do it in one pass." | Until something breaks and the cause is somewhere in 500 changed lines. |
| "These changes are too small to separate." | Small commits cost nothing. Large ones hide bugs and make a revert a negotiation. |
| "This refactor is small enough to include." | Mixed with a feature, neither can be reviewed or reverted independently. |
| "I'll add the flag later." | If it is incomplete, it should not be reachable now. |
| "The spec didn't mention it but they'll want it." | Then they can ask. Unrequested work is unreviewed work the user did not budget for. |
| "I'm confident, so I don't need to run it." | Confidence is not evidence. Paste the output. |
| "I'll re-run the build to be safe." | Nothing changed since it passed. That is reassurance, not verification. |
| "I'll commit so the work isn't lost." | The tree holds it fine. Commits are the user's; ask if you think one is needed. |
| "It works locally so it's done." | If it has to run somewhere, local is not where done is measured. |

## Red Flags

- The tree left uncompilable or with failing tests between increments.
- Files in the diff that no line of the spec asked for.
- A refactor and a feature in the same change.
- A half-built feature reachable without a flag.
- "Done" with no command output.
- A commit or push you were not asked to make.
- Work on the default branch.
- A commit message that does not match the format in the team's own history.
- Absorbing unrelated pre-existing failures into this change.
- Re-running an already-green check instead of making progress.

## Verification

- [ ] `docs/agents/` was read where present, and its conventions followed over the defaults
- [ ] Every changed line traces to something in the spec
- [ ] Each increment left the tree compilable with relevant tests passing
- [ ] The full suite ran once at the end, with output pasted
- [ ] Any incomplete feature is behind a flag defaulting to off
- [ ] Anything left out is named, with the reason
- [ ] Unrelated findings are listed, not fixed
- [ ] Work is on a branch, never the default branch
- [ ] Nothing was committed, pushed, or opened as a PR unless explicitly asked
- [ ] Where the work runs somewhere, that is where it was verified — or the local-only limit was stated
