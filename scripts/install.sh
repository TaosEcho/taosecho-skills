#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/install.sh codex [--pack all|etl|harness] [--dry-run]
  ./scripts/install.sh claude [--pack all|etl|harness] [--dry-run]
  ./scripts/install.sh claude-code [--pack all|etl|harness] [--dry-run]
  ./scripts/install.sh --list

Environment overrides:
  CODEX_SKILLS_DIR=/custom/path
  CLAUDE_SKILLS_DIR=/custom/path
EOF
}

host=""
pack="all"
dry_run=0
list_only=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    codex|claude|claude-code)
      host="$1"
      ;;
    --host)
      shift
      host="${1:-}"
      ;;
    --pack)
      shift
      pack="${1:-}"
      ;;
    --dry-run)
      dry_run=1
      ;;
    --list)
      list_only=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
  shift
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

case "$host" in
  claude-code)
    host="claude"
    ;;
esac

case "$pack" in
  all|etl|harness)
    ;;
  *)
    echo "Invalid --pack value: $pack" >&2
    usage
    exit 1
    ;;
esac

sources=()
names=()
packs=()

add_install() {
  sources+=("$1")
  names+=("$2")
  packs+=("$3")
}

shopt -s nullglob

if [[ "$pack" == "all" || "$pack" == "etl" ]]; then
  for skill_dir in "$repo_root"/skills/taosecho-etl-skills/skills/taosecho-etl-*; do
    if [[ -d "$skill_dir" ]]; then
      add_install "$skill_dir" "$(basename "$skill_dir")" "etl"
    fi
  done
fi

if [[ "$pack" == "all" || "$pack" == "harness" ]]; then
  add_install "$repo_root/skills/harness-setup-skill/harness-setup" "harness-setup" "harness"
fi

if [[ "$list_only" -eq 1 ]]; then
  for i in "${!names[@]}"; do
    printf '%s\t%s\t%s\n' "${packs[$i]}" "${names[$i]}" "${sources[$i]#$repo_root/}"
  done
  exit 0
fi

case "$host" in
  codex)
    target_dir="${CODEX_SKILLS_DIR:-$HOME/.codex/skills}"
    ;;
  claude)
    target_dir="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
    ;;
  *)
    echo "Missing host: codex, claude, or claude-code" >&2
    usage
    exit 1
    ;;
esac

timestamp="$(date +%Y%m%d%H%M%S)"

echo "Target host: $host"
echo "Target directory: $target_dir"
echo "Pack: $pack"

install_dir() {
  local source_dir="$1"
  local dest_name="$2"
  local dest_dir="$target_dir/$dest_name"
  local backup_dir="$dest_dir.bak.$timestamp"

  if [[ "$dry_run" -eq 1 ]]; then
    echo "would install $dest_name -> $dest_dir"
    if [[ -e "$dest_dir" ]]; then
      echo "would backup existing $dest_name -> $backup_dir"
    fi
    return
  fi

  mkdir -p "$target_dir"

  if [[ -e "$dest_dir" ]]; then
    mv "$dest_dir" "$backup_dir"
    echo "backed up $dest_name -> $backup_dir"
  fi

  cp -R "$source_dir" "$dest_dir"
  echo "installed $dest_name -> $dest_dir"
}

for i in "${!names[@]}"; do
  install_dir "${sources[$i]}" "${names[$i]}"
done

if [[ "$dry_run" -eq 1 ]]; then
  echo "Dry run complete."
else
  echo "TaosEcho skills installed for $host."
fi
