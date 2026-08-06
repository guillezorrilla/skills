#!/usr/bin/env node
// Validates every skills/*/SKILL.md. A bad description is the common failure:
// it is all an agent sees when deciding whether to load the skill.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillsRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "skills",
);

// ponytail: line-scan, not a YAML parser. Frontmatter here is two scalar keys.
// Swap in a real parser only if a skill ever needs nested frontmatter.
function frontmatter(text) {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") throw new Error("missing --- frontmatter block");
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new Error("unterminated frontmatter block");
  const out = {};
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || /^\s/.test(line)) continue;
    const i = line.indexOf(":");
    if (i === -1) continue;
    out[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["'](.*)["']$/s, "$1");
  }
  return out;
}

const errors = [];
const dirs = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

if (dirs.length === 0) errors.push("skills/: no skill directories found");

for (const dir of dirs) {
  const rel = `skills/${dir}/SKILL.md`;
  let fm;
  try {
    fm = frontmatter(await readFile(path.join(skillsRoot, dir, "SKILL.md"), "utf8"));
  } catch (err) {
    errors.push(`${rel}: ${err.code === "ENOENT" ? "no SKILL.md" : err.message}`);
    continue;
  }
  if (!fm.name) errors.push(`${rel}: missing 'name'`);
  else if (fm.name !== dir) errors.push(`${rel}: name '${fm.name}' != directory '${dir}'`);
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name))
    errors.push(`${rel}: name '${fm.name}' is not kebab-case`);
  if (!fm.description) errors.push(`${rel}: missing 'description'`);
  else if (fm.description.length < 40)
    errors.push(`${rel}: description is ${fm.description.length} chars; too short to trigger reliably`);
}

if (errors.length) {
  console.error(errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${dirs.length} skill(s) valid`);
