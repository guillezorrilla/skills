---
name: tdd
description: Drives implementation from tests written first, at seams agreed before any test exists — one failing test, the smallest code that passes it, repeat. Use when building a feature or fixing a bug test-first, when a bug needs a test that reproduces it before the fix, or when the user mentions red-green-refactor or asks for tests.
---

# TDD

## Overview

TDD is not "write tests as well". It is letting a failing test decide what to build next, one slice at a time, so the code that exists is the code some test demanded.

The discipline earns its keep in two places. It stops you building things nothing needed, because nothing failed without them. And it produces tests that can actually fail, which is the only kind worth having — a test you never watched go red is a guess that it works.

## When to Use

- Building a feature whose behaviour can be stated before it exists.
- Fixing a bug: the test that reproduces it comes before the fix.
- Changing behaviour in code that already has tests at the right seam.
- Someone says red-green-refactor, or asks for tests alongside the work.

**Not for:**

- Exploratory work where you do not yet know what the interface should be. Prototype first, throw it away, then TDD the real thing.
- Code with no stable seam to test at. Find the seam first — `codebase-design` has the vocabulary.
- Pure configuration, generated files, or a one-line change to a constant.
- Chasing coverage. Coverage is a byproduct here, never the goal.

## Learn the stack before writing a test

Find out how this project runs tests before you write one:

- The runner and its config — and whether unit and integration tests run differently.
- How to run **one file**, and one test within it. You will do this dozens of times; needing the full suite each cycle kills the loop.
- What CI runs, since that is the authority on green. If the project records its commands (`docs/agents/verify.md`), use those.
- Where tests live and what they are named, so yours goes where people look for it.

A test written for the wrong runner or in the wrong directory is invisible, which is worse than absent — the suite passes and nobody knows the behaviour is unpinned.

## Agree the seam first

A **seam** is the public boundary you observe behaviour through, without reaching inside. Tests live at seams. Never at internals.

**Write down which seams are under test and confirm them before writing a test.** You cannot test everything, and the choice of where to test is the choice of what the tests will protect. Made silently, it defaults to whatever was easiest to reach — usually a private function, which pins the implementation instead of the behaviour.

Ask: what is the public interface here, and which seams should we hold?

## The Cycle

### Red — one failing test

Write one test for one behaviour, at an agreed seam. Run it. **Watch it fail, and read the failure.**

The failure message is data. It should fail because the behaviour is missing, not because of a typo, a bad import, or a fixture that never loaded. A test that fails for the wrong reason will pass for the wrong reason too.

A test you never saw fail is not a test. It is an assumption with syntax.

### Green — the smallest thing that passes

Write only enough code to pass this test. No anticipation of the next test, no speculative parameters, no error handling for a case no test describes.

Run it. **Watch it pass**, and confirm the other tests still do.

If passing this test needed more code than the test justifies, the test was too big. Split it.

### Refactor — separate step, still green

Now improve the shape, with the tests as your net. Rename, extract, collapse duplication. Run the tests after each change.

Refactoring is not part of red-green. Doing it while a test is red means you cannot tell which change broke what.

### One slice at a time

One seam, one test, one minimal implementation, then repeat.

Do not write all the tests and then all the code. Bulk-written tests verify *imagined* behaviour: they pin the shape you guessed rather than the behaviour that emerges, they go insensitive to real change, and they commit you to a test structure before you understand the implementation. Each test is a tracer bullet — it should respond to what the last cycle taught you.

## Bug fixes: prove it first

A bug fix has a stricter version of the cycle, and skipping it is how the same bug ships twice.

1. Write a test that fails **because of the bug**. Same inputs, same conditions as the report.
2. Run it. Watch it fail. This is the proof you have reproduced the bug and not something adjacent.
3. Fix the code.
4. Watch the test pass.
5. Run the original reproduction from the report, not just your test.

If you cannot write a failing test, you have not localised the bug — go back to `diagnosing-bugs`. "Fixed but untestable" usually means "changed something and the symptom moved".

**If there is no correct seam for the regression test, that is itself the finding.** A test at too shallow a seam gives false confidence: it passes while the real bug pattern — the one involving several callers, or the chain that triggered it — remains reachable. Say the architecture is preventing the bug from being pinned, rather than writing the test that cannot catch it.

## What a good test looks like

**Test state, not interactions.** Assert on the result, not on which collaborator got called. A test that verifies call order breaks on every refactor while behaviour is unchanged, which teaches everyone to stop trusting the suite.

