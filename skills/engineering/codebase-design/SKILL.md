---
name: codebase-design
description: Provides the shared vocabulary and tests for designing deep modules, module, interface, depth, seam, adapter, leverage, locality, plus how to choose where a seam goes and how to test across one. Use when designing or reshaping a module's interface, deciding where a boundary belongs, making code more testable, or when another skill needs these terms used precisely.
---

# Codebase Design

## Overview

A **deep module** is a lot of behaviour behind a small interface, sitting at a clean boundary, testable through that interface. Designing for depth buys leverage for callers, locality for maintainers, and testability for everyone.

This is a reference to consult, not a session to run. Its main job is to make everyone use the same words for the same things, because most design arguments are two people using one word for two ideas.

## When to Use

- Designing a new module, or reshaping an existing interface.
- Deciding where a boundary belongs, which is a separate decision from what sits behind it.
- Code is hard to test and you suspect the shape, not the tests.
- Another skill needs these terms used precisely.

**Not for:** finding candidates to improve across a codebase (`improve-codebase-architecture`), reducing complexity in code that already works (`code-simplification`), or naming domain concepts (`domain-modeling`).

## Vocabulary

Use these words exactly. Do not substitute "component", "service", "API" or "boundary", the imprecision is what makes design discussions circular.

**Module**: anything with an interface and an implementation. Deliberately scale-agnostic: a function, a class, a package, a slice spanning tiers. *Avoid:* unit, component, service.

**Interface**: everything a caller must know to use it correctly. Not just the type signature: also invariants, ordering constraints, error modes, required configuration, performance characteristics. *Avoid:* API, signature, both too narrow, they mean only the type-level surface.

**Implementation**: what is inside. Distinct from adapter: a thing can be a small adapter with a large implementation (a Postgres repository) or a large adapter with a small one (an in-memory fake).

**Depth**: leverage at the interface: how much behaviour a caller or test can exercise per unit of interface they must learn. **Deep** means a lot of behaviour behind a small interface. **Shallow** means the interface is nearly as complex as what it hides.

**Seam** *(Michael Feathers)*, a place where behaviour can be changed without editing in that place. It is the *location* of an interface. Where to put it is its own decision. *Avoid:* boundary, which collides with DDD's bounded context.

**Adapter**: a concrete thing satisfying an interface at a seam. Describes the *role* it fills, not what is inside it.

**Leverage**: what callers get from depth: more capability per unit of interface learned. One implementation pays back across N call sites and M tests.

**Locality**: what maintainers get from depth: change, bugs, knowledge and verification concentrate in one place instead of spreading across callers. Fix once, fixed everywhere.

How they relate: a module has one interface; depth is a property of the module measured against that interface; a seam is where the interface lives; an adapter sits at a seam and satisfies the interface; depth produces leverage for callers and locality for maintainers.

## The tests

**The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep. Apply this to anything you suspect is shallow, "yes, concentrates" is the signal you want.

**The interface is the test surface.** Callers and tests cross the same seam. If you want to test *past* the interface, the module is probably the wrong shape, that urge is diagnostic, not an inconvenience to route around.

**One adapter is a hypothetical seam; two is a real one.** Do not introduce a seam until something actually varies across it. Three adapters means the design should have moved rather than grown another one.

**Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, swappable parts, they simply are not part of its interface. A module can have internal seams, private to its implementation and used by its own tests, as well as the external seam at its interface.

## Designing for testability

Accept dependencies rather than constructing them, and return results rather than performing side effects. Both make the seam explicit and the test trivial:

```
processOrder(order, paymentGateway)    // testable: the gateway is a seam
processOrder(order)                    // not: it constructs StripeGateway inside

calculateDiscount(cart): Discount      // testable: returns a value
applyDiscount(cart): void              // not: mutates and returns nothing
```

Fewer methods means fewer tests. Fewer parameters means simpler setup.

## Choosing a seam by dependency type

Where a seam belongs depends on what is on the other side of it:

- **In-process and deterministic**: no seam. Use the real thing; a seam here buys nothing and costs indirection.
- **Local but substitutable** (filesystem, clock, RNG), a narrow seam, with a real implementation for production and a real-but-controlled one for tests. A temp directory and a fixed clock, not a mock.
- **Remote but owned** (your own database, your own service), a seam at the port, with a real adapter and a local substitute. You control the contract, so keep the substitute honest against it.
- **Truly external** (a payment provider, a third-party API), a seam, and a fake at the boundary. You cannot control its behaviour, so pin your assumptions about it explicitly.

