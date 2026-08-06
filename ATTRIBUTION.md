# Attribution

Most skills here originate from **[mattpocock/skills](https://github.com/mattpocock/skills)**, MIT licensed, Copyright (c) 2026 Matt Pocock. They have been vendored and adapted; the upstream work is the substance, the adaptations are working conventions layered on top.

The MIT notice below travels with them, per the licence.

## Vendored and adapted

| Skill | Adapted how |
| --- | --- |
| `engineering/codebase-design` | Added placement-is-design and prefer-the-systemic-version sections; subagent fan-out in one message rather than waves |
| `engineering/diagnosing-bugs` | Added Phase 0 — reproduce with the reporter's exact steps and be willing to conclude "no bug"; run probes yourself rather than asking a human to check a console; committed ≠ deployed; fix only the reported defect |
| `engineering/grill-with-docs` | Unchanged wrapper; `domain-modeling` is vendored alongside it so it works standalone. Its engine, `grilling`, has since been rewritten from scratch — see below |
| `engineering/implement` | No longer commits — the human owns commits, pushes and PRs; branch-only, never the default branch; scope discipline; verification-with-evidence before claiming done; additive/fail-safe for infra |
| `engineering/improve-codebase-architecture` | Added what-counts-as-a-good-candidate (systemic over bolt-on) and an explicit does-not-rewrite-working-systems boundary; fan-out in one message |
| `engineering/tdd` | Added watch-red-watch-green, report-with-command-output, judge tests by running not type-checking, don't absorb pre-existing failures |
| `productivity/handoff` | Added the verified / assumed / left-out-on-purpose / blocked split, and that committed-not-deployed belongs under assumed |

## Vendored as dependencies, unmodified

`engineering/domain-modeling`. `grill-with-docs` is a thin wrapper that invokes it, so without it that skill would install broken.

## Original to this repo

`engineering/efficient-fable`.

`productivity/grilling` and `productivity/grill-me` were rewritten from scratch. They
replace what was vendored, and carry no upstream text: the design-tree/frontier ordering,
the hypothesis-with-a-confidence-number, the recommendation attached to every question, the
want-versus-should-want probe and the predict-the-next-three stop test are ideas taken from
several sources and written fresh, not copied prose.

`engineering/setup-team-conventions` is original prose, but follows the
explore → present → confirm → write shape of upstream's `setup-matt-pocock-skills`, and
credits it in a footer. It was rewritten around multi-forge team detection: GitHub,
Bitbucket, GitLab and Azure DevOps; a tracker detected independently of the forge; and
branch, commit, verify and review conventions read out of git history and CI rather than
asked.

---

MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