**Real implementations over mocks.** Use the real thing wherever it is fast and deterministic — an in-memory store, a temp directory, a local fixture. Mock at the edge of your control: the network, the clock, the payment provider. Every mock is an assumption that the real thing behaves as you imagined.

**DAMP over DRY.** Tests optimise for being read during a failure at 3am, not for having no duplication. A little repetition beats a helper that hides what is being set up. If understanding a failing test needs you to go and read three fixture functions, the test has concealed the thing it was proving.

**Arrange, act, assert** — visibly, in that order, with the act as one line. If the act needs five lines, the interface is telling you something.

**One concept per test.** Several assertions about the same behaviour are fine. Assertions about three unrelated behaviours are three tests, and you want to know which one broke from the name alone.

**Name it as a specification.** `rejects checkout when the cart is empty` tells you what capability exists and what broke. `test_checkout_2` tells you to go and read the body.

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, reaches private methods, or asserts through a side channel like querying the database instead of using the interface. The tell: refactoring breaks it while behaviour is unchanged.
- **Tautological** — the expected value is recomputed the way the code computes it (`expect(add(a,b)).toBe(a+b)`, a snapshot derived by hand from the same logic). It passes by construction and can never disagree with the code. Expected values come from an independent source: a worked example, a known-good literal, the spec.
- **Assertion-free** — the test runs the code and asserts nothing, or asserts only that nothing threw. It passes for any behaviour.
- **Testing the framework** — verifying that the ORM saves or the router routes. Not your behaviour, not your test.
- **The retry** — a test wrapped in retries to stop it flaking. The flake is a finding; the retry hides it.

## Report the loop honestly

Paste the command and its output. "Tests pass" is not a report; the invocation with `12 passed, 0 failed` under it is.

If some tests fail, say so with the output rather than summarising around it. A partial pass is a failure until you say which part.

**Judge tests by running them, not by type-checking them.** Many projects deliberately exclude test files from their type-check config, so a clean typecheck says nothing about whether tests pass, and type errors reported inside test files may be an artefact of that config rather than a real defect. Run the tests. That is the signal.

**Fix the failures your change caused.** Pre-existing failures elsewhere are a finding to report, not work to absorb into this change.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll write the tests after, it's faster." | Then the tests describe what you built rather than what was needed, and you never see them fail. Both properties are the point. |
| "I know this test will fail." | Then run it and watch. Tests that fail for the wrong reason pass for the wrong reason. |
| "It's a small change, no test needed." | If behaviour changed, something should have gone red. If nothing could have, the behaviour was never pinned. |
| "I'll write all the tests first, then implement." | Bulk tests pin an imagined shape. One slice at a time, so each test learns from the last. |
| "I'll mock it, it's simpler." | Every mock encodes a guess about the real thing. Mock at the edge of your control, use the real thing inside it. |
| "I'll extract a helper so the tests aren't repetitive." | Tests are read during failures. A helper that hides the setup hides the evidence. |
| "The typecheck is clean so the tests are fine." | Many projects exclude tests from typecheck entirely. Run them. |
| "This test is flaky, I'll add a retry." | The flake is information about your system. Retries delete the information and keep the bug. |
| "I can't write a failing test but I know the fix." | Then you have not localised it. A fix you cannot pin is a change whose effect you are guessing at. |
| "Coverage went up, so the tests are good." | Coverage measures execution, not assertion. A test with no meaningful assert raises coverage and protects nothing. |

## Red Flags

- A test committed that was never observed failing.
- A test file edited during a refactor step.
- All the tests written before any implementation.
- Assertions on which functions were called rather than what came out.
- The expected value computed the same way the implementation computes it.
- A mock standing in for something fast, local and deterministic.
- A test whose name does not say what behaviour it protects.
- A retry, `sleep`, or timeout added to stabilise a test.
- "Tests pass" with no command output.
- A bug fixed with no test that fails without the fix.
- Absorbing unrelated pre-existing failures into this change.

## Verification

- [ ] The seams under test were written down and confirmed before the first test
- [ ] Every test was observed failing before the code that passes it existed
- [ ] Each failure was read, and failed for the intended reason
- [ ] Implementation was the minimum the test demanded — no speculative code
- [ ] Refactoring happened as a separate step, with tests green throughout
- [ ] For a bug fix: a test failed *because of the bug*, and the report's original reproduction was re-run after the fix
- [ ] Where no correct seam existed for a regression test, that was stated rather than worked around
- [ ] Assertions are on state, with real implementations used wherever fast and deterministic
- [ ] Test names read as specifications
- [ ] The final report pastes the command and its actual output
- [ ] Pre-existing unrelated failures were reported, not absorbed
