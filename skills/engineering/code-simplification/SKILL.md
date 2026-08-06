---
name: code-simplification
description: Reduces complexity in code without changing what it does, working down a ladder from "does this need to exist at all" through standard-library and platform features to the smallest thing that works. Use after a feature works and the implementation feels heavier than the problem, when review flags complexity, or when someone asks to simplify, delete, or de-bloat code. Not for code you do not yet understand.
---

# Code Simplification

## Overview

The goal is not fewer lines. It is code the next person understands faster, with less to hold in their head. Fewer lines is usually a side effect, and occasionally the wrong answer.

Behaviour is frozen. Every input produces the same output, every error path behaves the same, every side effect happens in the same order. A change that alters behaviour is not a simplification, it is a rewrite wearing a simplification's clothes, and it will be reviewed as if nothing changed, which is how simplification passes bugs into main.

## When to Use

- A feature works, tests pass, and the implementation feels heavier than the problem.
- Review flagged nesting depth, a long function, duplication, or unclear names.
- Code was written under time pressure and now has to be maintained.
- Someone asks to simplify, delete, de-bloat, or "make this less clever".

**Not for:**

- Code you do not yet understand. Comprehension first, always.
- Code that is already clear. Simplifying for its own sake is churn with regression risk.
- A hot path where the simpler form is measurably slower. Measure before believing this.
- A module you are about to replace. Do not tidy what you are deleting next week.

## The Ladder

Work down it and stop at the first rung that holds. Two rungs both work? Take the higher one and move on, this is a reflex, not a research project.

1. **Does this need to exist at all?** Speculative generality, a config for a value that never changes, an interface with one implementation, a factory for one product, error handling for an impossible state. Delete it and say so in one line.
2. **Does the standard library do it?** Use it. Hand-rolled date maths, deep-clone, group-by and debounce are the usual suspects.
3. **Does the platform do it natively?** A DB constraint over application checks, CSS over JavaScript, a native input type over a widget library.
4. **Does a dependency you already have do it?** Use that. Never add a dependency for something a few lines cover.
5. **Can it be one line?** Make it one line.
6. **Only then:** the smallest code that works.

**Deletion beats addition.** The best diff in a simplification pass is negative.

## Prefer the systemic form

Between two versions that both work, take the one that removes the category of problem rather than the one handling today's instances:

- **Derive, do not enumerate.** A mapping table or `if` chain that grows by one entry per new case is the design telling you it is wrong.
- **Extend the general path** instead of adding a special path beside it.
- **Change the design** instead of wrapping it. One adapter is a hypothetical seam, two is a real one, three means the design should have moved.

When the systemic fix is genuinely disproportionate to the problem, say so explicitly, so the shortcut is a decision on the record rather than a default nobody chose.

## Never simplify away

These are not complexity. Leaving them in is not a failure of nerve:

- Input validation at a trust boundary.
- Error handling that prevents data loss.
- Security controls and authorisation checks.
- Accessibility basics.
- Anything the user explicitly asked for. If they insist on the fuller version, build it and stop re-arguing.
- Calibration for the physical world. A real clock drifts, a real sensor reads off. Leave the tuning knob; a minimal model cannot see what the hardware does.

## The Process

### 1. Understand it first

Before removing anything, work out why it is there. If you cannot say why a line exists, you cannot say it is safe to delete.

Answer these, and use `git log`/`git blame` on the block rather than guessing:

- What is this responsible for? What calls it, and what does it call?
- What are the edge cases and error paths?
- Which tests pin the current behaviour?
- Why might it have been written this way, a performance fix, a platform quirk, a bug nobody documented?

A fence across a road with no obvious purpose usually had one. Find it, *then* decide whether it still applies.

### 2. Establish the before

Run the tests and record the result. You cannot claim behaviour is preserved without a baseline, and "the tests were passing" from memory is not a baseline.

If the code has no tests, say so before touching it. Simplifying untested code is a bet with no way to settle it, either add a test that pins current behaviour first, or tell the user the risk and let them decide.

### 3. Match the codebase: not your taste

