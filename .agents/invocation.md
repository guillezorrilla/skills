# Model-invoked vs user-invoked

Every `SKILL.md` here is a skill. The axis that splits them is **who can reach it**.

**Model-invoked** (the default) — reachable by model or user. Omit
`disable-model-invocation`. The `description` is **model-facing**: keep rich trigger
phrasing ("Use when the user asks to …, mentions …") so auto-invocation fires. The
test: *could the model usefully reach for this on its own?*

**User-invoked** — reachable only by a human typing its name. Set
`disable-model-invocation: true` in the frontmatter (Claude Code), and
`policy.allow_implicit_invocation: false` in an `agents/openai.yaml` beside the
`SKILL.md` (Codex). The `description` becomes **human-facing**: a one-line summary
for someone browsing slash-commands, with trigger lists stripped.

A skill is user-invoked in **both** harnesses or neither — the two settings must stay
in sync, or the model can reach it in one harness and not the other.

## Current state

`efficient-fable` is **model-invoked**: it should fire when a task is big enough to
delegate, whether or not the user remembers the skill exists.

No skill here ships an `agents/openai.yaml` yet. It is only needed for Codex UI
metadata (`interface.display_name`, `interface.short_description`) or to mark a skill
user-invoked. Add one when either applies.

## Dependencies between skills

Express them as prose invocation — "Run the `/grilling` skill" — not as
`../other-skill/FILE.md` cross-references. Shared reference material lives inside the
skill that owns it; other skills reach it by invoking that skill. Cross-folder links
break the moment a skill is installed standalone, which both install routes allow.
