# Output shapes

Five files under `docs/agents/`, plus one block in the instruction file. Keep them terse
and factual, these are read by agents mid-task, so every line should be actionable.

Every file carries a **Confidence** line. `observed` means you measured it in this repo.
`assumed` means you inferred it. `unknown` means you could not tell, write that rather
than a plausible value, because the next agent acts on whatever is here.

## `docs/agents/forge.md`

```markdown
# Forge

- **Platform**: GitHub
- **Repo**: acme/api
- **Change request is called**: pull request (PR)
- **CLI**: `gh` (authenticated as of setup)
- **CI config**: `.github/workflows/`
- **Confidence**: observed, `origin` → github.com/acme/api

## Commands

- List open: `gh pr list`
- Open one: `gh pr create --base develop`
- Read a PR: `gh pr view <n>`

If the CLI is unavailable, use the REST API, do not invent a command.
```

## `docs/agents/tracker.md`

```markdown
# Issue tracker

- **System**: Jira
- **Project prefixes**: ACME, PLAT
- **Key shape**: `[A-Z]+-\d+`
- **Base URL**: https://acme.atlassian.net/browse/
- **CLI**: none, REST API only
- **Confidence**: observed, 187/200 sampled commits carry a key

## Rules

- Reference the ticket key in the branch name and the commit subject.
- Never invent a key. If the user has not given one, ask for it.
- Do not transition tickets; that is the team's workflow, not yours.
```

## `docs/agents/conventions.md`

```markdown
# Conventions

- **Default branch**: develop
- **Direct pushes to default**: not permitted
- **Branch naming**: `ACME-1234-short-slug`, observed on 14/15 remote branches
- **Commit subject**: `type(scope): subject`, ticket key in the subject, 
  142/200 sampled match, so treat as the rule and match it
- **Merge style**: squash, 50/50 recent default-branch commits single-parent
- **Who merges**: the reviewer, after approval
- **Confidence**: branch/commit observed, who-merges confirmed by the user

## Rules

- Branch from the default branch; never commit to it.
- Do not add co-author or tool-attribution trailers unless the team's own history
  shows them.
```

## `docs/agents/verify.md`

```markdown
# Verify

"Done" means these exited 0, and you pasted the output. Sourced from CI, not the README.

| What | Command | Where it comes from |
| --- | --- | --- |
| types | `pnpm typecheck` | .github/workflows/ci.yml |
| tests | `pnpm test` | .github/workflows/ci.yml |
| lint | `pnpm lint` | .github/workflows/ci.yml |

- **Package manager**: pnpm (pnpm-lock.yaml)
- **Confidence**: observed

## Rules

- CI is the authority. If the README suggests a different command, CI wins.
- Committed is not deployed. If the change only matters once running somewhere, say
  which artifact you verified against, or say you only verified locally.
- Pre-existing failures unrelated to your change are a finding to report, not work to
  absorb.
```

## `docs/agents/review.md`

```markdown
# Review

- **Required approvals**: 2
- **Owners file**: `CODEOWNERS` at repo root
- **PR template**: `.github/pull_request_template.md`, fill every section
- **Confidence**: observed via branch protection API

## Rules

- Human review is the safety system. Ask for it; do not self-approve or merge.
- Review comments: three to five lines, the problem and the fix, no preamble.
- If protection could not be read, it is recorded as unknown, assume review is
  required.
```

## The instruction-file block

Added to `CLAUDE.md` (or `AGENTS.md` when that is the one present). Pointers only.
never copy the file contents in, or the two drift and the copy is the stale one.

```markdown
## Agent skills

Team conventions detected by `setup-team-conventions`. Edit these files directly; re-run
the skill only if the team changes tooling.

- **Forge**: GitHub, PRs via `gh`. See `docs/agents/forge.md`.
- **Tracker**: Jira (ACME, PLAT). See `docs/agents/tracker.md`.
- **Conventions**: branch `ACME-1234-slug` off `develop`, conventional commits, squash
  merge. See `docs/agents/conventions.md`.
- **Verify**: `pnpm typecheck`, `pnpm test`, `pnpm lint`. See `docs/agents/verify.md`.
- **Review**: 2 approvals, CODEOWNERS. See `docs/agents/review.md`.
```
