---
name: grill-with-docs
description: "Stress-test a plan and leave the decisions written down — a grilling session that records terminology and rulings as they land."
disable-model-invocation: true
---

# Grill With Docs

Run the `grilling` skill, and capture what it settles as it goes using `domain-modeling`.

Two things get written **inline, while the session runs** — not afterwards from memory:

- **A term that gets pinned down** goes into the project's glossary the moment it is agreed. Create the glossary at that point if it does not exist.
- **A decision with a load-bearing reason** — especially one I rejected, and why — becomes an ADR. Offer it, do not assume it: *"want this recorded so it doesn't get re-litigated?"* Only record reasons a future reader would actually need. "Not worth it right now" is ephemeral and does not earn a file.

Write them as they land. A decision captured at the end of the session is a decision reconstructed from memory, and the reasoning is the part that goes missing.

Everything else is `grilling`: one question at a time, each with a recommendation attached, facts looked up rather than asked for, and nothing built until I give an explicit yes.