**Replace, do not layer.** When testing across a seam, substitute the adapter, do not wrap the real one in a test-only shim and assert on the wrapper. A layer added for testing becomes production code nobody meant to ship, and it makes the seam ambiguous: two things now claim the same role.

## Placement is part of the design

Where a module *lives* is a design decision, not a filing decision. Place it by the role it plays, not by which directory was convenient or which file was already open.

A module in the wrong layer still works, which is exactly why it survives, and it teaches everyone after you that the layer means nothing. Two consequences: honour a codebase's directory-level distinctions even when they feel academic, because the cost is the precedent rather than the file; and if you cannot say which role a module plays, its interface is not decided yet.

## Prefer the systemic form

Between two designs that both work, take the one that removes the category of problem:

- **Derive, do not enumerate.** A mapping table or `if` chain that grows by one entry per case is the design telling you it is wrong.
- **Extend the general path** rather than adding a special path beside it.
- **Change the design** rather than wrapping it.

When the systemic version is genuinely disproportionate, say so explicitly, so the shortcut is a recorded decision rather than a default nobody chose.

## Design it twice

For an interface that matters, produce **two or three genuinely different designs** before choosing, not one design and two variations of it. Different means different seam placement, different responsibility split, different things hidden.

Explore them in parallel: dispatch the alternatives in one message rather than in waves, then compare on depth, locality and seam placement. Present the comparison, including what each one gives up. The second design usually improves the first even when you do not pick it, because it shows you which parts of the first were incidental.

## Rejected framings

- **Depth as a ratio of implementation lines to interface lines.** Rewards padding the implementation. Use depth-as-leverage.
- **"Interface" as the language's `interface` keyword, or a class's public methods.** Too narrow, interface here includes every fact a caller must know.
- **"Boundary" as a synonym for seam.** Overloaded with DDD's bounded context. Say seam, or say interface.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll extract an interface so it's testable." | With one implementation that is a hypothetical seam. Indirection with no variation behind it makes code harder to follow, not easier to test. |
| "This module is small, so it's simple." | Small and shallow are different. A thin pass-through with a wide interface is the worst case. |
| "I'll mock it so the test is fast." | If it is fast and deterministic already, use the real thing. Mock at the edge of your control, not inside it. |
| "I need to test the internals." | That urge is the diagnostic. Either the behaviour belongs at the interface, or you are testing something that should not be pinned. |
| "I'll add a test-only wrapper around it." | Now two things claim the same role and the wrapper ships. Replace the adapter instead. |
| "The directory doesn't really matter." | It is the only signal the next person has about what a module is for. Wrong placement is a lie told at scale. |
| "One design is enough, it's obviously right." | Then a second costs little and confirms it. Obviousness before comparison is usually familiarity. |
| "It's shallow but stable, I'll deepen it." | Stable and off the change path means deepening spends risk to buy nothing. Leave it. |

## Red Flags

- An interface extracted with exactly one implementation and no second on the horizon.
- A test reaching past an interface into internals.
- A test-only wrapper layered over a real adapter.
- A module whose interface is nearly as large as its implementation.
- A mapping table or conditional chain that grows by one entry per new case.
- A third adapter added at a seam that already has two.
- A module placed where it was convenient rather than where its role says.
- One design presented as the only option for a decision that is expensive to undo.
- The words component, service, API or boundary used where module, interface or seam was meant.

## Verification

- [ ] The vocabulary is used precisely, module, interface, depth, seam, adapter, leverage, locality
- [ ] The deletion test was applied to anything suspected of being shallow
- [ ] Every seam introduced has real variation across it, not hypothetical variation
- [ ] Dependencies are accepted, not constructed inside the module
- [ ] Seam choice matches the dependency type, with real implementations used wherever fast and deterministic
- [ ] Tests replace adapters rather than layering wrappers over them
- [ ] Placement follows the module's role, not convenience
- [ ] For a decision that is expensive to undo, at least two genuinely different designs were compared
- [ ] Where a shortcut was taken over the systemic form, it is stated as a decision
