# Changesets

This folder holds pending changesets — one markdown file per user-visible change,
written before merge and consumed at release.

Nothing is published to npm. Changesets is here for two things:

1. It generates `CHANGELOG.md` from the changesets merged since the last release.
2. It bumps the version, which is **load-bearing**: Claude Code decides when plugin
   subscribers see an update by comparing `.claude-plugin/plugin.json`'s `version`.
   `npm run version` runs `changeset version` and then
   `scripts/sync-plugin-version.mjs`, which copies the new version across.

## Adding one

```bash
npm run changeset
```

Pick a bump — `patch` for a fix or wording change, `minor` for a new skill or a real
behaviour change to an existing one, `major` for a rename or removal (consumers on the
`skills add` route keep the old directory until they re-run it, so a rename breaks them).

Write the summary for **someone deciding whether to update**, not for the commit log.
Name the skill, say what changed about it, and say what they should now expect.

A change with no user-visible effect — CI, internal docs, this file — needs no changeset.

Read more: <https://github.com/changesets/changesets>
