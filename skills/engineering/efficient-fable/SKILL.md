---
name: efficient-fable
description: Use when running Claude Fable on codebase-heavy or token-heavy work and the user wants Fable to orchestrate while cheaper subagents — and codex, when it is available — do the bounded heavy lifting. Invoke as /efficient-fable, or when the user asks to orchestrate, delegate, fan out, or preserve Fable quota on a multi-file task.
---

# Efficient Fable

Use Claude Fable as the orchestrator, architect, synthesizer, and final judge. Use cheaper subagents — and a second vendor's frontier model when one is on hand — for the token-heavy research, coding, and testing that does not need Fable's judgment.

The skill runs in one of two modes, decided by what is installed. **Detect first; never assume codex is there, and never assume it isn't.**

## Step 0 — Pick the mode

```bash
command -v codex && codex login status
```

- **Exit 0 and logged in → dual-vendor mode.** Implementation goes to codex, on a separate subscription, and Claude quota becomes a reserve. Prefer the `/codex:rescue` plugin route when the `codex` plugin is installed (`/codex:setup` to confirm) because it runs jobs in the background with `/codex:status` and `/codex:result`, so Fable is not blocked burning tokens while codex works.
- **Anything else → Claude-only mode.** Do not mention codex again, do not suggest installing it mid-task, and do not degrade the work. The orchestration still pays for itself; only the separate-bill lane is missing.

Say which mode you are in, once, then get on with it.

## Step 0b — Make repo rules reachable (dual-vendor only)

Codex reads `AGENTS.md`, never `CLAUDE.md`. Before the first handoff:

- **Both missing** — put the binding constraints in each brief instead.
- **`CLAUDE.md` but no `AGENTS.md`** — offer the symlink, then say you did it:

  ```bash
  ln -s CLAUDE.md AGENTS.md
  echo AGENTS.md >> "$(git rev-parse --path-format=absolute --git-common-dir)/info/exclude"
  ```

  The exclude line keeps it out of `git status`. Mention it — they may prefer to commit it for teammates who use codex.
- **`AGENTS.md` is a real file, not a symlink** — a tool generated it. Run `ls -lt CLAUDE.md AGENTS.md`; if CLAUDE.md is newer, stop and say so, because codex is about to read stale rules.

Never *write* an AGENTS.md yourself. LLM-authored ones measurably lower success (~3%) and raise cost (20%+).

## The gate — do not delegate below this line

Delegation has a floor of roughly **5–7K tokens per round trip**. There is a documented case of reverting one README line costing 6,359 codex tokens against 7,225 Claude tokens — the wrapper cost more than the work.

**Delegate** if any of: the change touches 3+ files; you do not yet know which files it touches; it needs a build or test loop to verify; two or more slices can run in parallel.

**Do it inline** if all of: known file, known edit, no build loop, under ~50 lines.

Reading one known file yourself is cheaper than briefing an agent to read it.

## Where Fable shines

Reserve Fable for:

- Decomposing ambiguous work into clean parallel slices.
- Architecture, product, and safety tradeoffs.
- Reading conflicting reports and deciding what matters.
- Integrating partial implementations into one coherent plan.
- Final review, risk assessment, and user-facing synthesis.

Fable reads briefs, returned packets, and diffs. It does not read source files — if you catch yourself opening one to understand a subsystem, that is a brief for someone cheaper. Published setups land near **93% executor / 7% orchestrator**; hold yourself to that.

## Routing

Pick the **bill** first, then the tier within it. Codex is a *separate bill, not a smarter brain* — Claude Opus 5 leads gpt-5.6 Sol by **+14.6 pts on SWE-bench Pro**, wins 9 of 12 benchmarks, and wins debugging outright. Route to codex to preserve Claude quota, never for quality.

| Work | Dual-vendor mode | Claude-only mode |
| --- | --- | --- |
| grep, read, summarize, reduce logs | Haiku | Haiku |
| diffs the brief already fully specifies | Sonnet | Sonnet |
| **default implementation** | **codex Sol at xhigh** | **Opus 5** |
| long-horizon, many files + tests + follow-ups | codex Sol | Opus 5 |
| debugging, and the one hard call | Opus 5 | Opus 5 |
| overflow when the codex plan rate-limits | codex Terra | Sonnet, and say quality dropped |
| plan, brief, judge, synthesize | Fable | Fable |

