---
name: efficient-fable
description: Use when running Claude Fable on codebase-heavy or token-heavy work and the user wants Fable to orchestrate while cheaper subagents — and codex, when it is available — do the bounded heavy lifting. Invoke as /efficient-fable, or when the user asks to orchestrate, delegate, fan out, or preserve Fable quota on a multi-file task.
---

# Efficient Fable

Use Claude Fable as the orchestrator, architect, synthesizer, and final judge. Use cheaper subagents — and a second vendor's frontier model when one is genuinely on hand — for the token-heavy research, coding, and testing that does not need Fable's judgment.

Fable reads briefs, returned packets, and diffs. It does not read source files. If you catch yourself opening one to understand a subsystem, that is a brief for someone cheaper. Published setups land near **93% executor / 7% orchestrator** — hold yourself to that.

## The gate — do not delegate below this line

Delegation has a floor of roughly **5–7K tokens per round trip**. There is a documented case of reverting one README line costing 6,359 codex tokens against 7,225 Claude tokens: the wrapper cost more than the work.

**Delegate** if any of: the work touches 3+ files or artifacts; you do not yet know which ones; it needs a build, test, or render loop to verify; two or more slices can run independently.

**Do it inline** if all of: known target, known change, no verification loop, small.

Reading one known file yourself is cheaper than briefing an agent to read it. Apply the gate before anything else — it is the only step that runs every time, and most of the time it ends here.

## Executor lanes

Decide the lane **at the first handoff, not at invocation** — and read it off what you already have rather than probing for it.

- **A codex tool or `/codex:*` command is in your available tools** → the codex lane is open. Prefer `/codex:rescue`; it runs in the background with `/codex:status` and `/codex:result`, so Fable is not blocked burning tokens while codex works.
- **No codex tooling, but you have a shell on the user's own machine and are about to hand off implementation** → one `codex login status` settles it. Run it **once**, remember the answer for the rest of the session, and never run it again. Not logged in, not installed, non-zero exit: the lane is closed.
- **A hosted sandbox — Cowork, or any cloud session** → there is a shell and there are subagents, but the VM is not the user's machine and codex is not authenticated on it. The lane is closed without probing. Everything else works unchanged: slices, `owns`, exit codes, diffs. Do not mention codex, do not suggest installing it, do not degrade the work.
- **Neither subagents nor a shell** (a plain chat) → there is nobody to delegate to. Say so in one clause, then do the work inline and well. Do not narrate an orchestration you cannot perform.

State the lane once, in a clause, when it first matters. Never open with a diagnostic.

The surface decides how much of this skill applies, and it is the one thing worth being explicit about: with executors, the gate and the routing table run; without them, this collapses to "brief precisely, demand observable evidence" — still worth having, but it is one sentence, not a workflow.

## Where Fable shines

Reserve Fable for:

- Decomposing ambiguous work into clean independent slices.
- Architecture, product, and safety tradeoffs.
- Reading conflicting reports and deciding what matters.
- Integrating partial work into one coherent whole.
- Final review, risk assessment, and user-facing synthesis.

## Routing

Pick the **bill** first, then the tier within it. Codex is a *separate bill, not a smarter brain* — Opus 5 leads gpt-5.6 Sol by **+14.6 pts on SWE-bench Pro**, wins 9 of 12 benchmarks, and wins debugging outright. Route to codex to preserve Claude quota, never for quality.

| Work | codex lane open | codex lane closed |
| --- | --- | --- |
| search, read, summarize, reduce output | Haiku | Haiku |
| changes the brief already fully specifies | Sonnet | Sonnet |
| **default implementation** | **codex Sol at xhigh** | **Opus 5** |
| long-horizon: many files, tests, follow-ups | codex Sol | Opus 5 |
| debugging, and the one hard call | Opus 5 | Opus 5 |
| overflow when the codex plan rate-limits | codex Terra | Sonnet, and say quality dropped |
| plan, brief, judge, synthesize | Fable | Fable |

Sol runs at `model_reasoning_effort = "xhigh"`. The published Sol-vs-Terra gap (~1.2 pts) is not effort-matched, and per-token price is irrelevant on a subscription — the binding constraint is rate limits.

With the lane closed the whole budget is one pool, so the gate matters more, not less: every delegated slice still costs a brief and a packet.

## Repo rules, when handing to codex

Codex reads `AGENTS.md`, never `CLAUDE.md`. Check this **only** on the first codex handoff — never on invocation, and never at all when the lane is closed.

