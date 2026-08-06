# Guille's Skills

Agent skills for engineering and productivity, grill a plan before you build it, build
it test-first, debug it systematically, and orchestrate frontier models without burning
your whole quota.

**Two ways in, two philosophies.** The Claude Code plugin installs the whole set as a
managed, read-only bundle that updates when I ship, you subscribe rather than fork.
`skills` copies editable skill files into your project, so you can hack on them and make
them your own. **Pick one**, installing both leaves you with every skill twice.

## 1. Get the skills

### Claude Code

```bash
/plugin marketplace add guillezorrilla/skills
/plugin install guillezorrilla-skills@guillezorrilla
```

Updates arrive automatically after that. This is not in Claude Code's official
marketplace, so unlike a first-party plugin the `marketplace add` line is required
once, after that it behaves the same.

### Codex

Either install as a native Codex plugin:

```bash
codex plugin marketplace add guillezorrilla/skills
codex plugin add guillezorrilla-skills@guillezorrilla-skills
```

…or take the universal route below, which also reaches Codex. Same caveat as above.
pick one, not both.

### Any agent: including Codex, Kiro and Antigravity

```bash
npx skills@latest add guillezorrilla/skills
```

Run it bare and it walks you through it: **global or per-project**, **which skills** to
take, and **which agents** to install them on. That interactive flow is the point of
this route, pick what you want and nothing else.

Flags exist to skip the prompts when you already know the answer:

| Flag | Effect |
| --- | --- |
| `-g, --global` | user-level instead of per-project |
| `-p, --project` | per-project (skip the scope prompt) |
| `-a, --agent '*'` | every agent at once, no prompt |
| `-s, --skill <names>` | named skills only |
| `--all` | everything, everywhere, no prompts |
| `-l, --list` | show what's available, install nothing |
| `--copy` | copy files instead of symlinking |

Skills are symlinked into agent directories by default, so editing the source updates
every agent at once. Update later with `npx skills@latest update --global`.

Supported agents include **Codex, Kiro, Antigravity, Cursor, Gemini CLI, Windsurf,
Copilot, Zed, Warp, opencode, Droid, Goose, Roo, Cline** and many more. `--agent '*'`
installs to every one it finds. To name a few:

```bash
npx skills@latest add guillezorrilla/skills --global --agent codex,kiro-cli,antigravity
```

Passing an unknown agent name prints the full valid list, which is the quickest way to
find the exact identifier for a harness.

### No terminal: the Claude app

Some of these are not about code. Grilling a plan until nothing is assumed, and writing
work up so someone else can continue it, are as useful in sales, support and marketing as
in engineering, and neither should require a command line.

Download the `.zip` files from the [latest release](../../releases/latest) and upload them
in Claude at **Settings → Capabilities → Skills**. On a Team or Enterprise plan an admin
can upload once in **Organization settings → Skills** and the whole team gets them
automatically.

Seven skills ship this way: all four go-to-market skills, plus `grilling`, `handoff`, and
`efficient-fable`, which comes fully alive in Cowork because Cowork has sub-agents and a
sandbox to run commands in. The rest need a git repository or a shell on your own machine,
so uploading those would install something that never fires.

**Full walkthrough, written for people who do not use a terminal:**
[docs/install-in-the-claude-app.md](./docs/install-in-the-claude-app.md).

### Which route?

| | Claude Code plugin | `npx skills add` | Claude app upload |
| --- | --- | --- | --- |
| Scope | user-level, all projects | your choice, prompted | your account, or the whole org |
| Which skills | the whole bundle | you pick | the seven that need no terminal |
| Which agents | Claude Code only | any, you pick | claude.ai and Claude Desktop |
| Editable | no, managed, read-only | yes, files land in your tree | no |
| Updates | automatic | `skills update` | re-upload the zip |
| Needs a terminal | to install | yes | never |

## 2. The skills

**User-invoked**: you type the name; the model can't reach them on its own.

