#!/usr/bin/env bash
# Symlink every shipped skill into the local harness skill directories, so a
# `git pull` updates installed skills and editing an installed skill edits the repo.
# Re-run after adding, removing, or renaming a skill.
#
# ponytail: replaces existing symlinks silently, refuses to clobber real
# directories. Nothing is ever deleted that this script did not create.
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# .claude and .agents are always linked — the first is Claude Code, the second is the
# cross-harness standard location. Others are linked only when their directory already
# exists, so this never invents a config dir for a harness that isn't installed.
targets=("$HOME/.claude/skills" "$HOME/.agents/skills")
for optional in "$HOME/.codex/skills" "$HOME/.kiro/skills" "$HOME/.cursor/skills" \
                "$HOME/.gemini/skills" "$HOME/.antigravity/skills"; do
  [ -d "$optional" ] && targets+=("$optional")
done

linked=0
skipped=0

for target in "${targets[@]}"; do
  mkdir -p "$target"

  # Prune links this repo owns whose target is gone — a renamed or removed skill
  # otherwise leaves a dangling symlink the harness still tries to load.
  for old in "$target"/*; do
    [ -L "$old" ] || continue
    case "$(readlink "$old")" in "$repo"/*) ;; *) continue ;; esac
    [ -e "$old" ] && continue
    rm "$old"
    echo "  prune $old (target gone)"
  done
  for src in "$repo"/skills/*/*/; do
    [ -d "$src" ] || continue
    name="$(basename "$src")"
    dest="$target/$name"

    if [ -L "$dest" ]; then
      rm "$dest"
    elif [ -e "$dest" ]; then
      echo "  skip  $dest already exists and is not a symlink — remove it by hand" >&2
      skipped=$((skipped + 1))
      continue
    fi

    ln -s "${src%/}" "$dest"
    echo "  link  $dest -> ${src%/}"
    linked=$((linked + 1))
  done
done

echo "linked $linked, skipped $skipped"
[ "$skipped" -eq 0 ] || exit 1
