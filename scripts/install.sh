#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: ./scripts/install.sh codex|claude"
}

host="${1:-}"

case "$host" in
  codex)
    target_dir="${CODEX_SKILLS_DIR:-$HOME/.codex/skills}"
    ;;
  claude)
    target_dir="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
    ;;
  *)
    usage
    exit 1
    ;;
esac

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

install_dir() {
  local source_dir="$1"
  local dest_name="$2"
  local dest_dir="$target_dir/$dest_name"

  mkdir -p "$target_dir"
  rm -rf "$dest_dir"
  cp -R "$source_dir" "$dest_dir"
  echo "installed $dest_name -> $dest_dir"
}

for skill_dir in "$repo_root"/skills/taosecho-etl-skills/skills/taosecho-etl-*; do
  if [[ -d "$skill_dir" ]]; then
    install_dir "$skill_dir" "$(basename "$skill_dir")"
  fi
done

install_dir "$repo_root/skills/harness-setup-skill/harness-setup" "harness-setup"

echo "TaosEcho skills installed for $host."
