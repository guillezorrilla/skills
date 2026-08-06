# @guillezorrilla/skills

## 1.12.0

### Minor Changes

- `account-enrichment` and `proactive-customer-outreach` return, rebuilt so they beat a control
  instead of tying it.

  Both were removed in 1.10.0 for matching their no-skill controls rather than beating them. The
  diagnosis that fixed `icp-lead-generation` applies to them too: a skill that only imposes an
  output shape is a tax, and it has to carry technique. Everything their controls did better is
  now written in.

  **`account-enrichment`** now hunts the stalled attempt rather than waiting for a trigger,
  because a rollout live at four locations out of twenty-nine proves both that someone wanted it
  and that the attempt ran out of road. It treats absence as evidence, so what you looked for and
  did not find is recorded alongside what you found. It confirms names against a primary source,
  since aggregators keep stale titles alive for years and addressing someone by a job they left
  is the most expensive small error in prospecting. And it ends with four things instead of two:
  why now, what would disqualify them, the objection you will hit in their words, and what not to
  say, which is the ten minutes of looking that prevents the one sentence that loses an account.

  **`proactive-customer-outreach`** now sweeps every open item before drafting rather than
  answering the loudest one. The oldest neglected ticket is usually the real relationship risk,
  because nobody has told the customer it exists, and naming it unprompted is the clearest signal
  that a human is watching the account. During an incident it offers a route faster than the
  queue the customer is already stuck in. And it ends with the follow-through the sender has to
  do today, since every promise in the message is a commitment somebody has to keep, and a
  promised update followed by silence is worse than sending nothing.

  Scored against clean controls on the same tasks. `account-enrichment` went from 10 of 12 to
  12 of 12, against the control's 9. `proactive-customer-outreach` went from 10 of 12 to 12 of
  12, against the control's 11. The two things the enrichment control never produced were a
  disqualifier and a list of landmines.

## 1.11.0

### Minor Changes

- `icp-lead-generation` now carries the research techniques it was missing.

  Tested against a control on the same task, the first version bought a consistent output shape
  and cost research depth: it scored 8 of 8 on structure and 3 of 7 on technique, while the
  control with no skill at all scored 6 and 7. Net, the skill was worse than not using it, which
  is the opposite of the point.

  Everything the control did better is now in the skill:

  - **Count the locator, not the press release.** Stated figures disagree with a brand's own
    store locator in both directions, and either direction can put an account outside the band.
    Third-party numbers cross-check a first-party count; they never are the count.
  - **Use the public app-store lookup endpoints** for seller, bundle identifier, version,
    last-updated date, rating and rating count. Last updated is the fact that matters, and an
    inactive listing is a different prospect again.
  - **Identify the incumbent** from bundle identifiers, the DNS records on an ordering subdomain,
    and the association files a vendor must publish for deep links. Two brands shipping an
    identical build on the same day are on one templated platform.
  - **Suppress from your own public footprint when there is no CRM.** The products published
    under your own developer or vendor account, your logo wall, your case studies. Then say what
    that misses, because open opportunities and past losses are invisible to it.
  - **A former customer now on a competitor is a dated displacement fact**, not a reject. Record
    who they moved to and when the replacement shipped.
  - **Small samples are not evidence.** Two stars from eight ratings says nothing. Quote the
    count beside the rating or leave both out.
  - **Two caveats in every coverage note:** counts sitting at the edge of the band, and a band
    that sits outside your existing customer base, where the proof will not transfer and the
    cycle is longer.

  Re-tested after the change: 8 of 8 on structure and 7 of 7 on technique, against the control's
  13 of 15.

## 1.10.0

### Minor Changes

- Keep the two go-to-market skills that earned it, remove the three that did not.

  `icp-lead-generation` and `cold-outreach` stay. `setup-gtm-workflow`, `account-enrichment` and
  `proactive-customer-outreach` are gone, one release after arriving.

  The reason is the test rather than taste. Each skill was run against a control on the same
  task, with the control forbidden from using skills, and with traps planted in the input: an
  unsourced rumour, a stale undated fact, an unverified opinion about the prospect's own
  product, an open severity-1 ticket next to a milestone worth celebrating.

  `cold-outreach` was the clear keeper. Both control runs shipped no sender identity and no
  working opt-out, which is a legal floor in several of the places these messages get sent, and
  both skilled runs included them. `icp-lead-generation` produced target lists whose rows carry a
  source and a date, keeps the rejects, and refused an unfalsifiable half of the profile it was
  handed instead of quietly scoring it.

  The other three did not clear that bar. `account-enrichment` and
  `proactive-customer-outreach` matched their controls rather than beating them, so they were
  format discipline rather than a reason to install anything. `setup-gtm-workflow` was never
  tested at all, because testing it needs connected CRM and notes tools.

  What the removed setup skill was for has not been dropped. Both surviving skills now establish
  what they need from whatever the team already has, reading a connected CRM or an existing
  process doc first and asking only for what cannot be found, rather than pointing at a separate
  profile that has to be built first.

## 1.9.0

