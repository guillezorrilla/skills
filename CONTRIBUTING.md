# Contributing

Ask an agent to run the repo-local `adding-a-skill` skill — it holds the full
checklist. The short version:

```bash
npx skills@latest init my-skill    # skills/<bucket>/my-skill/SKILL.md
npm run check                      # frontmatter
npm run check:plugin               # manifests, strict
npm run check:version              # plugin version tracks package version
npm run link                       # symlink into ~/.claude/skills, ~/.agents/skills
npm run changeset                  # describe the change for the changelog
```

A change that adds or alters a skill also needs:

- a row in its bucket `README.md` **and** the top-level `README.md`
- an explicit path in `.claude-plugin/plugin.json`'s `skills` array — the plugin cannot
  discover skills, so a missing entry ships the plugin without it
- `docs/<skill>.md` if the skill is original to this repo; vendored skills instead need
  a row in [ATTRIBUTION.md](./ATTRIBUTION.md) saying how they were adapted
- a changeset (`npm run changeset`) unless the change has no user-visible effect

CI enforces all of it, plus that no skill invokes another skill that isn't bundled.

**Do not hand-edit versions.** `npm run version` bumps `package.json` from the pending
changesets and syncs `.claude-plugin/plugin.json`. Claude Code decides when subscribers
see an update by comparing that plugin version — an unbumped change reaches nobody.

## Vendored skills

Most skills here come from [mattpocock/skills](https://github.com/mattpocock/skills)
(MIT). Adapt them by **adding** sections rather than rewriting upstream prose, so a
future upstream diff stays readable and the credit stays honest. Keep the attribution
footer, and record what you changed in `ATTRIBUTION.md`.

Adaptations encode working conventions only — verification discipline, scope discipline,
git etiquette, communication style. Nothing tied to one employer, codebase, stack, or
monorepo. These skills have to be useful to a stranger.

## Descriptions

A `description` that reads as a summary rather than as trigger conditions is the most
common reason a skill never fires. Write "Use when …".

Repo conventions: [CLAUDE.md](./CLAUDE.md). Decisions and their reasoning:
[.agents/adr/](./.agents/adr/).
