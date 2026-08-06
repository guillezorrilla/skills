# Guille's Skills

Agent skills for frontier-model orchestration.

**Two ways in, two philosophies.** The Claude Code plugin installs the whole set as
a managed, read-only bundle that updates when I ship — you subscribe rather than
fork. `skills` copies editable skill files into your project, so you can hack on
them and make them your own. **Pick one** — installing both leaves you with every
skill twice.

## 1. Get the skills

### Claude Code

```bash
/plugin marketplace add guillezorrilla/skills
/plugin install guillezorrilla-skills@guillezorrilla
```

Updates arrive automatically after that. This is not in Claude Code's official
marketplace, so unlike a first-party plugin the `marketplace add` line is required
once — after that it behaves the same.

### Codex, and other agents

```bash
npx skills@latest add guillezorrilla/skills
```

The installer lets you pick which skills to take and which agents to install them
on. Add `--global` for user-level instead of per-project, and `--agent '*'` to hit
every agent at once:

```bash
npx skills@latest add guillezorrilla/skills --global --agent '*'
```

Skills are symlinked into agent directories rather than copied, so editing the
source updates every agent. Pass `--copy` if you would rather have independent
files. Update later with `npx skills@latest update --global`.

## 2. The skills

| Skill | Purpose |
| --- | --- |
| `efficient-fable` | Fable 5 plans, briefs, judges and synthesizes. Cheap Claude agents gather evidence, codex implements on a separate bill, Opus 5 debugs. Ships the delegation gate, the model routing table, the brief/packet format, and diff-only verification. |

`efficient-fable` needs an `AGENTS.md` in your repo so codex can read your rules —
the skill checks for one and offers to symlink `AGENTS.md -> CLAUDE.md` when it
runs. It never creates files behind your back.

## 3. Adding or editing a skill

One directory per skill, discovered by walking the tree — no manifest to update,
and both install routes pick it up.

```bash
npx skills@latest init my-skill       # scaffolds skills/my-skill/SKILL.md
$EDITOR skills/my-skill/SKILL.md
npm run check                         # validates frontmatter on every skill
```

`SKILL.md` frontmatter needs `name` (kebab-case, matching the directory) and
`description`. The description is the only thing an agent sees when deciding
whether to load the skill, so write it as trigger conditions — "Use when …" — not
as a summary.

Test a change before pushing:

```bash
npx skills@latest add ./ --skill my-skill --agent claude-code
```

## License

MIT
