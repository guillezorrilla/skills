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
const pkgPath = path.join(repoRoot, "package.json");
const pluginPath = path.join(repoRoot, ".claude-plugin", "plugin.json");
const check = process.argv.includes("--check");

const pkgRaw = await readFile(pkgPath, "utf8");
const pluginRaw = await readFile(pluginPath, "utf8");
const wanted = JSON.parse(pkgRaw).version;
const current = JSON.parse(pluginRaw).version;

if (!wanted) {
  console.error("✗ package.json has no version");
  process.exit(1);
}

if (current === wanted) {
  console.log(`✓ both at ${wanted}`);
  process.exit(0);
}

if (check) {
  console.error(
    `✗ version mismatch: package.json is ${wanted}, .claude-plugin/plugin.json is ${current}\n` +
      `  run \`npm run version\` (or \`node scripts/sync-plugin-version.mjs\`) to sync`,
  );
  process.exit(1);
}

// ponytail: targeted replace on the version line, not a JSON round-trip — keeps the
// hand-maintained key order and formatting of plugin.json intact.
const next = pluginRaw.replace(
  /("version"\s*:\s*")[^"]*(")/,
  (_m, a, b) => `${a}${wanted}${b}`,
);

if (next === pluginRaw) {
  console.error("✗ could not find a \"version\" field to update in plugin.json");
  process.exit(1);
}

await writeFile(pluginPath, next);
console.log(`✓ plugin.json ${current} -> ${wanted}`);
