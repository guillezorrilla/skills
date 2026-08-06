#!/usr/bin/env node
// Copies package.json's version into .claude-plugin/plugin.json.
//
// This exists because the two versions mean different things to different consumers:
// changesets owns package.json, but Claude Code decides when plugin subscribers see an
// update by comparing plugin.json's version. Ship a change without bumping it and
// nobody on the plugin route ever receives it.
//
// `npm run version` runs this after `changeset version`.
// `--check` verifies they agree without writing — CI uses that.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

// Every manifest that carries a version. Miss one and it drifts silently.
const manifests = [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"];

const wanted = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8")).version;
if (!wanted) {
  console.error("✗ package.json has no version");
  process.exit(1);
}

let failed = false;
for (const rel of manifests) {
  const file = path.join(repoRoot, rel);
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    continue; // manifest not present in this repo — nothing to sync
  }

  const current = JSON.parse(raw).version;
  if (current === wanted) {
    console.log(`✓ ${rel} at ${wanted}`);
    continue;
  }

  if (check) {
    console.error(
      `✗ ${rel} is ${current}, package.json is ${wanted}\n` +
        `  run \`npm run version\` to sync`,
    );
    failed = true;
    continue;
  }

  // ponytail: targeted replace on the version line, not a JSON round-trip — keeps the
  // hand-maintained key order and formatting intact.
  const next = raw.replace(/("version"\s*:\s*")[^"]*(")/, (_m, a, b) => `${a}${wanted}${b}`);
  if (next === raw) {
    console.error(`✗ no "version" field found in ${rel}`);
    failed = true;
    continue;
  }

  await writeFile(file, next);
  console.log(`✓ ${rel} ${current} -> ${wanted}`);
}

process.exit(failed ? 1 : 0);
