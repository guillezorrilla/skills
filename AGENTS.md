# AGENTS.md

Read **[CLAUDE.md](./CLAUDE.md)** — it holds the conventions for working on this repo,
and applies to every agent, not just Claude Code. This file exists because Codex and
several other harnesses look for `AGENTS.md` and never read `CLAUDE.md`.

Then, depending on what you are doing:

- Adding, editing, renaming or removing a skill → [.agents/adding-a-skill.md](./.agents/adding-a-skill.md)
- Deciding whether a skill should be model- or user-invoked → [.agents/invocation.md](./.agents/invocation.md)
- Wondering why something is the way it is → [.agents/adr/](./.agents/adr/)

This is a pointer, not a copy. Do not duplicate CLAUDE.md's contents here — two
documents saying the same thing drift, and the one you are reading is the one that will
be stale.
