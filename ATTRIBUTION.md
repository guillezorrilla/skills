# Influences

Every skill here is original prose. Nothing in `skills/` is a copy, and nothing carries a
licence obligation to anyone else — but the ideas came from reading widely, and pretending
otherwise would be dishonest.

The repo started as vendored skills with attribution footers and has since been rewritten
from scratch, one skill at a time. This file records where the thinking came from.

## Sources read

- **[mattpocock/skills](https://github.com/mattpocock/skills)** (MIT) — the first version of
  this repo vendored eight of these directly. Ideas that survived the rewrite: the design
  tree and *frontier* for ordering questions in `grilling`; the deep-module vocabulary and
  the deletion test in `codebase-design`; the seam-agreement rule and the tautological-test
  anti-pattern in `tdd`; the feedback-loop-first discipline in `diagnosing-bugs`; the
  explore → present → confirm → write shape of `setup-team-conventions`; and the
  three-tests-for-an-ADR in `domain-modeling`.
- **[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)** (MIT) — the skill
  **anatomy** this repo now follows: Overview, When to Use, Process, Common Rationalizations,
  Red Flags, Verification. Rationalizations and Red Flags are the load-bearing idea and the
  single biggest improvement to every skill here. Also: DAMP-over-DRY in tests, the
  prove-it-first pattern for bug fixes, stop-the-line, error output as untrusted data, the
  context hierarchy, and the five-axis review.
  `interview-me` specifically contributed the confidence number, the guess attached to every
  question, the want-versus-should-want probe, and the predict-the-next-three stop test.
- **[BuilderIO/skills](https://github.com/BuilderIO/skills)** (MIT) — the shape of
  `efficient-fable`: where-the-orchestrator-shines, delegation pattern, handoff packets,
  vetting delegated work, claims. Also the convention of a README beside each skill.
- **Published ideas, credited where used** — deep modules (Ousterhout), seams (Feathers),
  Chesterton's fence, and the verification-is-the-bottleneck argument (Osmani).

## What is not from anywhere

The parts that came out of using these day to day: verify a finding before reporting it;
reproduce with the reporter's exact steps and be willing to say "no bug"; run the probe
yourself rather than asking someone to open DevTools; declared path ownership so parallel
writers cannot clobber each other; committed is not deployed; codex is a separate bill, not a
smarter brain; facts are looked up, never asked for; and evidence with exit codes before any
claim of done.
