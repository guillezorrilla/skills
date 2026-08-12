<!-- The full checklist is .agents/adding-a-skill.md — this is the short form CI enforces. -->

## What and why

<!-- What changes, and the problem it solves. Link an issue if there is one: Closes #NN -->

## If this adds or alters a skill

- [ ] Row in the bucket `README.md` **and** the top-level `README.md`
- [ ] Explicit path in `.claude-plugin/plugin.json`'s `skills` array
      <!-- The plugin cannot discover skills. A missing entry ships the plugin without it. -->
- [ ] `skills/<bucket>/<skill>/README.md`, **or** Overview + When to Use in `SKILL.md`
      <!-- Thin entry points under 20 lines are exempt from both. -->
- [ ] `description` is written as trigger conditions ("Use when …"), not as a summary
      <!-- A description that reads as a summary is the most common reason a skill never fires. -->
- [ ] Prose is original — ideas reused, wording not

## Always

- [ ] `npm run check`
- [ ] `npm run changeset` — unless the change has no user-visible effect
      <!-- Unbumped changes reach nobody: subscribers update on the plugin version. -->

<!-- Do not hand-edit versions. `npm run version` bumps package.json and syncs plugin.json. -->
