# CLAUDE.md

Conventions for agents working **on this repo**. Skills that ship to users live in
`skills/`; guidance that is only about maintaining this repo lives in `.agents/`.

## Layout

Skills are organised into bucket folders under `skills/`:

- `engineering/` — daily code work
- `productivity/` — daily non-code workflow

| Path | What |
| --- | --- |
| `skills/<bucket>/<name>/SKILL.md` | a shipped skill |
| `skills/<bucket>/README.md` | bucket index, grouped user-invoked / model-invoked |
| `.agents/skills/<name>/SKILL.md` | repo-only skills, never shipped |
| `.agents/adr/` | decision records — why, not what |
| `.agents/invocation.md` | model-invoked vs user-invoked |
| `docs/<skill-name>.md` | human-facing page, own skills only |
| `.claude-plugin/` | Claude Code plugin + marketplace manifests |
| `scripts/` | checks and local linking |

The `skills` CLI discovers skills by walking the tree, so it needs no manifest. The
Claude Code plugin does not — `.claude-plugin/plugin.json` lists every skill path
**explicitly** as an array, because a single path string cannot express two bucket
folders. **A new skill must be added to that array or the plugin ships without it.**
CI enforces this.

## Rules

- Every skill appears in its bucket `README.md`, the top-level `README.md`, and
  `.claude-plugin/plugin.json`'s `skills` array.
- Never hand-edit versions. `npm run version` bumps `package.json` from pending
  changesets, then `scripts/sync-plugin-version.mjs` copies it into
  `.claude-plugin/plugin.json`. Claude Code decides when subscribers see an update by
  comparing that plugin version, so a change without a bump reaches nobody.
- Every user-visible change needs a changeset (`npm run changeset`). See
  [.changeset/README.md](./.changeset/README.md).
- Run `npm run check`, `npm run check:plugin` and `npm run check:version` before
  pushing. CI runs those plus the cross-reference and documentation assertions.
- `AGENTS.md` is a symlink to this file. Never edit it directly.
- Record non-obvious decisions in `.agents/adr/` rather than in commit messages.

## Vendored skills

Most skills here originate from [mattpocock/skills](https://github.com/mattpocock/skills)
(MIT). Rules for them:

- Every vendored `SKILL.md` ends with the attribution footer, and has a row in
  [ATTRIBUTION.md](./ATTRIBUTION.md) saying **how** it was adapted. CI checks the row.
- Adapt by **adding** sections, not by rewriting upstream prose. That keeps a future
  upstream diff readable and keeps the credit honest.
- Adaptations encode **working conventions only** — verification discipline, scope
  discipline, git etiquette, communication style. Never anything specific to one
  employer, codebase, stack, or monorepo. These skills must be useful to a stranger.
- Vendored skills get no `docs/` page; upstream owns their documentation.

**A skill that invokes `/other-skill` needs that skill bundled.** `grill-me` and
`grill-with-docs` are thin wrappers over `grilling` and `domain-modeling` — vendoring
them without their engines shipped them dead. CI now fails on a dangling invocation.

## Frontmatter

`name` must be kebab-case and match the directory. `description` is the only thing an
agent sees when deciding whether to load a skill, so write **trigger conditions**
("Use when …"), not a summary. `npm run check` enforces both plus a 40-char floor, and
handles plain, quoted, and folded (`>-`) scalar styles.

See [.agents/invocation.md](./.agents/invocation.md) for model-invoked vs user-invoked.

## Local development

`npm run link` symlinks every skill into `~/.claude/skills/` and `~/.agents/skills/`, so
a `git pull` updates the installed copies and editing an installed skill edits the repo.
Re-run after adding or renaming a skill.

Do **not** `cp` skills into `~/.claude/skills/` — two copies drift silently.
