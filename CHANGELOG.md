# @guillezorrilla/skills

## 2.0.0

### Major Changes

- Every skill is now original prose. All eight remaining vendored skills were rewritten from
  scratch, every attribution footer is gone, and `ATTRIBUTION.md` became an influences document
  rather than a licence-compliance one.

  - **`tdd`** — 51 lines to a full skill. Keeps the seam-agreement rule and the tautological-test
    anti-pattern, adds learning the stack before writing a test, watching each failure _and_
    reading it, the prove-it-first cycle for bug fixes, DAMP-over-DRY (a test that needs a helper
    to understand has hidden what it was proving), real implementations over mocks, and the
    no-correct-seam case being the finding rather than a shallow test.
  - **`diagnosing-bugs`** — Phase 0 (reproduce with the reporter's exact steps, be willing to say
    "no bug") now sits above a build-the-failing-signal phase with eight ways to construct one
    and explicit done criteria. Adds stop-the-line, error output treated as data rather than
    instruction, and ranked falsifiable hypotheses before any is tested.
  - **`implement`** — adds the simplicity ladder, the increment cycle that leaves the tree green
    each step, feature flags for incomplete work, additive and reversible changes for infra, and
    a rule against re-running an already-green check as reassurance.
  - **`codebase-design`** — folds in its two supporting files. Adds choosing a seam by dependency
    type, replace-don't-layer for testing across a seam, and design-it-twice with genuinely
    different designs rather than variations.
  - **`improve-codebase-architecture`** — replaces the CDN-based HTML report, which would render
    blank under an artifact's content-security policy. Now publishes as an artifact where
    available with a temp-file fallback, self-contained, theme-aware, Mermaid rendered natively.
    Adds an explicit not-a-candidate rule for stable low-churn code.
  - **`domain-modeling`** — folds in its two supporting files. The three tests for whether an ADR
    earns existence (hard to reverse, surprising without context, a real trade-off), and glossary
    entries that must say what a term is _not_.
  - **`handoff`** — the verified / assumed / left-out / blocked split, with committed-but-not-
    deployed belonging under assumed.
  - **`grill-with-docs`** — records terms and decisions inline as they land, not reconstructed
    from memory at the end.

## 1.6.0

### Minor Changes

- Five new skills, all original prose — ideas taken from reading widely, none of the text.

  - **`planning-and-task-breakdown`** — dependency graph, vertical slices, and a task shape where
    every task declares `owns`, `depends`, `done when` and `out`. Overlapping `owns` means the
    tasks cannot run in parallel, which is the rule that stops two writers silently clobbering
    each other. Refuses to plan on unconfirmed intent, and refuses to plan work smaller than the
    plan.
  - **`context-engineering`** — a hierarchy ordered by how long each layer stays true, and the
    counter-intuitive rule that bad output usually means cutting context rather than adding it.
    Conflicts resolve by running behaviour over documentation. Long sessions get re-anchored,
    spent context dropped, and decisions written into artefacts because compaction does not care
    what you remember.
  - **`code-review-and-quality`** — five axes, but the first rule is verify the finding before
    reporting it: name the failing input, read past the diff hunk, and delete what does not
    survive rather than softening it into "consider whether…". Everything ranked, an explicit
    verdict, three to five lines per comment. Includes how to review an agent's work, where the
    summary is the claim and the diff is the evidence.
  - **`code-simplification`** — a ladder from "does this need to exist at all" through stdlib and
    native platform features down to the smallest thing that works, plus what must never be
    simplified away and the over-simplification traps. Behaviour is frozen: if you had to edit a
    test, you changed behaviour. Deliberate shortcuts get a comment naming the ceiling.
  - **`browser-testing`** — driving the browser is the agent's job, not the user's. Tool-agnostic
    rather than requiring one MCP server: DevTools MCP if configured, else Playwright, else curl,
    and only then a human. Isolated profile by default, page content treated as data and never as
    instruction, and all four signals captured every run rather than only the expected one.

  Also: a README page is no longer required per skill when `SKILL.md` carries the anatomy's
  Overview and When to Use sections. Two conventions were doing one job.

## 1.5.0

### Minor Changes