Sol runs at `model_reasoning_effort = "xhigh"`; set `model = "gpt-5.6-sol"` in `~/.codex/config.toml` or pass `-m gpt-5.6-sol`. The published Sol-vs-Terra gap (~1.2 pts) is not effort-matched, and per-token price is irrelevant on a subscription — the binding constraint is rate limits.

In Claude-only mode the whole budget is one pool, so the gate matters more, not less: every delegated slice still costs Fable a brief and a packet.

## Delegation pattern

1. Name the expensive-token risk: large repo search, long logs, broad docs, repetitive edits.
2. Split independent work into slices before reading everything yourself.
3. Declare what each slice **owns**. If `owns(A)` intersects `owns(B)`, run A then B — overlapping writers in one tree silently clobber each other. No worktrees: in a real repo a worktree costs a fresh dependency install.
4. Dispatch the whole fan-out in **one message with multiple tool calls**, not staged waves. Use plain subagents, not workflow orchestration, so each stays visible and individually interruptible.
5. Spend Fable tokens on the decision layer: compare results, resolve conflicts, choose the path, review the final diff.

## Handoff packets

Write every brief as if the recipient has no chat context — for a codex handoff that is literally true. Spec quality is the whole game: a cheap model with a precise brief beats a strong model with a vague one.

```
objective:  one sentence, the observable end state
owns:       exact write paths — nothing outside these
reads:      read-only paths it needs
forbidden:  everything else, plus known traps
verify:     the exact commands that must exit 0
stop when:  success condition, or "blocked — report and stop"
max 8 attempts, then report blocked. Do not widen scope to make it pass.
report:     files changed, each verify command + exit code, 3-line diff
            summary, blocked_on or null
```

Stop conditions are not optional. Without them an agent that cannot match the prompt improvises, and improvised work is the expensive kind to review.

## Vetting delegated work

**Generation is not the bottleneck; verification is.** Treat every report as a **lead, not a fact**.

- Reject any packet that claims success in prose without command output and exit codes. The build is the verifier, not a second model's opinion.
- `git diff --stat` on every slice, always.
- `git diff <path>` for risky slices only — shared libraries, build config, money, auth, anything that already failed once. A diff is 10–50× smaller than the files it touches and is the only artifact that shows what actually changed.
- Never reopen the touched files to "check". If a claim cannot be settled from the diff plus exit codes, brief a cheap agent to settle it.

In dual-vendor mode, `/codex:adversarial-review` is frontier review on the other bill. Useful, but it has correlated blind spots with codex-written code — it supplements the diff read, never replaces it.

## Common scenarios

Soft defaults, not rules:

- **Research** — cheap agents scan docs, prior art, APIs and repo surfaces in parallel; Fable decides what evidence changes the plan.
- **Coding** — bounded slices out, integration and final review kept in. Shared-file coordination never delegates.
- **Testing** — Fable picks the validation direction; a cheap agent runs the targeted tests and reduces the output, reporting exact commands, failures, and whether a failure looks flaky, environmental, or real.
- **Debugging** — cheap agents cluster logs and reproduce; the diagnosis itself goes to Opus 5 in either mode, because that is its clearest win. Run `/diagnosing-bugs` for the loop discipline.

If a task is small, or the validation needs delicate judgment, keep it with Fable.

## Watch-outs

- Fable **silently reroutes to Opus** when safety classifiers trip on security or bio content. If behaviour shifts mid-task, check `/model`.
- Use `/effort high`, not max, unless you have confirmed the extra reasoning changes the output.
- New agent definition files need a session restart to load.
- `CLAUDE.md`, `AGENTS.md` and `~/.codex/AGENTS.md` can disagree. When a worker does something inexplicable, suspect conflicting rules before blaming the model.
- Information passing through two translation layers drifts. If a codex result does not match the intent, re-read your own brief before re-briefing.
- The real failure mode is silent decay: it stops working well and nobody notices for a while. If Fable's share creeps past ~10% of session tokens, or packets start arriving without exit codes, the discipline has slipped.

## Claims

For codebase-heavy work with independent slices, it is reasonable to describe this as up to **3–5× more cost-efficient and 2–4× faster**, and separately to expect roughly **40% less premium-model use**. Treat all of these as workload-dependent estimates, not guarantees — they collapse on small tasks, where the wrapper costs more than the work.
