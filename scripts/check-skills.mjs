#!/usr/bin/env node
// Validates every skills/<bucket>/<name>/SKILL.md. A bad description is the common
// failure: it is all an agent sees when deciding whether to load the skill.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(repoRoot, "skills");

// ponytail: hand-rolled scalar reader, not a YAML dependency. Handles the three
// styles that appear in real SKILL.md frontmatter — plain, quoted, and folded
// (`>-` / `|`). Reach for a parser only if frontmatter ever needs nesting.
function frontmatter(text) {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") throw new Error("missing --- frontmatter block");
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("unterminated frontmatter block");

  const out = {};
  const body = lines.slice(1, end);
  for (let i = 0; i < body.length; i++) {
    const line = body[i];
    if (!line.trim() || /^\s/.test(line)) continue;
    const c = line.indexOf(":");
    if (c === -1) continue;
    const key = line.slice(0, c).trim();
    let value = line.slice(c + 1).trim();

    if (/^[>|][-+]?$/.test(value)) {
      // Folded/literal block: consume the following indented lines.
      const parts = [];
      while (i + 1 < body.length && /^\s+\S/.test(body[i + 1])) parts.push(body[++i].trim());
      value = parts.join(value.startsWith(">") ? " " : "\n");
    } else {
      value = value.replace(/^["'](.*)["']$/s, "$1");
    }
    out[key] = value;
  }
  return out;
}

const errors = [];
const buckets = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let count = 0;
for (const bucket of buckets) {
  const dirs = (await readdir(path.join(skillsRoot, bucket), { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (dirs.length === 0) errors.push(`skills/${bucket}/: empty bucket`);

  for (const dir of dirs) {
    const rel = `skills/${bucket}/${dir}/SKILL.md`;
    count++;
    let fm;
    try {
      fm = frontmatter(await readFile(path.join(skillsRoot, bucket, dir, "SKILL.md"), "utf8"));
    } catch (err) {
      errors.push(`${rel}: ${err.code === "ENOENT" ? "no SKILL.md" : err.message}`);
      continue;
    }
    if (!fm.name) errors.push(`${rel}: missing 'name'`);
    else if (fm.name !== dir)
      errors.push(`${rel}: name '${fm.name}' != directory '${dir}'`);
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name))
      errors.push(`${rel}: name '${fm.name}' is not kebab-case`);

    if (!fm.description) errors.push(`${rel}: missing 'description'`);
    else if (fm.description.length < 40)
      errors.push(
        `${rel}: description is ${fm.description.length} chars; too short to trigger reliably`,
      );
  }
}

if (count === 0) errors.push("skills/: no skills found");

if (errors.length) {
  console.error(errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${count} skill(s) valid across ${buckets.length} bucket(s)`);