| Skill | What it does |
| --- | --- |
| [`setup-team-conventions`](./skills/engineering/setup-team-conventions/SKILL.md) · [readme](./skills/engineering/setup-team-conventions/README.md) | **Run this first in a team repo.** Detects the forge (GitHub/Bitbucket/GitLab/Azure), the tracker (Jira/Linear/forge issues), branch and commit conventions, the real verify commands and the review rules, from git history and CI, not from documentation, and records them in `docs/agents/` for every other skill to read. |
| [`grill-me`](./skills/productivity/grill-me/SKILL.md) | Relentless interview to sharpen a plan before you build it. One question at a time, each with a recommended answer, each grounded in something already checked. |
| [`grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md) | Same interview, writing ADRs and a glossary as decisions land. |
| [`implement`](./skills/engineering/implement/SKILL.md) | Build from a spec or tickets. Scope discipline, evidence before claiming done, branch-only, and it never commits for you. |
| [`improve-codebase-architecture`](./skills/engineering/improve-codebase-architecture/SKILL.md) | Scan for deepening opportunities, present them as a visual HTML report, then grill through whichever you pick. Proposes; never rewrites working systems. |
| [`handoff`](./skills/productivity/handoff/SKILL.md) | Compact a session into a handoff doc, split into verified / assumed / left-out-on-purpose / blocked. |

**Model-invoked**: these fire on their own when the situation matches.

| Skill | What it does |
| --- | --- |
| [`efficient-fable`](./skills/engineering/efficient-fable/SKILL.md) · [readme](./skills/engineering/efficient-fable/README.md) | Fable plans, briefs, judges and synthesizes without touching files. Detects whether codex is available: if it is, implementation goes there on a separate bill; if not, Opus 5 implements and nothing degrades. Cheap agents gather evidence either way. |
| [`planning-and-task-breakdown`](./skills/engineering/planning-and-task-breakdown/SKILL.md) | Dependency graph, sliced vertically. Every task declares the paths it owns and the check that fails if it's wrong, so parallel work can't clobber itself. |
| [`context-engineering`](./skills/engineering/context-engineering/SKILL.md) | Curate what the agent sees and when. Cut before you add, most degradation is irrelevant context crowding out relevant context. |
| [`code-review-and-quality`](./skills/engineering/code-review-and-quality/SKILL.md) | Five axes, but verify every finding before reporting it. Ranked, with a verdict, three to five lines per comment. |
| [`code-simplification`](./skills/engineering/code-simplification/SKILL.md) | A ladder from "does this need to exist" down to the smallest thing that works. Behaviour frozen, if you edited a test, you changed behaviour. |
| [`browser-testing`](./skills/engineering/browser-testing/SKILL.md) | Verify against a real running page. Drive the browser yourself instead of asking someone to open DevTools and report back. |
| [`tdd`](./skills/engineering/tdd/SKILL.md) | Red → green at pre-agreed seams. Watch red, watch green, report the actual command output. |
| [`diagnosing-bugs`](./skills/engineering/diagnosing-bugs/SKILL.md) | Build a tight feedback loop, then work the phases. Starts by reproducing with the reporter's exact steps, and is willing to conclude there is no bug. |
| [`codebase-design`](./skills/engineering/codebase-design/SKILL.md) | Shared vocabulary for deep modules: module, interface, depth, seam, adapter, leverage, locality. |
| [`domain-modeling`](./skills/engineering/domain-modeling/SKILL.md) | Keep the domain glossary and ADRs current as decisions are made. |
| [`grilling`](./skills/productivity/grilling/SKILL.md) | The interview engine `grill-me` and `grill-with-docs` run on. |

**Go to market**, sales and customer success work that needs no terminal. One rule runs
through all four: every fact that reaches a prospect or a customer carries a source and a
date, or it does not get sent. Invented
familiarity is how AI-written outreach fails, and the reader is the one person who can check
the claim instantly.

| Skill | What it does |
| --- | --- |
| [`icp-lead-generation`](./skills/go-to-market/icp-lead-generation/SKILL.md) | Finds target accounts against the profile the team already trusts. Filters written so they can come back false, a citation on every row, and the rejects kept, because that is the only evidence the profile itself is wrong. |
| [`account-enrichment`](./skills/go-to-market/account-enrichment/SKILL.md) | A one-page dossier aimed at one decision: is there a reason to write to them now. Checks the CRM, inbox and call notes before the open web, hunts the stalled rollout rather than waiting for a trigger, and ends with the objection you will hit and what not to say. |
| [`cold-outreach`](./skills/go-to-market/cold-outreach/SKILL.md) | A first touch built on one dated fact, with one small ask, a graceful way to say no, and a compliance floor. Refuses to invent the familiarity that gets AI-written email deleted. |
| [`proactive-customer-outreach`](./skills/go-to-market/proactive-customer-outreach/SKILL.md) | Check-ins, milestone notes and win-backs in the team's own voice, learned from messages that actually got replies. Sweeps every open item rather than the loudest one, and will not send a cheerful note into an open escalation. |

`efficient-fable` runs anywhere skills and subagents exist, including Cowork. It never
probes your machine on invocation: the codex lane is decided at the first handoff, from the
tools already available. Only when it is about to hand implementation to codex does it
check for an `AGENTS.md`, codex reads that and never `CLAUDE.md`, and offer to symlink
one. It never creates files behind your back.

## 3. Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Repo conventions live in
[CLAUDE.md](./CLAUDE.md); decisions and their reasoning in
[.agents/adr/](./.agents/adr/).

## License

[MIT](./LICENSE).
