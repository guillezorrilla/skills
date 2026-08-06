# efficient-fable

## What it does

Turns Fable 5 into an orchestrator that never touches files. It decomposes the work,
writes self-contained briefs, judges what comes back, and synthesizes — while the actual
reading and typing happens elsewhere.

It runs in **two modes**, chosen by detection, not configuration:

```bash
command -v codex && codex login status
```

| Work | Dual-vendor mode | Claude-only mode |
| --- | --- | --- |
| grep, read, summarize, reduce logs | Haiku | Haiku |
| diffs the brief already specifies | Sonnet | Sonnet |
| **default implementation** | **codex Sol (xhigh)** — ChatGPT bill | **Opus 5** |
| debugging, the one hard call | Opus 5 | Opus 5 |
| plan, brief, judge, synthesize | Fable | Fable |

In dual-vendor mode, codex runs on a **different subscription**, so implementation stops
consuming Claude quota entirely. Codex is not smarter than Opus 5 — Opus 5 leads it by
+14.6 pts on SWE-bench Pro and wins debugging outright — it is separately *billed*. See
[ADR 0002](../.agents/adr/0002-codex-is-a-separate-bill-not-a-better-model.md).

Without codex, the skill does not degrade the work; it just loses that lane. Opus 5
implements, and the orchestration still pays for itself because the expensive model stops
reading files. It will not nag you to install codex.

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

**Does it work without a codex subscription?** Yes — that is Claude-only mode, detected
automatically. Evidence gathering, mechanical edits and Opus 5 implementation all work
normally. You lose the separate-bill lane, so the saving is smaller: the win is that Fable
stops spending frontier tokens on file reading, not that the work moves off your bill.

**Why detect instead of a setting?** Because a setting goes stale. You install codex, or
your token expires, or you switch machines — and a config file keeps claiming the old
answer while the routing quietly breaks. `codex login status` is true at the moment it
matters.

## It's working if

- Fable's share of session tokens stays under ~10%. Published setups land near 93%
  executor / 7% orchestrator; if Fable creeps past that, it has started doing the work.
- Every packet you see carries exit codes, not prose claims of success.
- You review diffs, not file dumps.
- It **declines** to delegate small tasks. A skill that fans out three agents for a
  one-line change has stopped paying for itself.
