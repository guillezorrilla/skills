---
name: efficient-fable
description: Use when Fable 5 is the session model and the task is big enough to delegate - Fable plans, briefs, judges and synthesizes while Haiku/Sonnet gather evidence, codex (separate bill) implements, and Opus 5 handles debugging. Invoke as /efficient-fable, or when the user asks to orchestrate, delegate, fan out, or preserve Fable/Claude quota on a multi-file task.
---

# Efficient Fable

ACTIVE FOR THE REST OF THE SESSION once invoked. No drift back to doing the work
yourself. Off only on "stop orchestrating".

Prereqs, check once at start: session model is Fable (`/model fable`), effort is
**high** not max, and `/codex:setup` passes. If the model is not Fable, say so and
stop - orchestrating Sonnet from Sonnet saves nothing.

## Step 0 - make repo rules reachable by codex

Codex reads `AGENTS.md`, never `CLAUDE.md`. Check this **before** the first codex
handoff, and tell the user what you found:

- **Both missing** - put the binding constraints in each brief instead. Done.
- **`CLAUDE.md` but no `AGENTS.md`** - symlink it, then say you did:

  ```bash
  ln -s CLAUDE.md AGENTS.md
  git rev-parse --git-common-dir >/dev/null 2>&1 &&
    echo AGENTS.md >> "$(git rev-parse --path-format=absolute --git-common-dir)/info/exclude"
  ```

  The exclude line keeps it out of `git status` so it is never committed by
  accident. Say so - it is their repo, and they may prefer to commit it for
  teammates who use codex.
- **`AGENTS.md` is a real file, not a symlink** (`ls -l AGENTS.md`) - a tool
  generated it. The `skills` CLI does this: a deterministic transform of CLAUDE.md
  plus a mirrored `.agents/` rules tree, which is *better* than a symlink because
  the `@`-import lines get rewritten to paths that exist. But that sync is usually
  **manual**. Run `ls -lt CLAUDE.md AGENTS.md`; if CLAUDE.md is newer, stop and say
  so - codex is about to read stale rules.

Never *write* an AGENTS.md yourself - LLM-authored ones measurably lower success
(~3%) and raise cost (20%+). Symlink or deterministic transform only.

## The gate - do not delegate below this line

DELEGATE if ANY: touches 3+ files / file list unknown / needs a build-test loop
to verify / 2+ independent slices can run in parallel.

DO IT INLINE if ALL: known file, known edit, no build loop, under ~50 lines.

Reading one known file inline is cheaper than briefing an agent to read it. The
wrapper floor is ~5-7K tokens per round trip - there are documented cases of the
handoff costing more than the work. Delegate only when the worker does
substantially more than the brief costs.

## Routing - pick the bill first, then the tier

Codex is a **separate bill, not a smarter brain**: Opus 5 beats gpt-5.6 Sol by
+14.6 pts on SWE-bench Pro and wins debugging outright. Route to codex to
preserve Claude quota, never for quality.

| Work | Goes to | Bill |
|---|---|---|
| grep, read, summarize, reduce logs | Haiku 4.5 | Claude, trivial |
| brief fully specifies the diff (renames, testIDs, boilerplate, mirroring, tests from a written spec) | Sonnet 5 | Claude, cheap |
| **default implementation** | **codex Sol at xhigh** | ChatGPT |
| overflow when Sol hits subscription rate limits | codex Terra | ChatGPT |
| debugging, and the one hard slice where a bad call is expensive | Opus 5 | Claude, reserve |
| plan, brief, judge, synthesize, decide | Fable 5 (you) | keep under 10% of session tokens |

Sol runs at `model_reasoning_effort = "xhigh"`. The published Sol-vs-Terra gap
(~1.2 pts SWE-Pro) is not effort-matched and the price gap is irrelevant on a
subscription - Sol at xhigh is the default. Set `model = "gpt-5.6-sol"` in
`~/.codex/config.toml`, or pass `-m gpt-5.6-sol` per call.

Test for Sonnet-vs-codex: *could you write the diff yourself from the brief?*
Yes -> Sonnet. No -> codex.

## Fable never touches files

You read no source files. You read briefs, packets, and diffs. If you catch
yourself opening a file to understand a subsystem, that is a Haiku brief.

Dispatch the whole fan-out in one message, multiple tool calls. Never the
Workflow tool.

## Brief template

Assume zero shared context. Spec quality is the entire game - a cheap model with
a precise brief beats a strong model with a vague one.

```
objective:  one sentence, the observable end state
owns:       exact write paths (globs ok) - nothing outside these
reads:      read-only paths it needs
forbidden:  everything else, plus any known traps
verify:     the exact commands that must exit 0
stop when:  success condition, or "blocked - report and stop"
max 8 attempts, then report blocked. Do not widen scope to make it pass.
report:     files changed, each verify command + exit code, 3-line diff summary,
            blocked_on or null
```

## Write safety - ownership, not worktrees

Before fan-out: if `owns(A)` intersects `owns(B)`, run A then B. Non-overlapping
slices dispatch together. No locks, no worktrees (a worktree here costs a fresh
`pnpm install`, and pods on mobile). Keep every slice independently revertable.

## Verification - the build is the verifier

Generation is not the bottleneck, verification is. Treat every packet as a
**lead, not a fact**.

Reject any packet that claims success in prose without command output and exit
codes. Then:

- `git diff --stat` - always, every slice
- `git diff <path>` - for risky slices only (shared libs, build config, money,
  auth, anything that failed once)
- Never read the touched files to "check" - the diff is 10-50x smaller and is the
  only artifact showing what actually changed

Optional peer check on high-stakes slices: `/codex:adversarial-review` - frontier
review on the ChatGPT bill. Correlated blind spots with codex-written code, so
it supplements the diff read, never replaces it.

## Codex plugin usage

Install once: `/plugin marketplace add openai/codex-plugin-cc`,
`/plugin install codex@openai-codex`, `/reload-plugins`, `/codex:setup`.

- `/codex:rescue` - delegate a slice (also available as the `codex:codex-rescue`
  subagent)
- `/codex:status` / `/codex:result` / `/codex:cancel` - background jobs, so you
  are not blocked burning Fable tokens while codex works
- `/codex:transfer` - persistent codex thread when a slice needs several rounds

## Watch-outs

- Fable **silently reroutes to Opus** when safety classifiers trip (security,
  bio). If behavior shifts, check `/model`.
- New agent definition files need a session restart to load.
- `CLAUDE.md`, `AGENTS.md` and `~/.codex/AGENTS.md` can disagree. When a worker
  does something inexplicable, suspect conflicting rules before the model.
- The real failure mode is silent decay: it stops working well and you do not
  notice for a while. If Fable's share creeps past ~10% of session tokens, or
  packets start arriving without exit codes, the discipline has slipped.
