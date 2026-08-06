---
name: context-engineering
description: Curates what an agent sees and when (rules files, specs, source, and what to drop) so output quality does not decay as a session grows. Use when starting work in an unfamiliar codebase, when an agent begins ignoring conventions or inventing APIs, when moving between unrelated parts of a project, or when setting a repo up for agent-assisted work.
---

# Context Engineering

## Overview

Context is the largest lever on output quality and the easiest one to get backwards. Too little and the agent invents APIs and ignores conventions. Too much and the signal it needs is buried among things that merely mention the same words.

The instinct to fix bad output by adding more context is usually wrong. Most degradation comes from *irrelevant* context crowding out relevant context, not from an absence of information.

## When to Use

- Starting work in a codebase the agent has not seen.
- Output is degrading: wrong patterns, invented APIs, conventions ignored, earlier decisions forgotten.
- Moving between unrelated areas of a project in one session.
- Setting a repo up so agents behave consistently across a team.
- A long session that is producing worse answers than it did an hour ago.

**Not for:** a one-shot question with a self-contained answer, or as a substitute for reading the specific file the task is about.

## The hierarchy

Order context by how long it stays true. The stable layers earn a permanent place; the volatile ones must justify every load.

| Layer | Lifetime | Holds |
| --- | --- | --- |
| Rules file (`CLAUDE.md`, `AGENTS.md`) | project-wide, always loaded | commands, conventions, boundaries, the gotchas that break the build |
| Spec / plan / ADRs | per feature | what is being built and what was already decided |
| Source files | per task | the code actually being changed, plus its direct callers |
| Tool and command output | per step | test failures, logs, diffs |
| Conversation | the session | decisions made, corrections given |

Something in the wrong layer is the common defect. A permanent rule buried in message forty is gone after compaction. A task-specific file path written into the rules file is loaded forever for everyone.

## The rules file

This is the highest-leverage document in the repo, and it should be short enough that people read it.

Include what an agent gets wrong without being told:

- **Commands**: how to install, run, test, lint, build. Exactly as the project runs them, package manager included.
- **Conventions**: naming, file layout, export style, where a given kind of code belongs.
- **Boundaries**: what not to touch, what is generated, what is vendored.
- **The traps**: the rules that are non-obvious and expensive. The build that fails only in CI. The command that must not be used. The file that must be edited in two places. These earn their space; a generic "write clean code" does not.

Two tests for every line. If an agent would do it right without being told, delete the line. If getting it wrong breaks the build in a way a typecheck will not catch, it belongs near the top.

**Codex and several other harnesses read `AGENTS.md` and never `CLAUDE.md`.** Where both are wanted, make one a pointer to the other. Never maintain two copies, the copy is always the stale one.

## Loading source deliberately

Read the file the task is about, its direct callers, and one example of the pattern being followed. That is usually enough.

Do not load a directory because it might be relevant. Breadth-first reading fills context with near-misses that make the agent's judgement worse, not better, every file that shares vocabulary but not purpose is a competing template.

When the surface genuinely is wide, **delegate the reading**. Send parallel readers after specific questions and take back their answers rather than their file contents. A summary that answers the question costs a fraction of the files that contained it, and the orchestrating context stays clear.

## Handling conflict

Sources will disagree: the rules file says one thing, the code does another; a comment describes behaviour the function no longer has; two documents specify the same field differently.

Resolve by evidence, not by hierarchy:

1. **Running behaviour** beats all descriptions of it. What the test asserts, what the command outputs.
2. **Code** beats documentation about the code.
3. **The more recent** of two documents, when both are only documents. Check the dates rather than assuming.
4. **Ask** when the conflict is a decision rather than a fact, and say which sources disagree, so the answer settles it for everyone.

Say the conflict out loud. Silently picking one and proceeding hides the fact that the repo contradicts itself, which is usually the more important finding.

## Managing a long session

Quality decays as a session grows, and the decay is gradual enough to miss. Watch for the agent re-asking something already settled, drifting from a convention it followed earlier, or describing code that no longer matches the file.

Counters, cheapest first:

- **Re-anchor.** Restate the current objective and the last few decisions in one short block. Cheaper than reloading files.
- **Drop what is spent.** A resolved error's full log, an abandoned approach's exploration, a file you no longer touch, these actively compete with what matters now.
- **Prefer artefacts over recall.** Write a decision into the plan, the spec, or an ADR. A file survives compaction; a message forty turns back does not.
- **Start fresh across a boundary.** When switching to unrelated work, a new session with the right rules file beats a long one carrying the previous task's residue. Hand over with a written note, not with the transcript.

## Setting a repo up for a team

The point is that everyone's agent behaves the same way. That means committed, not local.

- Rules file committed and reviewed like code, because it changes how everyone's agent behaves.
- Conventions recorded from what the repo actually does, read the history rather than the aspiration. What people do and what `CONTRIBUTING.md` says frequently differ, and the history is the truth.
- Verify commands taken from CI, not from the README. CI is what gates the merge.
- Unknowns recorded as unknown. A confidently wrong convention is followed; a gap gets asked about.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The output is bad, I'll add more context." | Usually the opposite. Irrelevant context crowds out relevant context. Cut before you add. |
| "I'll read the whole directory to be safe." | Every near-miss file is a competing template. Read the file, its callers, and one example of the pattern. |
| "The convention is obvious from the code." | Then an agent would have followed it. If it is being violated, it was not obvious. |
| "I'll put that decision in the chat, we'll remember." | Compaction does not care what you remember. Write it into an artefact. |
| "The rules file should cover everything." | A long rules file is skimmed by people and dilutes the lines that matter. If it changes no behaviour, cut it. |
| "The docs and the code disagree; the docs are the spec." | Running behaviour outranks descriptions of it. Believe the test, then say the docs are wrong. |
| "I'll keep one session going, it has all the context." | It has all the *residue*. Across unrelated work, a fresh session with the right rules file wins. |
| "I'll maintain CLAUDE.md and AGENTS.md separately." | One will go stale, and it will be the one being read. Make one a pointer. |
| "I'll write the conventions from what good practice says." | Write them from what this repo does. Imported convention is churn everyone ignores. |

## Red Flags

- Loading a directory rather than named files.
- The rules file containing advice an agent would follow anyway.
- A task-specific path or a temporary decision written into the rules file.
- Both `CLAUDE.md` and `AGENTS.md` maintained with overlapping content.
- A decision that only exists in the conversation, with real work now depending on it.
- Re-asking something already answered earlier in the session.
- Two sources contradicting each other and the contradiction never mentioned.
- Verify commands in the rules file that differ from what CI runs.
- A session that has switched task three times and still carries the first task's files.
- Convention documented from best practice rather than from the repo's own history.

## Verification

- [ ] The rules file contains commands, conventions, boundaries and the expensive traps, and nothing an agent would do right anyway
- [ ] Verify commands match what CI runs
- [ ] Only one of `CLAUDE.md` / `AGENTS.md` holds content; the other is a pointer
- [ ] Source was loaded by name, the target, its callers, one pattern example, not by directory
- [ ] Wide reading was delegated, and answers came back rather than file contents
- [ ] Any conflict between sources was stated, and resolved by running behaviour over documentation
- [ ] Decisions made in conversation were written into an artefact
- [ ] Spent context, resolved errors, abandoned approaches, was dropped
- [ ] Unknowns are recorded as unknown
- [ ] Conventions were derived from the repo's history, not from general practice