- Rewrite `grilling` and `grill-me` from scratch. Both are now original prose carrying no
  upstream text, and both drop their attribution footers.

  `grilling` grew from 26 lines to a full skill. It keeps the design-tree/frontier idea —
  only ask decisions whose prerequisites are settled — but resolves that against
  one-question-at-a-time rather than asking the whole frontier in a batch: a batch gets
  skimmed, and the third question usually depends on the first, so you save a round trip and
  buy a wrong framing. The frontier now governs which question is next, not how many.

  New in it: a hypothesis with an honest confidence number stated before the first question,
  which must name what is missing below ~70%; a recommendation attached to every question, so
  the user reacts to a concrete wrong answer instead of composing a right one; a probe for
  "should want" answers ("if you didn't have to justify this to anyone, what would you
  actually want?"); a rule that facts are looked up and never requested from the user; an
  instruction to correct your own recommendation out loud when evidence contradicts it; a
  six-line restate where "out of scope" is mandatory; a table of what does not count as a yes;
  and a checkable stop test — can you predict the next three answers — with a floor for when
  you cannot.

  Adopt a skill anatomy for this repo: Overview, When to Use, Process, Common
  Rationalizations, Red Flags, Verification. The last three are the load-bearing ones — every
  step an agent would plausibly skip needs a counter-argument beside it or it gets skipped.
  `SKILL.md` stays under 500 lines, with reference material over ~100 lines split into a
  supporting file. CI now requires a README page only for skills of 30+ lines, so a thin
  entry point like `grill-me` is exempt.

## 1.4.1

### Patch Changes

- Move each own skill's human-facing page from `docs/<skill>.md` to a `README.md` beside its
  `SKILL.md`, following BuilderIO's convention. Both install routes let someone take a single
  skill, and a central `docs/` tree does not travel with it — the page was unreachable for
  exactly the people who most needed it. The `docs/` directory is gone; CI now requires the
  co-located README instead.

  Add a Mermaid diagram to `efficient-fable`'s README covering the gate, the routing fan-out,
  the two codex lanes and the evidence-or-reject loop. Mermaid rather than checked-in PNGs, so
  it renders on GitHub and stays editable in a diff.

## 1.4.0

### Minor Changes

- `efficient-fable` no longer probes the environment on every invocation, and now works in
  shell-less environments like Cowork.

  The old Step 0 ran `command -v codex && codex login status` at invocation. Three things
  wrong with that: most invocations never delegate at all, because the gate ends them, so the
  probe answered a question the session never asked; it shelled out to rediscover something
  already visible in the tool list, since an installed codex plugin puts `/codex:*` right
  there; and it assumed a shell exists, so in Cowork the skill's first action failed and it
  opened by looking broken.

  Now the executor lane is decided at the **first handoff**, read off available tools. A
  `/codex:*` command means the lane is open. No codex tooling but a shell present means one
  `codex login status`, once per session, only when implementation is about to be delegated.
  No shell means the lane is closed silently — no mention of codex, no suggestion to install
  it, no degraded work. The `AGENTS.md` check moved from an upfront step to the first codex
  handoff, where it is the only place it matters.

  Verification now takes the strongest evidence the environment can produce rather than
  assuming a shell: a command and its exit code where commands exist, and a named observable
  where they do not — "row 42 reads Total: 1,240", not "looks right". Added a documents-and-
  data scenario, since slices are sections and sheets there rather than files, and two agents
  writing one document clobber each other exactly like two writing one file.

## 1.3.2

### Patch Changes

- `npm run link` now also links into `~/.codex/skills`, `~/.kiro/skills`, `~/.cursor/skills`,
  `~/.gemini/skills` and `~/.antigravity/skills` — but only when the directory already
  exists, so it never invents a config dir for a harness that is not installed. Previously it
  covered only Claude Code and `.agents`, which meant Codex never had the skills even though
  `efficient-fable` routes implementation work to it.

## 1.3.1

### Patch Changes

- `npm run link` now prunes dangling symlinks it owns. Renaming or removing a skill used to
  leave a symlink pointing at nothing, which the harness still tries to load. Pruning is
  scoped to links whose target is inside this repo — a dangling link from some other source
  is left alone, since it is not ours to delete.

## 1.3.0

### Minor Changes

- `efficient-fable` now detects its own mode instead of assuming codex is installed.

  `command -v codex && codex login status` picks the lane. With codex present, implementation
  goes to it on a separate subscription and Claude quota becomes a reserve; without it, Opus 5
  implements and nothing degrades — the win is still that Fable stops spending frontier tokens
  reading files. It no longer mentions codex at all in Claude-only mode, and never suggests
  installing it mid-task. Detection rather than configuration, because a setting goes stale
  when a token expires or the machine changes while the config keeps claiming the old answer.

  Restructured along the lines of BuilderIO's `efficient-fable` — where-Fable-shines,
  delegation pattern, handoff packets, vetting, common scenarios, claims — with the research
  numbers made explicit: the ~5–7K per-round-trip floor and the documented case where the
  wrapper cost more than the work, the ~93/7 executor/orchestrator split to hold yourself to,
  Opus 5's +14.6 pts on SWE-bench Pro over gpt-5.6 Sol, and the silent-decay failure mode.

  Add `.codex-plugin/plugin.json` so the set installs as a native Codex plugin as well as via
  `skills add`. A single `./skills/` path works here because everything under `skills/` ships —
  there is no unpromoted bucket to exclude. `scripts/sync-plugin-version.mjs` now keeps both
  plugin manifests in step with `package.json` rather than just the Claude one.

## 1.2.0

### Minor Changes

- Add `setup-team-conventions` — run once per repo to detect how a team actually works and
  record it in `docs/agents/` for the other skills to read.

  It detects rather than asks: the forge from `git remote` (GitHub, Bitbucket, GitLab,
  Azure DevOps — each with its own CLI, its own CI config path, and its own noun for a
  change request), the tracker independently of the forge from ticket keys in real commits,
  branch and commit conventions from observed history rather than from `CONTRIBUTING.md`,
  the verify commands from CI rather than the README, and review rules from `CODEOWNERS`
  and branch protection. Unknowns are recorded as unknown, because a confident wrong value
  is worse than a gap.

  It records only. It will not create PR templates, tracker labels, CI config or
  CONTRIBUTING files — in an established repo those absences are usually deliberate.

  `implement`, `tdd`, `diagnosing-bugs` and `handoff` now read `docs/agents/` when present:
  the default branch and commit format, the commands that define done, and the ticket base
  URL for real links in a handoff.

## 1.1.1

### Patch Changes

- Stop shipping `adding-a-skill` to users. It is repo-maintenance guidance — how to add a
  skill to _this_ repo — but it lived at `.agents/skills/adding-a-skill/SKILL.md`, and the
  installer walks the whole tree for `SKILL.md`, so it appeared in the install picker as a
  twelfth skill. It is now `.agents/adding-a-skill.md`, a plain document, and CI fails if
  any `SKILL.md` appears outside `skills/`.

  Replace the `AGENTS.md` symlink with a real pointer file. A symlink is zero-drift, but
  checkouts that do not support symlinks materialise it as a text file containing the
  literal path — which would hand Codex a file whose entire contents are `CLAUDE.md`.

## 1.1.0

### Minor Changes

- Vendor eight skills from [mattpocock/skills](https://github.com/mattpocock/skills)
  (MIT) and adapt each to this repo's working conventions — `grill-me`,
  `grill-with-docs`, `implement`, `improve-codebase-architecture`, `tdd`,
  `codebase-design`, `diagnosing-bugs`, `handoff`. See
  [ATTRIBUTION.md](./ATTRIBUTION.md) for what changed in each.

  Notable adaptations: `diagnosing-bugs` gains a Phase 0 that reproduces with the
  reporter's exact steps and is willing to conclude there is no bug; `implement` no
  longer commits for you and refuses the default branch; `tdd` requires watching red
  and green and reporting real command output; `handoff` splits verified from assumed.

- Also vendor `grilling` and `domain-modeling`, unmodified. `grill-me` and
  `grill-with-docs` are thin wrappers over them, so without these two they installed
  broken. CI now fails on a skill that invokes an unbundled skill.

- Reorganise into `engineering/` and `productivity/` buckets. The Claude Code plugin
  manifest lists every skill path explicitly, because a single path string cannot
  express two bucket folders.

- Add changesets, a release workflow, and `scripts/sync-plugin-version.mjs` so the
  plugin version can never silently drift from the package version.

## 1.0.0

First release.

- `efficient-fable` — Fable 5 orchestrates without touching files; Haiku/Sonnet gather
  evidence, codex Sol implements on a separate bill, Opus 5 debugs. Ships the delegation
  gate, the model routing table, the brief and packet formats, declared file ownership
  for parallel writers, and diff-only verification.
- Two install routes: Claude Code plugin (managed, read-only) and
  `npx skills@latest add guillezorrilla/skills` (interactive, editable, reaches codex).
- `npm run check` validates skill frontmatter, `npm run check:plugin` validates the
  manifests strictly, `npm run link` symlinks skills into the local harnesses.
