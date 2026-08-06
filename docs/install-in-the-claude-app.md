# Install in the Claude app — no terminal

Some of these skills are not about code at all. `grilling` interrogates a plan until
nothing is silently assumed; `handoff` writes work up so someone else can pick it up.
Those are as useful to sales, support and marketing as to engineers, and nobody should
need a command line to get them.

In the Claude apps — [claude.ai](https://claude.ai) and Claude Desktop — a skill installs
by uploading a file. Two routes: an admin does it once for everyone, or each person does
it for themselves.

## Route A — an admin installs it for the whole team (recommended)

One upload, and the skill appears for every member automatically. Needs a **Team or
Enterprise** plan and an Owner or Admin.

1. Download the skill files from the
   [latest release](https://github.com/guillezorrilla/skills/releases/latest) — the
   `.zip` files listed under **Assets**. Do not unzip them.
2. In Claude, open **Settings → Organization settings → Skills**.
3. Turn on **Code execution and file creation**, and turn on **Skills**. Both are off by
   default, and skills do not appear for anyone until they are on.
4. Under **Organization skills**, click **+ Add** and select a `.zip`.
5. Repeat for each skill you want the team to have.

They are enabled by default for everyone; individuals can switch one off if they'd rather
not have it.

## Route B — one person installs it for themselves

Works on any plan, and needs no admin.

1. Download the `.zip` files from the
   [latest release](https://github.com/guillezorrilla/skills/releases/latest). Keep them
   zipped.
2. In Claude, open **Settings → Capabilities → Skills** (in some versions:
   **Customize → Skills**).
3. Click **Add**, then **Upload a skill**, and pick a `.zip`.
4. Claude reads the file and shows you a summary of what the skill does. Confirm.

## Then just talk normally

There is nothing to type to start one. Claude picks the skill up when what you're doing
matches it:

| Skill | Say something like | What happens |
| --- | --- | --- |
| `grilling` | "Grill me on this campaign plan." · "Poke holes in this." · "Are we sure about this pricing?" | One question at a time, each with a recommended answer attached, until it can predict your answers. Then it writes back what it believes — including what is deliberately *out* of scope — and waits for a real yes. |
| `handoff` | "Write this up so Ana can take it over." · "Summarise where we got to." | A short document split four ways: what was actually checked, what was only assumed, what was deliberately left out, and what is blocked. The assumed section is the one that saves the next person hours. |
| `efficient-fable` | "Split this across agents." · "Work through all forty of these in parallel." | Cuts the work into slices that cannot tread on each other, briefs one agent per slice, and then checks the results against something observable instead of taking "done" on trust. **Needs Cowork** — see below. |

The interview in `grilling` is meant to push back. If it asks you what you'd want if you
didn't have to justify it to anyone, that is the skill working, not going off-script.

## What is not here, and why

The rest of the set — `tdd`, `diagnosing-bugs`, `code-review-and-quality`,
`setup-team-conventions` and the others — needs to run commands, read a git repository, or
dispatch other agents. The apps deliberately give a chat none of that, so those skills
would upload cleanly and then do nothing. They live in the coding tools instead; see the
[README](../README.md).

`efficient-fable` is the one with a condition attached. Its whole job is handing bounded
work to other agents and judging what comes back, so it needs agents to hand work to —
which means **Cowork**, where Claude coordinates parallel sub-agents and can run commands
in its own sandbox. Install it and it works there.

In an ordinary chat there are no sub-agents, so it will say so in a line and then simply do
the work itself. That is the skill behaving correctly, not failing.

## Keeping up to date

Uploaded skills are a copy, not a subscription — a new release does not reach them. When
one ships, download the `.zip` again and re-upload it the same way; it replaces the old
version. An admin doing this once in Organization settings updates everyone at the same
time, which is the main practical argument for Route A.
