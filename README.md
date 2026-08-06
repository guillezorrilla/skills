# skills

Personal agent skills, distributed with [`skills`](https://github.com/mattpocock/skills).

## Install

On any machine, user-level, into every agent (Claude Code, Codex, …):

```bash
npx skills@latest add guillezorrilla/skills --global --agent '*'
```

Per-repo instead of global: drop `--global`. Single skill: `--skill efficient-fable`.

Pull later changes:

```bash
npx skills@latest update --global
```

Skills are symlinked into agent directories, not copied, so editing the source here
updates every agent at once.

## Skills

| Skill | Purpose |
| --- | --- |
| `efficient-fable` | Fable 5 orchestrates; Haiku/Sonnet gather evidence, codex implements on a separate bill, Opus 5 debugs. Gate, routing table, brief/packet format, diff-only verification. |

## The one piece this does not carry

`efficient-fable` expects a `SessionStart` hook that symlinks `AGENTS.md -> CLAUDE.md`
so Codex can read repo rules. Hooks live in `~/.claude/settings.json`, which the
skills CLI does not manage. On a new machine, run once:

```bash
jq '.hooks.SessionStart += [{"hooks":[{"type":"command","statusMessage":"Linking AGENTS.md","timeout":10,"command":"d=$(jq -r \"\\(.cwd // \\\".\\\")\" 2>/dev/null || echo .); if [ -f \"$d/CLAUDE.md\" ] && [ ! -e \"$d/AGENTS.md\" ] && ln -s CLAUDE.md \"$d/AGENTS.md\" 2>/dev/null; then g=$(git -C \"$d\" rev-parse --path-format=absolute --git-common-dir 2>/dev/null); [ -n \"$g\" ] && ! grep -qxF AGENTS.md \"$g/info/exclude\" 2>/dev/null && echo AGENTS.md >> \"$g/info/exclude\"; fi; true"}]}]' \
  ~/.claude/settings.json > /tmp/s.json && mv /tmp/s.json ~/.claude/settings.json
```

Escaping that inside `jq` is fragile — easier to open `~/.claude/settings.json` on
this machine, copy the `hooks` block, and paste it there. If this grows past one
hook, add a `.claude-plugin/` + `hooks/hooks.json` to this repo and install it as a
Claude Code plugin alongside the skills CLI (what `mattpocock/skills` does).
