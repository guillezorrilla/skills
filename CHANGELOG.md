# @guillezorrilla/skills

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
