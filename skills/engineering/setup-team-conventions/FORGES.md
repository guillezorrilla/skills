# Forges and trackers

Per-platform facts. Record the row that matches; do not generalise across rows, the
vocabulary differences are the whole reason this file exists.

## Forges

| | GitHub | Bitbucket | GitLab | Azure DevOps |
| --- | --- | --- | --- | --- |
| Host | `github.com` | `bitbucket.org` | `gitlab.com` or self-hosted | `dev.azure.com`, `*.visualstudio.com` |
| Change request | **pull request** (PR) | **pull request** (PR) | **merge request** (MR) | **pull request** (PR) |
| CLI | `gh` (official) | none official, REST API + `curl`, or `git` alone | `glab` (official) | `az repos` (Azure CLI) |
| List open | `gh pr list` | `curl` the 2.0 REST API | `glab mr list` | `az repos pr list` |
| Create | `gh pr create` | REST API `POST /pullrequests` | `glab mr create` | `az repos pr create` |
| CI config | `.github/workflows/*.yml` | `bitbucket-pipelines.yml` | `.gitlab-ci.yml` | `azure-pipelines.yml` |
| Owners file | `CODEOWNERS` | none, reviewers set per-repo in settings | `CODEOWNERS` | required reviewers in branch policy |
| Protection readable via CLI | yes, `gh api …/protection` | not without an app password / token | yes, `glab api` | yes, `az repos policy list` |

**Bitbucket has no official CLI.** Do not write instructions that assume one. Record
either the REST API call or "do it in the browser", an agent inventing `bb pr create`
wastes a turn and looks broken. Bitbucket app passwords are also deprecated in favour of
repository/workspace access tokens, so a recorded auth method should say *token*, not
*app password*.

**Say the right noun.** On GitLab, "open a PR" reads as a mistake to the team, and an
agent that greps for `.github/` on a GitLab repo finds nothing and concludes there is no
CI. The noun and the paths travel together.

**Self-hosted hosts are not detectable from the hostname.** `git.acme.com` could be any
of them. Disambiguate on CI config file, then on the presence of `.github/` vs
`.gitlab/`, then ask.

## Trackers

| | Jira | GitHub Issues | GitLab Issues | Linear | Local markdown |
| --- | --- | --- | --- | --- | --- |
| Key shape | `ABC-123` | `#123` | `#123` | `ABC-123` | filename |
| Detect from | keys in commits/branches, `browse/ABC-` links | `.github/ISSUE_TEMPLATE/`, `#n` refs | `.gitlab/issue_templates/` | `linear.app` links, `ABC-123` keys | a `.scratch/`-style directory |
| CLI | none standard, REST API, or `acli` | `gh issue` | `glab issue` | none standard, GraphQL API | filesystem |
| Auto-transition on merge | via Jira's forge integration, if installed | closes on `Fixes #n` | closes on `Closes #n` | via Linear's integration | manual |

**Jira and Linear keys look identical** (`ABC-123`). Distinguish by the link host in PR
bodies or the README, and if neither exists, ask, guessing sends an agent at the wrong
API.

**The tracker is often not the forge.** Jira+Bitbucket and Jira+GitHub are both extremely
common. Detect them independently and record both.

**Multiple project prefixes are normal.** A repo can carry `ACME-` and `PLAT-` keys at
once. Record every prefix you observed, not just the most frequent, a regex that only
matches one will silently skip the others.

## Recording auth honestly

Record what is *needed*, never a credential, and never a path to one. If a CLI is
missing or unauthenticated, that is a finding for the user to resolve, say
"`glab` not found on PATH" and stop. Do not attempt to authenticate anything.
