# Codex is a separate bill, not a better model

The premise behind `efficient-fable` was "Opus 5 is not good enough for some tasks, so
delegate the hard parts to codex." Benchmarks say the opposite, and the skill is built
on the corrected version.

## What the numbers say (August 2026)

| Model | SWE-bench Pro | Terminal-Bench 2.1 |
| --- | --- | --- |
| Claude Opus 5 | leads gpt-5.6 Sol by **+14.6 pts**, wins 9/12 benchmarks | 89.1% (max effort) |
| gpt-5.6 Sol | — | 89.5% (xhigh) |
| gpt-5.6 Terra | 1.2 pts behind Sol | 87.4% |

Opus 5 also **wins debugging outright**. Opus 5 edges Fable 5 on SWE-bench Verified
(96% vs 95%), which is the separate argument for Fable never writing code.

## Decision

Route to codex to **preserve Claude quota**, never to get better output. That inverts
the routing rule from "hard work goes to the strong model" to "pick the bill first,
then the tier within it":

- Evidence gathering → Haiku 4.5 (Claude, trivial)
- Brief-fully-specified diffs → Sonnet 5 (Claude, cheap)
- Default implementation → codex Sol at xhigh (ChatGPT bill)
- Debugging and the one hard call → Opus 5 (Claude, the reserve)
- Plan, brief, judge → Fable 5, under 10% of session tokens

## Sol over Terra, despite the benchmarks

Terra is the documented workhorse at 40% of Sol's price, and the published gap is 1.2
pts. Sol at xhigh is still the default here because **price per token is irrelevant on
a subscription** — the binding constraint is rate limits, not dollars — and the
published gap is not effort-matched. Hands-on judgement beat the aggregate. Terra
remains the overflow lane when Sol hits limits.

Revisit if the pricing model changes to per-token, at which point Terra becomes the
correct default and this ADR is wrong.

## What this rules out

Reaching for codex because a task "seems hard" is a mistake — that is what Opus 5 is
for. The gate is quota, plus the ~5–7K token wrapper floor per round trip: there is a
documented case of reverting one README line costing more in handoff than in work.
