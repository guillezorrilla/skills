#!/usr/bin/env node
// Packs skills into .zip files for the Claude apps (claude.ai and Claude Desktop),
// where installing means uploading a file rather than running a command.
//
// The apps are a different surface, and three of their rules bite:
//   1. The zip must contain the skill FOLDER at its root, not a bare SKILL.md.
//   2. `description` is capped at 200 chars, and ours run to 450.
//   3. There are no slash commands, so a `disable-model-invocation` skill can
//      never fire, and a skill that tells the model to run another one is
//      pointing at nothing.
// So this rewrites the frontmatter from scripts/app-pack.json rather than
// copying it, and refuses to ship a skill that depends on a sibling.
import { mkdir, mkdtemp, cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(repoRoot, "skills");
const outDir = path.join(repoRoot, "dist", "claude-app");
const checkOnly = process.argv.includes("--check");

// The app upload's own limits, from the Claude help centre.
const MAX_NAME = 64;
const MAX_DESCRIPTION = 200;

// Claude Code-only frontmatter. `disable-model-invocation` is the dangerous one:
// left in, the skill uploads cleanly and then never triggers.
const STRIP_KEYS = ["disable-model-invocation", "argument-hint", "allowed-tools", "model"];

// `agents/` holds Claude Code subagent definitions — inert in the apps.
const EXCLUDE = new Set(["agents", ".DS_Store"]);

const errors = [];

async function locateSkills() {
  const found = new Map();
  const buckets = await readdir(skillsRoot, { withFileTypes: true });
  for (const bucket of buckets.filter((d) => d.isDirectory())) {
    const dirs = await readdir(path.join(skillsRoot, bucket.name), { withFileTypes: true });
    for (const dir of dirs.filter((d) => d.isDirectory())) {
      found.set(dir.name, path.join(skillsRoot, bucket.name, dir.name));
    }
  }
  return found;
}

function splitFrontmatter(text, rel) {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") throw new Error(`${rel}: missing frontmatter`);
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error(`${rel}: unterminated frontmatter`);
  return { head: lines.slice(1, end), body: lines.slice(end + 1).join("\n") };
}

const manifest = JSON.parse(await readFile(path.join(repoRoot, "scripts/app-pack.json"), "utf8"));
const packed = Object.entries(manifest.skills);
const available = await locateSkills();

if (packed.length === 0) errors.push("scripts/app-pack.json: no skills listed");

if (!checkOnly) {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
}
const staging = await mkdtemp(path.join(os.tmpdir(), "app-skills-"));

for (const [name, description] of packed) {
  const source = available.get(name);
  if (!source) {
    errors.push(`scripts/app-pack.json: '${name}' is not a skill in skills/`);
    continue;
  }
  if (name.length > MAX_NAME) errors.push(`${name}: name is ${name.length} chars, max ${MAX_NAME}`);
  if (description.length > MAX_DESCRIPTION)
    errors.push(
      `${name}: app description is ${description.length} chars, max ${MAX_DESCRIPTION} — the upload rejects it`,
    );

  const original = await readFile(path.join(source, "SKILL.md"), "utf8");
  let head, body;
  try {
    ({ head, body } = splitFrontmatter(original, `${name}/SKILL.md`));
  } catch (err) {
    errors.push(err.message);
    continue;
  }

  // A skill telling the model to run a sibling is dead here: each zip installs
  // alone and the apps have no slash commands to reach the other one anyway.
  for (const other of available.keys()) {
    if (other === name || manifest.skills[other]) continue;
    if (new RegExp(`(/|\`)${other}\\b`).test(body))
      errors.push(
        `${name}: body reaches for '${other}', which is not in the app pack — it cannot be invoked there`,
      );
  }

  const dropped = head
    .filter((l) => STRIP_KEYS.some((k) => l.startsWith(`${k}:`)))
    .map((l) => l.split(":")[0]);

  const skillDir = path.join(staging, name);
  await mkdir(skillDir, { recursive: true });
  await writeFile(
    path.join(skillDir, "SKILL.md"),
    `---\nname: ${name}\ndescription: ${description}\n---\n${body}`,
  );

  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name === "SKILL.md" || EXCLUDE.has(entry.name)) continue;
    await cp(path.join(source, entry.name), path.join(skillDir, entry.name), { recursive: true });
  }

  if (!checkOnly) {
    // System `zip`, not a dependency: -X drops the extra attributes that make a
    // macOS zip differ from a Linux one, so local and CI output match.
    await run("zip", ["-X", "-r", "-q", path.join(outDir, `${name}.zip`), name], { cwd: staging });
  }
  const note = dropped.length ? ` (dropped ${dropped.join(", ")})` : "";
  console.log(`  ${name}.zip — ${description.length}/${MAX_DESCRIPTION} chars${note}`);
}

await rm(staging, { recursive: true, force: true });

if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

const skipped = [...available.keys()].filter((n) => !manifest.skills[n]);
console.log(
  checkOnly
    ? `\n${packed.length} skill(s) valid for the Claude apps; ${skipped.length} need a coding harness.`
    : `\n${packed.length} zip(s) in dist/claude-app/ — upload at Customize > Skills.`,
);
