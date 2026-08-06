---
name: grilling
description: Interrogates a plan, design, or decision until nothing is left silently assumed. Asks one question at a time, each carrying a recommended answer and a stated confidence, ordered so no question depends on an answer not yet given. Use when a plan needs stress-testing before it is built, when an ask is underspecified, when the user says "grill me", "stress-test this", "are we sure?", or when you notice yourself filling in a requirement nobody stated.
---

# Grilling

## Overview

The expensive mistake is not a wrong answer, it is an unasked question. Every assumption you make silently becomes a decision the user never got to make, and it surfaces later as "that's not what I meant", after the code exists, when switching costs are real.

This skill closes that gap while it is still free. It is not a questionnaire and not a survey. It is an interrogation with a shape: a tree of decisions, worked in dependency order, one question at a time, until you can predict the answers before you hear them.

## When to Use

- A plan, design, or approach is about to be built and has not been stress-tested.
- The ask is missing any of: **who** it is for, **why** now, what **success** looks like, what the binding **constraint** is.
- The request is conventional rather than specific ("build me a dashboard", "make it faster") and unpacking the convention would mean guessing.
- Two reasonable values are in tension (simplicity vs flexibility, cost vs speed) and nobody has said which wins.
- You catch yourself about to write code, a spec, or a plan on top of something nobody confirmed.
- The user says: "grill me", "stress-test this", "are we sure?", "poke holes in this".

**Not for:**

- Unambiguous, self-contained asks: a rename, a typo, a one-line fix.
- Pure information requests: "how does this work?", "what does this do?"
- When the user has explicitly chosen speed over certainty. Say what you are assuming and move.
- When you already know the answers. Check that against the stop test below before believing it.

**Do not run this without a live user.** In CI, a scheduled run, a loop, or any autonomous context there is nobody to answer. If the ask is underspecified there, that is a blocker to report, not a gap to fill with guesses.

## The Process

### 1. State a hypothesis and a confidence number

Before the first question, write down what you currently think the user wants, in one sentence, with an honest confidence figure.

```
HYPOTHESIS: You want a way to know which experiments are running, and "dashboard"
            was just the word that came to mind.
CONFIDENCE: ~30%, don't know who it's for, what counts as a metric, or what done looks like.
```

Below ~70%, name what is missing on the same line. A bare number tells the user nothing they can help with; a number plus a gap tells them exactly what the interview is for.

The number keeps you honest. If you wrote a high number but cannot predict how the user reacts to your next three questions, the number is wrong. Lower it.

### 2. Build the tree: work the frontier

Map the decisions as a tree: each one branches into the decisions that hang off it. The **frontier** is every decision whose prerequisites are already settled, the questions you can ask *now* without guessing at an answer you have not heard.

Ask **one** frontier question. Wait. The answer reshapes the tree: settled decisions push the frontier outward and unblock what depended on them. Recompute, ask the next.

A question whose answer depends on another still-open question is not on the frontier. Asking it anyway forces the user to answer in a framing that may be about to change.

### 3. Attach a recommendation to every question

```
Q:     Who is actually asking "how are we doing?", you alone, the team in standup,
       or someone above you?
GUESS: You, alone. "Our metrics" reads like team framing, but people who want a
       dashboard for a team usually already know what's on it.
```

Never ask a bare question. The recommendation does three things: the user reacts to a concrete wrong answer far faster than they compose a right one from scratch; it commits you to a position you can be visibly wrong about; and it surfaces *your* assumption, which is the thing the interview exists to expose.

The risk is a polite user agreeing to be agreeable. Counter it by being visibly willing to be wrong, and by occasionally guessing in the direction you expect pushback.

### 4. Find facts yourself: never ask for one

Facts are your job. Decisions are the user's.

