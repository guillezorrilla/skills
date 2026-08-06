# Two install routes: and no SessionStart hook

## Two routes

The set installs two ways, deliberately:

- **Claude Code plugin**, `.claude-plugin/plugin.json` + `marketplace.json`, with
  `skills` as a single path (`./skills/`). A managed, read-only bundle that updates
  when the plugin `version` is bumped. You subscribe rather than fork.
- **`npx skills@latest add guillezorrilla/skills`**: the universal installer. Prompts
  for global-vs-project scope, which skills, and which agents, then symlinks editable
  files into your tree. This is the only route that reaches **Codex**, which matters
  here because `efficient-fable` treats codex as the executor.

Installing both duplicates every skill. The README says so out loud.

A native **Codex plugin** (`.codex-plugin/plugin.json`) is deferred, not rejected. It
would be a third route with nothing the `skills` CLI does not already cover for codex
users, so it buys duplication rather than reach. Revisit if codex users start asking
for a read-only subscribe path.

## No SessionStart hook

`efficient-fable` needs an `AGENTS.md` in the target repo, because codex reads
`AGENTS.md` and never `CLAUDE.md`. A `SessionStart` hook that symlinked
`AGENTS.md -> CLAUDE.md` in every project was built, tested, and **removed**.

Reason: a published skill must not create files in a subscriber's repo. The hook fired
before anyone asked for anything, in every project, whether or not codex was involved
,  and it wrote into `.git/info/exclude` too. That is fine as a personal dotfile and
wrong as a distributed default.

Instead the skill checks for `AGENTS.md` at step 0 and offers the symlink in-band,
where the user can see it and decline. Same outcome, visible and consented.

Corollary: hooks do not travel on either install route. Anything this set needs must be
expressible inside a `SKILL.md`, or it does not belong here.