Read the project's conventions and the neighbouring code before changing style. Match import ordering, declaration style, naming, error handling, and how deeply types are annotated.

Simplification that breaks local consistency is churn. Your preferred idiom is not simpler to the people who work here every day.

### 4. Clarity over compactness

Explicit beats dense whenever the dense version needs a second read. A nested ternary chain, a `reduce` doing three jobs, or a clever one-liner that has to be decoded is complexity that has been compressed rather than removed. Compression is not simplification.

Boring wins. Clever is what somebody debugs at 3am.

### 5. Scope to what changed

Default to the code you or the current change touched. A drive-by refactor of unrelated code makes the diff unreviewable and puts unrelated regression risk in the same commit.

Notice something worth fixing elsewhere? List it at the end. Do not fix it here.

### 6. Prove behaviour survived

Re-run the same tests, unmodified, and paste the result.

**If you had to change a test, you changed behaviour.** That is the whole signal. Either revert, or stop calling it a simplification and get the behaviour change reviewed on its own terms.

### 7. Mark the deliberate shortcuts

When you deliberately leave something simple that has a known ceiling, say so in a comment naming the ceiling and the upgrade path:

```
# global lock, switch to per-account locks if throughput matters
```

A shortcut with its limit written down is a decision. The same shortcut unmarked reads as ignorance, and the next person either "fixes" it or trusts it too far.

## Over-simplification traps

The failure mode of this skill is going too far:

- **Inlining a helper that gave a concept its name.** The call site got longer to read, not shorter.
- **Merging two simple functions** into one that does both. Two clear things beat one clever thing.
- **Removing an abstraction that existed for testability or a real second implementation.** One adapter is hypothetical; two is load-bearing.
- **Optimising for line count.** Golfing is not simplification.
- **Flattening a structure that mapped to the domain.** If the shape mirrored how people talk about the problem, the shape was doing work.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Fewer lines is simpler." | Fewer lines is fewer lines. The test is whether a new colleague understands it faster. |
| "The tests still pass, so behaviour is preserved." | Only if the tests cover the path you changed. Check what actually exercises it before believing the green. |
| "I had to adjust one test." | Then you changed behaviour. Revert, or get the behaviour change reviewed as a behaviour change. |
| "This abstraction is pointless." | It may exist for a second implementation, a test seam, or a bug you cannot see. Find out why before deleting. |
| "While I'm in here I'll tidy that too." | Now the diff mixes a safe change with a risky one and the reviewer can approve neither confidently. |
| "The clever version is obviously equivalent." | If it needs a mental pause to parse, it is not obvious, and equivalence is exactly what people get wrong under compression. |
| "I'll simplify first, then understand it." | Backwards. You cannot judge what is load-bearing from the outside. |
| "There are no tests, but I'm confident." | Confidence is not a baseline. Pin the behaviour or declare the risk. |
| "This is the standard way to write it." | Standard where? Match this codebase. External convention imposed locally is churn. |

## Red Flags

- Editing a test file during a simplification pass.
- No recorded before-state, no test run captured prior to the change.
- The diff touches files unrelated to what prompted the work.
- Deleting a branch, guard, or `catch` you have not explained the purpose of.
- Reaching for a new dependency mid-simplification.
- The result is shorter and you cannot say who finds it clearer.
- Validation, authorisation, or an accessibility attribute disappeared in a "cleanup".
- A nested ternary or a chained `reduce` appearing where an `if` used to be.
- Saying "simplified" in a commit message next to a behaviour change.

## Verification

- [ ] The purpose of every removed line can be stated, not guessed
- [ ] A before-state test run was captured and pasted
- [ ] The same tests pass afterwards, **unmodified**
- [ ] No test file was edited
- [ ] The diff is scoped to the code that prompted the work; anything else is listed, not fixed
- [ ] Validation, error handling, security and accessibility survived intact
- [ ] Style matches the surrounding code rather than personal preference
- [ ] Deliberate shortcuts carry a comment naming the ceiling and upgrade path
- [ ] You can name who reads the result faster, and why
