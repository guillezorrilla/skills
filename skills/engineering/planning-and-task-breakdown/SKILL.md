---
name: planning-and-task-breakdown
description: Turns confirmed intent into ordered, independently verifiable tasks — a dependency graph sliced vertically, each task carrying its own acceptance check and the paths it owns. Use when work is too large or vague to start, when it spans several files or sessions, when parallel work is possible, or when scope needs communicating to a human before any code exists.
---

# Planning and Task Breakdown

## Overview

A plan exists to make the order of work obvious and the finish line checkable. Its output is not a document to admire — it is a sequence where each step can be built, verified, and stopped after.

The two failure modes are opposites. An absent plan produces a tangle that has to be unpicked at review. An over-elaborate plan produces ceremony for work that was three lines, and a task list nobody follows because reality moved.

## When to Use

- Work spans several files, or you cannot yet name which files it touches.
- A task feels too large to start, or too vague to know when it is done.
- Work could run in parallel across sessions or agents.
- Scope needs to be visible to a human before code exists.
- Implementation order is not obvious, and getting it wrong means rework.

**Not for:**

- A single-file change with obvious scope. Do it.
- Work whose spec already contains well-defined tasks. Use those.
- Anything where writing the plan costs more than the work. A three-line fix does not get a task list.
- An ask nobody has confirmed yet. Planning on unconfirmed intent produces a precise plan for the wrong thing — run `grilling` first.

## Before you plan

**Intent must be confirmed.** If nobody has agreed what success looks like, what is out of scope, and what the binding constraint is, you are not ready. Get that first.

**Facts are yours to find.** What the code currently does, which patterns the project already uses, what CI runs, which dependency is present — go and read it. A plan built on assumed facts fails at the first task, and every downstream task inherits the error. Dispatch parallel readers if the surface is wide, all in one message rather than in waves.

**Do not write implementation code while planning.** Reading is unlimited; writing is not. The moment you start editing, the plan stops being a plan and becomes a narration of what you already did.

## The Process

### 1. Map the dependency graph

Write down what must exist before what. Not a wish-list order — a *cannot-start-until* order.

```
schema ──▶ data access ──▶ service ──▶ endpoint ──▶ UI
                    └──▶ migration
```

Anything with no unmet prerequisite can start now, and anything with the same prerequisites can run in parallel. This graph is the plan; the task list is just its topological order.

### 2. Slice vertically, never by layer

Each task should deliver something observable end to end, however thin. "Schema, then all services, then all endpoints, then the UI" is horizontal: nothing works until the last layer lands, nothing can be verified along the way, and an abandoned effort leaves scaffolding with no behaviour.

A vertical slice is "one field, readable and writable through the whole stack". Narrow but alive. It can be verified, reviewed, and shipped, and the next slice learns from it.

### 3. Write tasks that can be checked

Each task carries:

```
Task N: <imperative title>
  owns:      the paths this task may change
  depends:   task numbers that must land first
  do:        two or three sentences — what changes and where
  done when: the observable check that fails if this is wrong
  out:       anything explicitly not in this task
```

`done when` is the part that matters, and it must be checkable by something other than opinion — a command and its exit code where commands exist, a named observable where they do not. "Login works" is not an acceptance check. "`POST /session` with valid credentials returns 200 and sets an httpOnly cookie" is.

`owns` is what makes parallel work safe. **If two tasks own overlapping paths, they cannot run in parallel** — order them instead. Two writers on one file silently clobber each other, and the loser's work disappears without a conflict marker.

### 4. Size for one sitting

A task should be implementable and verifiable in a single focused session. Too large and it cannot be reviewed or reverted cleanly; too small and the overhead swamps the work.

If a task needs the word "and" to describe, it is probably two tasks. If three tasks all touch the same file for the same reason, they are probably one.

### 5. Put checkpoints where the plan could be wrong

After each group of related tasks, name a point where a human looks before more work stacks on top. Put them where an assumption gets tested for the first time — after the first vertical slice, after the first integration with something external, after anything you flagged as a risk.

A checkpoint has an explicit question: "does this shape work before I build eight more on it?" Not "let me know if you have thoughts".

### 6. State the risks and the unknowns

Two lists, both short:

- **Risks** — what could make this plan wrong, and the cheapest thing that would tell you early.
- **Open questions** — what you could not settle. Say who can settle each one, and whether work can start without it.

Record unknowns as unknown. A plan that quietly assumes an answer produces work built on it, and nobody knows the assumption was there.

### 7. Say what parallelises

Name the tasks that can run at once, based on the graph and non-overlapping `owns`. If nothing parallelises, say that too — it tells the reader the timeline is the sum, not the max.

## Where the plan lives

One file, in the repo, in the project's docs location — or `tasks/plan.md` if there is no convention. Committed, so a teammate can read it in review, and so the next session picks up where this one stopped.

Keep it alive. When reality contradicts the plan, update the plan and say what changed. A stale plan is worse than none, because people trust it. When a task is done, mark it done — with the evidence, not just a tick.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll work out the order as I go." | Order is the plan's entire value. Discovering a dependency at task six means redoing one through five. |
| "The layers are the natural tasks." | Horizontal slices cannot be verified until the last one lands. Slice vertically, however thin. |
| "I'll write the acceptance criteria later." | Then the task has no finish line and will be declared done by feel. Write the check first; it often changes the task. |
| "This is obviously parallel." | Only if the paths do not overlap. Check `owns` before dispatching, or two agents will overwrite each other. |
| "I'll plan and start the easy bits at once." | Now the plan is describing what you already built, and nobody reviewed the shape before it existed. |
| "I don't know that yet, I'll assume the sensible thing." | Write it as an open question. An assumption that never surfaces is a decision the user never made. |
| "A checkpoint will slow us down." | A checkpoint after the first slice costs one message. Discovering the shape was wrong at task nine costs the nine tasks. |
| "The spec is clear enough to skip confirming." | Then say the outcome, the constraint and the non-goals in one sentence each. If you cannot, it is not clear. |
| "This task is big but it's all one thing." | If describing it needs "and", it is two. Big tasks are where partial completion hides. |

## Red Flags

- Tasks named by layer — "backend", "frontend", "tests" — rather than by observable behaviour.
- A task with no `done when`, or one that reads "works correctly".
- Two tasks marked parallel that both list the same file under `owns`.
- Editing implementation files during the planning step.
- A plan with no open-questions section, in work that has obvious unknowns.
- No checkpoint before a long run of dependent tasks.
- A task you cannot imagine reviewing in one sitting.
- The plan asserts a fact about the codebase that nobody read.
- A plan document that has not changed while the work visibly diverged from it.

## Verification

- [ ] Intent was confirmed before planning began
- [ ] Every fact the plan relies on was read, not assumed
- [ ] No implementation code was written during planning
- [ ] A dependency graph exists, and the task order is a topological order of it
- [ ] Every task is a vertical slice with observable behaviour
- [ ] Every task has `owns`, `depends`, `done when`, and `out`
- [ ] Every `done when` is checkable by command output or a named observable
- [ ] No two tasks marked parallel share a path in `owns`
- [ ] Checkpoints sit where assumptions get tested first
- [ ] Risks and open questions are listed, with unknowns recorded as unknown
- [ ] The plan is committed where a teammate can review it
