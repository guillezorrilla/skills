# /grilling

Interrogate a plan until nothing is left silently assumed.

## What it does

Turns an underspecified ask into a confirmed statement of intent, by asking one question
at a time — each carrying your recommended answer and an honest confidence figure —
ordered so no question depends on an answer you have not heard yet.

Four things make it work where a generic "let me ask some clarifying questions" does not:

- **A confidence number, stated up front.** Below ~70% it must name what is missing. A
  number you cannot defend is a number you have to lower.
- **A recommendation attached to every question.** People react to a concrete wrong answer
  far faster than they compose a right one, and a stated guess exposes the assumption the
  interview exists to find.
- **Facts are never asked for.** Anything the environment can answer — what the config
  says, what the code does, what the last release contained — gets looked up, not
  delegated back to you.
- **A checkable stop test.** "Can I predict your reaction to the next three questions I
  would ask?" Not a feeling about whether we have talked enough.

## When to reach for it

Before building anything whose shape is not settled: a feature with fuzzy requirements, a
design with two defensible directions, an infrastructure change where the failure mode
matters. Also whenever you notice a request is conventional rather than specific — "a
dashboard", "make it faster" — because unpacking the convention is exactly where the wrong
assumption gets made.

Skip it for a rename, a typo, a one-line fix, or anything you have already decided and
just want done.

It needs a live human. In CI, a scheduled run, or a loop there is nobody to answer, so an
underspecified ask there is a blocker to report rather than a gap to fill.

## Common questions

**Why one question at a time?** Because a batch gets skimmed, and the third question
usually depends on the answer to the first — asking them together locks in a framing that
was about to change. The ordering comes from a dependency tree: only decisions whose
prerequisites are settled are eligible to be asked.

**Doesn't attaching a guess bias the answer?** Deliberately, yes. Reacting is faster than
generating. The real risk is a polite "sure, that sounds right", and the counter is being
visibly wrong often enough that disagreeing feels safe.

**What if it recommends something and then finds out it was wrong?** It says so plainly
and corrects, without ceremony. An interview that never revises its own premise was
theatre.

**How does it end?** With a six-line restate — outcome, user, why now, success,
constraint, out of scope — and an explicit yes. "Sounds good", "whatever you think", and
silence are all treated as *not yes*, because each one usually means the alignment isn't
real.

**Why is "out of scope" mandatory?** Half of all misalignment is silent disagreement about
what was never going to be built.

## It's working if

- You get one question at a time, each with a recommendation you can just accept or reject.
- Nobody asks you to go and check what a config file says.
- The confidence figure visibly moves as the session goes on.
- It tells you when it was wrong, unprompted.
- The restate contains something you had not said out loud — and occasionally something
  you had not realised you wanted.
- It stops when the decisions are made, not when it runs out of questions.