- **`CLAUDE.md` but no `AGENTS.md`** — offer `ln -s CLAUDE.md AGENTS.md`, and add `AGENTS.md` to `.git/info/exclude` so it stays out of `git status`. Say you did it; they may prefer to commit it for teammates.
- **`AGENTS.md` is a real file, not a symlink** — a tool generated it. If `CLAUDE.md` is newer, stop and say so: codex is about to read stale rules.
- **Neither exists** — put the binding constraints in the brief instead.

Never *write* an AGENTS.md yourself. LLM-authored ones measurably lower success (~3%) and raise cost (20%+).

## Delegation pattern

1. Name the expensive risk: broad search, long output, wide docs, repetitive edits.
2. Split independent work into slices before reading everything yourself.
3. Declare what each slice **owns**. If `owns(A)` intersects `owns(B)`, run A then B — two writers on one target silently clobber each other. No worktrees: in a real repo a worktree costs a fresh dependency install.
4. Dispatch the whole fan-out in **one message with multiple tool calls**, not staged waves. Use plain subagents, not workflow orchestration, so each stays visible and individually interruptible.
5. Spend Fable tokens on the decision layer: compare, resolve conflicts, choose the path, review the result.

## Handoff packets

Write every brief as if the recipient has no chat context — for a codex handoff that is literally true. Spec quality is the whole game: a cheap model with a precise brief beats a strong model with a vague one.

```
objective:  one sentence, the observable end state
owns:       exact paths it may change — nothing outside these
reads:      read-only paths it needs
forbidden:  everything else, plus known traps
verify:     the check that fails if this is wrong
stop when:  success condition, or "blocked — report and stop"
max 8 attempts, then report blocked. Do not widen scope to make it pass.
report:     what changed, the verify result, a 3-line summary,
            blocked_on or null
```

Stop conditions are not optional. Without them, an agent that cannot match the brief improvises, and improvised work is the expensive kind to review.

## Vetting delegated work

**Generation is not the bottleneck; verification is.** Treat every report as a **lead, not a fact**.

Demand evidence, and take the strongest kind the environment can produce:

- **Where commands exist** — the command and its exit code. Reject any packet claiming success in prose without them. The build is the verifier, not a second model's opinion. Then `git diff --stat` on every slice, and `git diff <path>` only for risky ones: shared code, build config, money, auth, anything that already failed once. A diff is 10–50× smaller than the files it touches and is the only artifact showing what actually changed.
- **Where they do not** — name the observable and check it directly: the section exists in the document, the sheet has the expected row count, the file opens, the figure is present. "Looks right" is not an observable; "row 42 reads *Total: 1,240*" is.

Never reopen the touched files to "check". If a claim cannot be settled from the evidence, brief a cheap agent to settle it.

With the codex lane open, `/codex:adversarial-review` is frontier review on the other bill — useful, but it shares blind spots with codex-written work. It supplements the diff read; it never replaces it.

## Common scenarios

Soft defaults, not rules:

- **Research** — cheap agents scan docs, prior art, APIs and surfaces in parallel; Fable decides what evidence changes the plan.
- **Coding** — bounded slices out; integration and final review kept in. Shared-target coordination never delegates.
- **Testing** — Fable picks the validation direction; a cheap agent runs the targeted checks and reduces the output, reporting the exact commands, the failures, and whether a failure looks flaky, environmental, or real.
- **Debugging** — cheap agents cluster logs and reproduce; the diagnosis goes to Opus 5 either way, because that is its clearest win. The diagnosing-bugs skill carries the loop discipline, where it is installed.
- **Documents and data** — the same shape with different units: slices are sections, sheets, or folders rather than files; `owns` is the section or tab; verification is the artifact opened and inspected. A cheap agent drafts or transforms one section, Fable keeps voice, structure and argument coherent across them. Two agents writing one document is the same clobbering problem as two writing one file.

If a task is small, or the validation needs delicate judgment, keep it with Fable.

## Watch-outs

- Fable **silently reroutes to Opus** when safety classifiers trip on security or bio content. If behaviour shifts mid-task, check the active model.
- Use high effort, not max, unless you have confirmed the extra reasoning changes the output.
- New agent definition files need a session restart to load.
- `CLAUDE.md`, `AGENTS.md` and a global codex `AGENTS.md` can disagree. When a worker does something inexplicable, suspect conflicting rules before blaming the model.
- Information passing through two translation layers drifts. If a result does not match the intent, re-read your own brief before re-briefing.
- The real failure mode is silent decay: it stops working well and nobody notices for a while. If Fable's share creeps past ~10% of session tokens, or packets start arriving without evidence, the discipline has slipped.

## Claims

For work with independent slices, it is reasonable to describe this as up to **3–5× more cost-efficient and 2–4× faster**, and separately to expect roughly **40% less premium-model use**. Treat these as workload-dependent estimates, not guarantees — they collapse on small tasks, where the wrapper costs more than the work.
