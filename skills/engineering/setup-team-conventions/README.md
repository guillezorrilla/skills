# setup-team-conventions

## What it does

Detects how a team actually works and records it in `docs/agents/` so every skill, and
every teammate's agent, behaves the same way. Run once per repo.

It answers five questions:

| File | Answers |
| --- | --- |
| `forge.md` | GitHub, Bitbucket, GitLab or Azure DevOps; the CLI that exists for it; whether the team says "pull request" or "merge request" |
| `tracker.md` | Jira, Linear, forge issues or local files; the project prefixes; the ticket base URL |
| `conventions.md` | the default branch, branch naming, commit format, merge style, who merges |
| `verify.md` | the commands that define "done", taken from CI rather than the README |
| `review.md` | required approvals, owners file, PR template |

Almost all of it is **detected, not asked**: the forge from `git remote`, the tracker from
ticket keys in real commits, the branch and commit conventions from observed history, the
verify commands from the CI config, review rules from `CODEOWNERS` and branch protection.
You confirm; you don't fill in a questionnaire.

## When to reach for it

Once, when you start working in a repo with other people in it, before the first time
you ask an agent to implement something. Again only if the team changes tooling.

Skip it on a solo project with no tracker and no CI; there is nothing to detect and the
defaults in each skill already fit.

## Common questions

**Why not just put this in CLAUDE.md by hand?** You can, and the skill writes a pointer
block there anyway. The value is that it reads the team's actual history instead of your
memory of it, the branch convention you *think* the team uses and the one in
`git branch -r` are different surprisingly often.

**Does it change my repo?** It writes `docs/agents/*.md` and one block in
`CLAUDE.md`/`AGENTS.md`. Nothing else. It will not create a PR template, tracker labels,
CI config or a CONTRIBUTING file, in an established repo those absences are usually
deliberate. It offers; you decide.

**Why does it read git history instead of CONTRIBUTING.md?** Because documentation
records intent and history records practice. When they disagree the skill records the
history and tells you they disagreed, which is usually the more interesting finding.

**What if it can't tell?** It writes `unknown`. A confident wrong value is worse than a
gap, because the next agent acts on whatever is written. Unreadable branch protection is
recorded as unknown and treated as "review required", not as "no protection".

**My repo is mirrored across two forges.** It will spot the second remote and ask which
one reviews happen on, because that is not inferable.

## It's working if

- An agent opens a branch named the way your team names branches, without being told.
- Nobody has to say "we use merge requests, not pull requests" a second time.
- "Done" means the same commands your CI runs, not whatever the README said in 2023.
- A teammate can read `docs/agents/` in a PR and correct it, the conventions are
  reviewable, not buried in someone's local config.
- It tells you something you didn't know about your own repo. It usually does.