### Minor Changes

- Five go-to-market skills, in a new `go-to-market` bucket, all of them installable in the
  Claude apps without a terminal.

  - `setup-gtm-workflow` records how a team already works before anything else runs: which
    CRM, notes tool and support desk are actually connected, their real pipeline stage names,
    who owns which account, where suppression lives, who approves a send, and which regions
    their recipients sit in. It records and never redesigns, and the other four read what it
    writes, so they fit an existing process instead of inventing one.
  - `icp-lead-generation` takes the profile the team already trusts and converts it into
    filters that can come back false, then proves each account fits with a source and a date.
    It keeps the rejects, which is the only evidence that the profile itself is wrong, and it
    will not collect from behind a login or against a site's terms.
  - `account-enrichment` builds a one-page dossier aimed at one decision, is there a reason to
    write to them now, and checks the CRM, the inbox and the call notes before the open web.
    Every line is labelled verified, internal, inferred or unknown, and nothing said in
    confidence is set up to be quoted back to the customer.
  - `cold-outreach` writes a first touch on one dated fact, with one small ask, a graceful way
    to say no, and a real identity with a working opt-out. It gates on whether a dated fact
    exists at all, because the answer to nothing-to-say is not a cleverer opener.
  - `proactive-customer-outreach` learns the team's voice from messages that actually got
    replies rather than from a description of the voice, uses account numbers with dates, and
    refuses to send a cheerful milestone note while that customer has an open escalation.

  One rule runs through all five: every fact that reaches a prospect or a customer carries a
  source and a date, or it does not get sent. Invented familiarity is how AI-written outreach
  fails, and the reader is the one person who can check the claim instantly.

  `proactive-customer-outreach` had one behaviour corrected before release: its kill switch was
  right to stop a milestone note during an open escalation, but it then treated the whole message
  as out of scope and returned a template of placeholders. The switch now redirects rather than
  refuses. It writes the honest message instead, leading with what is actually happening and
  owning anything promised and not delivered, and blanks are allowed only where nobody knows the
  answer yet.

  Also in this release: em dashes and en dashes are gone from every skill and document, along
  with the comma soup that replacing them mechanically produced.

## 1.8.0

### Minor Changes

- Install without a terminal, in the Claude apps.

  `grilling`, `handoff` and `efficient-fable` now ship as uploadable `.zip` files on every
  release, so teammates who do not use a command line — sales, support, marketing — can add
  them at **Settings → Capabilities → Skills**, and an admin on a Team or Enterprise plan can
  upload once in **Organization settings → Skills** for everyone at once. Walkthrough in
  [docs/install-in-the-claude-app.md](./docs/install-in-the-claude-app.md).

  The apps are a genuinely different surface, so the pack is built rather than copied:
  `npm run pack` rewrites each skill's frontmatter for a 200-char description cap, strips
  Claude Code-only keys — `disable-model-invocation` would upload cleanly and then never fire,
  because the apps have no slash commands — and refuses to ship a skill that reaches for a
  sibling it cannot reach there.

  Three skills were adapted so they work on more than one surface:

  - `efficient-fable` no longer treats Cowork as a dead end. Cowork has sub-agents and a
    sandboxed shell, so slices, `owns`, exit codes and diffs all work there; only the codex
    lane is closed, and it is closed without probing, because the VM is not your machine.
    With no executors at all it now says so in a clause and does the work inline instead of
    narrating an orchestration it cannot perform.
  - `handoff` produces a downloadable file, or the reply itself, where there is no filesystem
    to write to — and accepts a named observable as evidence where there are no commands to
    run.
  - `grilling` finds facts with whatever the environment offers: a file, a command, a
    subagent, a search, a connected tool.

## 1.7.0

### Minor Changes

- Every skill rewritten to one consistent voice and the full anatomy — Overview, When to Use,
  Process, Common Rationalizations, Red Flags, Verification.

  - **`tdd`** — 51 lines to a full skill. Seam agreement, the tautological-test anti-pattern,
    learning the stack before writing a test, watching each failure _and_
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
  `SKILL.md`. Both install routes let someone take a single
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

  Restructured around where-Fable-shines, delegation pattern, handoff packets, vetting,
  common scenarios and claims, with the research numbers made explicit: the ~5–7K per-round-trip floor and the documented case where the
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

- Add eight skills — `grill-me`, `grill-with-docs`, `implement`,
  `improve-codebase-architecture`, `tdd`, `codebase-design`, `diagnosing-bugs` and
  `handoff` — each encoding this repo's working conventions.

  Notable adaptations: `diagnosing-bugs` gains a Phase 0 that reproduces with the
  reporter's exact steps and is willing to conclude there is no bug; `implement` no
  longer commits for you and refuses the default branch; `tdd` requires watching red
  and green and reporting real command output; `handoff` splits verified from assumed.

- Add `grilling` and `domain-modeling`. `grill-me` and `grill-with-docs` are thin wrappers
  over them, so without these two they installed broken. CI now fails on a skill that
  invokes an unbundled skill.

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
