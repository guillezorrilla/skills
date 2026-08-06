# efficient-fable

## What it does

Turns Fable 5 into an orchestrator that never touches files. It decomposes the work,
writes self-contained briefs, judges what comes back, and synthesizes — while the
actual reading and typing happens elsewhere:

| Work | Goes to | Bill |
| --- | --- | --- |
| grep, read, summarize, reduce logs | Haiku 4.5 | Claude, trivial |
| diffs the brief already specifies | Sonnet 5 | Claude, cheap |
| default implementation | codex Sol (xhigh) | **ChatGPT** |
| debugging, the one hard call | Opus 5 | Claude, the reserve |
| plan, brief, judge, synthesize | Fable 5 | under 10% of tokens |

The point is that codex runs on a **different subscription**, so implementation stops
consuming Claude quota. Codex is not smarter than Opus 5 — it is separately billed.
See [ADR 0002](../.agents/adr/0002-codex-is-a-separate-bill-not-a-better-model.md).

## When to reach for it

The gate is in the skill, and it exists because delegation has a floor of roughly
5–7K tokens per round trip. Delegate when the work spans **3+ files**, when you do
not yet know which files it touches, when it needs a build/test loop to verify, or
when two slices can run in parallel. Below that, Fable does it inline — briefing an
agent to read one known file costs more than reading it.

Reach for it on a multi-file refactor, an unfamiliar subsystem, a migration across
call sites. Skip it for a two-line fix, however tempting the machinery is.

## Common questions

**Does Fable actually read nothing?** It reads briefs, returned packets, and `git
diff` — never source files. A diff is 10–50× smaller than the files it touches and is
the only artifact that shows what changed.

**How does it know a worker is telling the truth?** It doesn't, and it is told not to
assume: packets are rejected unless they carry real command output with exit codes.
The build is the verifier, not a second model's opinion.

**Why not worktrees for parallel writers?** Each brief declares the paths it owns, and
overlapping slices are serialized instead of isolated. In a monorepo a worktree costs a
fresh install (and pods, on mobile) — too much for the conflict it prevents.

**What about `AGENTS.md`?** Codex reads `AGENTS.md`, never `CLAUDE.md`. Step 0 checks
for one and offers to symlink it. It never writes one for you — LLM-authored
`AGENTS.md` files measurably lower success (~3%) and raise cost (20%+).

**Does it work without a codex subscription?** Partly. Evidence gathering, mechanical
edits, and Opus 5 escalation all still work; you just lose the separate-bill lane,
which is most of the savings.

## It's working if

- Fable's share of session tokens stays under ~10%. Published setups land near 93%
  executor / 7% orchestrator; if Fable creeps past that, it has started doing the work.
- Every packet you see carries exit codes, not prose claims of success.
- You review diffs, not file dumps.
- It **declines** to delegate small tasks. A skill that fans out three agents for a
  one-line change has stopped paying for itself.
