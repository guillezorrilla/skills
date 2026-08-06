---
name: setup-team-conventions
description: "Detect how this team actually works — forge, issue tracker, branch and commit conventions, verify commands, review rules — and record it for the other skills. Run once per repo."
disable-model-invocation: true
---

# Setup Team Conventions

The other skills make assumptions: that `implement` knows whether to say "pull request" or "merge request", that `handoff` knows where a ticket lives, that "done" means a specific command exited 0. On a solo project those assumptions are harmless. On a team they are wrong in ways that produce confidently mis-shaped work — a branch named against convention, a commit missing the ticket key CI requires, a PR opened on a forge that gates merges differently.

This skill finds out, once, and writes it down where every skill and every teammate's agent can read it.

**Read the team's history, not their documentation.** A `CONTRIBUTING.md` records what someone intended in 2023; `git log` records what the team does. When they disagree, the log wins — say so, and record the log's answer.

**Record, never impose.** This skill writes `docs/agents/*.md` and one block in `CLAUDE.md`/`AGENTS.md`. It does not create PR templates, tracker labels, CI config, or CONTRIBUTING files. In an established repo those absences are usually deliberate. Offer; never do.

See [FORGES.md](FORGES.md) for per-forge and per-tracker facts, and [OUTPUTS.md](OUTPUTS.md) for the exact shape of each file you write.

## Process

### 1. Detect

Run the checks below before asking anything. Anything you can answer from the repo is not a question.

**Forge** — `git remote -v`. Match the host: `github.com` → GitHub, `bitbucket.org` → Bitbucket, `gitlab.com` or a self-hosted GitLab → GitLab, `dev.azure.com`/`visualstudio.com` → Azure DevOps. A self-hosted host is ambiguous; look for `.gitlab-ci.yml`, `bitbucket-pipelines.yml`, or `.github/` to disambiguate, and ask if still unclear. Multiple remotes means a mirror — ask which one the team's reviews happen on.

**Tracker** — in order of evidence strength:

1. Ticket keys in real commit subjects and branch names: `git log --oneline -200` and `git branch -r --format='%(refname:short)'`. A recurring `[A-Z][A-Z0-9]+-\d+` is a Jira-style key; capture the actual project prefixes you see, not a guess.
2. Links in merged PR/MR bodies (`gh pr list --state merged --limit 20 --json body` where available).
3. `.github/ISSUE_TEMPLATE/`, `.gitlab/issue_templates/` → the forge's own issues.
4. A tracker URL in `README.md` or `CONTRIBUTING.md`.

The tracker is frequently **not** the forge — Jira with Bitbucket, Jira with GitHub, and Linear with GitHub are all common. Do not infer one from the other.

**Branch convention** — from `git branch -r` and merge-commit subjects. Report the dominant observed pattern with a real example, e.g. `ABC-1234-short-slug`, `feature/short-slug`, `username/topic`. Note the default branch (`git symbolic-ref refs/remotes/origin/HEAD`) — it is often `develop` or `trunk`, not `main`, and getting this wrong is how an agent pushes to the wrong place.

**Commit convention** — sample `git log --format=%s -100`. Measure, don't eyeball: what share match `type(scope): subject`? What share carry a ticket key, and in what position? Report the share, because "mostly conventional" and "always conventional" call for different instructions.

**Verify commands** — the commands that decide whether work is done. Read the CI config, and prefer what CI runs over what the README suggests:

- `.github/workflows/*.yml`, `bitbucket-pipelines.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `azure-pipelines.yml`
- the scripts those call, in `package.json`, `Makefile`, `justfile`, `pyproject.toml`, `Cargo.toml`, `build.gradle`

Note the package manager from its lockfile and record commands in that form. If the repo has a lockfile for one manager and CI invokes another, record the CI one and flag the mismatch.

**Review rules** — `CODEOWNERS` (root, `.github/`, `.gitlab/`), PR/MR templates, and branch protection if the CLI can read it (`gh api repos/{owner}/{repo}/branches/{branch}/protection`). Record required approvals and whether the default branch accepts direct pushes. A 403 means you lack permission, not that protection is absent — record "unknown", never "none".

**Merge style** — from the last ~50 commits on the default branch: are they squashes, merge commits, or a linear rebase history? This tells `implement` what a finished branch should look like.

### 2. Present

Show one table: what you found, the evidence, and your confidence. Be explicit about the difference between observed and assumed.

```
forge        GitHub                  origin → github.com/acme/api        certain
tracker      Jira (ACME, PLAT)       187/200 commits carry a key         certain
branch       ACME-1234-slug          14/15 remote branches match        likely
default      develop                 origin/HEAD → develop              certain
commits      conventional + key      142/100 sampled, key in subject    likely
verify       pnpm test, pnpm lint    from .github/workflows/ci.yml      certain
review       2 approvals, CODEOWNERS branch protection API              certain
merge        squash                  50/50 single-parent on develop     certain
```

Then ask only what detection could not settle, one question at a time, each with your recommended answer. Typical residue: which remote is canonical on a mirrored repo; whether a low-confidence commit convention is a rule or a habit; who is allowed to merge; whether an unreadable protection setting matters.

If detection settled everything, say so and ask one question only: does this look right?

### 3. Confirm

Show the drafts — the five `docs/agents/*.md` files and the `## Agent skills` block — and let the user edit before anything is written. This is going into a shared repo; a teammate will read it in a PR.

### 4. Write

Pick the instruction file: edit `CLAUDE.md` if it exists, else `AGENTS.md`, else ask which to create — never create one when the other is already there, and never create both.

If an `## Agent skills` block already exists, update it in place rather than appending a second one. Leave the surrounding sections alone.

Write the files per [OUTPUTS.md](OUTPUTS.md). Record **unknown** as unknown; a confident wrong value is worse than a gap, because the next agent will act on it.

### 5. Done

Tell the user which skills now read which files, and that `docs/agents/*.md` can be hand-edited later — re-running this skill is only for when the team changes tooling.

Suggest committing it on a branch as a normal PR, so the team sees and agrees to the conventions being recorded on their behalf. Do not commit it yourself.

---

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) 2026 Matt Pocock) — this skill follows the explore/present/confirm/write shape of its `setup-matt-pocock-skills`, rewritten for multi-forge team detection. See [ATTRIBUTION.md](../../../ATTRIBUTION.md).