If a frontier question needs something you could establish yourself (what the code does, which dependency is installed, what a document already says, what last quarter's numbers were), go and find out. Use whatever this environment gives you: read the file, run the command, dispatch a subagent, search, open the connected tool. Do not ask the user to look it up and report back.

Do not block on it either. An in-flight lookup is an unsettled prerequisite: only the questions downstream of it wait. Ask the rest of the frontier meanwhile.

### 5. Listen for "should want" instead of "want"

The dangerous answer is the one that sounds like a thoughtful answer instead of being a true one. Watch for:

- Best-practice vocabulary as a goal: "scalable", "clean", "modern", "robust".
- Deference to convention: "the way most apps do it", "the standard approach".
- Hedged obligation: "I should probably…", "I think I'm supposed to…".

When you hear one, ask:

> If you didn't have to justify this to anyone, what would you actually want?

That question routinely does more work than the five before it.

### 6. Change your mind out loud

When something you find contradicts your own recommendation, say so plainly, correct it, and move on. No ceremony, no re-litigating how the mistake happened.

A grilling that never revises its own premise was theatre. Visible correction is also what earns the user's trust in the recommendations that survive.

### 7. Restate: and get a real yes

When confidence is high, write back what you now believe, tight, in the user's own words, structured so they can correct it line by line.

```
- Outcome:      <one line>
- User:         <one line, who benefits>
- Why now:      <one line, what changed>
- Success:      <one line, how we'll know>
- Constraint:   <one line, the binding limit>
- Out of scope: <one line, what we are deliberately not doing>
```

**Out of scope is not optional.** Half of all misalignment is silent disagreement about what was never going to be built.

Then get an explicit yes. These are not yes:

| They said | What it means | Do this |
|---|---|---|
| "Whatever you think." | They are delegating, so they are not at 95% either. | Re-ask as a choice between two concrete options. |
| "Sounds good." | Ambiguous. | "Anything you'd change?" Silence is not confirmation. |
| "Sure, let's go." | Often a polite exit. | Same follow-up. |
| Silence, then "ok start." | They gave up on the interview, they did not converge. | Ask what you missed. |

Fold in corrections, restate, loop until the yes is real.

## The stop test

You are done when you can answer yes to this:

> Can I predict how the user reacts to the next three questions I would ask?

Checkable, not a vibe. If yes, stop and restate. If no, ask the next question.

It has a floor. If several rounds have passed and you still cannot predict, that is information about the ask, not a reason to grind: "I've asked six questions and still can't predict your answers. Something foundational is missing. Should we step back?"

Stop when the decisions are made, not when you run out of questions.

## Style

Short and blunt. Three to five lines per point. No preamble, no essays, no restating the user's answer back to them before continuing. If your question needs three paragraphs of setup, you have not worked out what you are asking.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The ask is clear enough." | If you cannot write the desired outcome in one sentence right now, it is not clear. Write the hypothesis first, then decide. |
| "Questions waste their time." | Six targeted questions cost minutes. Building the wrong thing costs days, and they pay. |
| "I'll work it out as I build." | Discovery during implementation is rework. Switching costs after code exists are an order of magnitude higher. |
| "They said 'whatever you think'." | That is delegation, not a decision. Re-ask as a choice between two concrete options. |
| "I'll give them a menu of options." | Options work when someone knows what they want and is trading off. They do not yet. Options widen the search; a question narrows it. |
| "Attaching my guess leads them." | Leading is the point, reacting beats generating. The real risk is sycophancy, and you counter that by being visibly wrong sometimes. |
| "I'll batch these to save round trips." | A batch gets skimmed, and the third question usually depends on the first. You save a round trip and buy a wrong framing. |
| "I'll just ask them what the config says." | That is a fact, not a decision. Go and read it. |
| "We've talked enough, I get it." | Run the stop test. If you cannot predict three answers, you do not get it. |
| "They said yes, we're done." | If the yes followed a vague restate, the yes is hollow. Restate concretely and ask again. |

## Red Flags

- Two or more questions in one message. That is batching.
- A question with no recommendation attached. That is a survey.
- Asking the user for a fact you could have looked up.
- Accepting "whatever you think is best" as a final answer.
- Producing a plan, spec, or code before an explicit yes on the restate.
- A confidence number under ~70% with no gap named beside it.
- Three rounds with no visible rise in confidence, you are asking the wrong questions; reframe.
- Accepting "scalable" or "clean" as a goal without probing what it means here.
- A restate with no "out of scope" line.
- Asking a question whose answer depends on one still open in the same round.

## Verification

- [ ] A hypothesis and a confidence number were stated before the first question
- [ ] Every confidence figure under ~70% named what was missing
- [ ] Questions went out one at a time, each with a recommendation attached
- [ ] Every fact needed was found, not requested from the user
- [ ] At least one "what would you actually want?" probe ran on any convention-signalling answer
- [ ] Any contradiction of your own earlier recommendation was stated plainly and corrected
- [ ] A restate was written with all six lines, including out of scope
- [ ] The user gave an explicit yes, not "sounds good", not silence
- [ ] At the stop point, you could predict the next three answers
- [ ] Nothing was built before the yes
