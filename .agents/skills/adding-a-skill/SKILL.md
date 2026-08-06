---
name: adding-a-skill
description: Use in the guillezorrilla/skills repo whenever adding, editing, renaming, removing, documenting, or validating a skill — covers the skill directory, frontmatter contract, docs page, README row, version bump, and how to test both install routes before pushing.
---

# Adding a skill

Repo-only guidance. Read [../../CLAUDE.md](../../CLAUDE.md) first for the layout.

## Add

One directory per skill. Discovery walks the tree, so there is no manifest to edit.

```bash
npx skills@latest init my-skill    # scaffolds skills/my-skill/SKILL.md
$EDITOR skills/my-skill/SKILL.md
```

Then, in the same change:

1. `docs/my-skill.md` — human-facing page (see the template below).
2. A row in the README skills table.
3. Bump `version` in **both** `package.json` and `.claude-plugin/plugin.json`.
   Subscribers on the plugin route see nothing until the plugin version changes.
4. A `CHANGELOG.md` entry under the new version.

## Frontmatter contract

```yaml
---
name: my-skill          # kebab-case, must equal the directory name
description: Use when … # trigger conditions, not a summary. 40 chars minimum.
---
```

The `description` is the **only** thing an agent sees when deciding whether to load
the skill. A summary ("Helps with testing") never fires; trigger conditions ("Use
when the user reports a failing test, mentions flakiness, or asks to…") do. Decide
model-invoked vs user-invoked per [../../.agents/invocation.md](../invocation.md).

## Verify — all three, in order

```bash
npm run check          # frontmatter on every shipped skill
npm run check:plugin   # claude plugin validate . --strict
npm run link           # re-link into ~/.claude/skills and ~/.agents/skills
```

`check:plugin` is strict, so warnings fail — a missing `version` counts.

Then exercise the real install path from a scratch directory, because a skill that
validates can still fail to install:

```bash
cd "$(mktemp -d)"
npx skills@latest add <path-to-this-repo> --skill my-skill --agent claude-code
```

## Docs page template

Four sections, in this order: **What it does**, **When to reach for it**, **Common
questions**, **It's working if**. The last one is the useful one — it gives the reader
an observable test rather than a promise.

## Removing or renaming

Renaming a directory renames the skill; the frontmatter `name` must follow or
`npm run check` fails. Also update the docs page filename, the README row, and any
prose invocation from another skill. Installed copies do not rename themselves —
consumers on the `skills add` route keep the old directory until they re-run it, so
treat a rename as a breaking change and say so in the changelog.
