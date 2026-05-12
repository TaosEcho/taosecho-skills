#!/usr/bin/env python3
"""Preflight scanner for harness-setup.

Prints compact JSON describing existing harness files, entrypoints, and git state.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def run(cmd: list[str], cwd: Path) -> tuple[int, str]:
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(cwd),
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            timeout=10,
            check=False,
        )
        return proc.returncode, proc.stdout.strip()
    except Exception as exc:  # pragma: no cover - defensive CLI output
        return 1, f"{type(exc).__name__}: {exc}"


def find_files(root: Path, patterns: list[str]) -> list[str]:
    found: list[str] = []
    for pattern in patterns:
        for path in root.glob(pattern):
            if path.is_file():
                found.append(str(path.relative_to(root)))
    return sorted(set(found))


def file_details(root: Path, files: list[str]) -> list[dict[str, object]]:
    details: list[dict[str, object]] = []
    for rel in files:
        path = root / rel
        try:
            stat = path.stat()
        except OSError:
            continue
        modified = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat()
        details.append({"path": rel, "modified": modified, "size": stat.st_size})
    return details


def skill_version() -> str | None:
    skill_file = Path(__file__).resolve().parents[1] / "SKILL.md"
    if not skill_file.exists():
        return None
    match = re.search(r'^version:\s*"?([^"\n]+)"?', skill_file.read_text(encoding="utf-8"), re.MULTILINE)
    return match.group(1).strip() if match else None


def main() -> int:
    root = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
    if not root.exists() or not root.is_dir():
        print(json.dumps({"ok": False, "error": f"invalid project root: {root}"}, ensure_ascii=False))
        return 2

    harness_files = find_files(root, ["docs/harness/*.md", ".codex/harness/*.md"])
    entrypoints = find_files(root, ["AGENTS.md", "CLAUDE.md", ".cursorrules", ".cursor/rules/*.md"])
    project_docs = find_files(
        root,
        [
            "README.md",
            "PROJECT.md",
            "WORKPLAN.md",
            "docs/README.md",
            "docs/*.md",
            "plans/*.md",
            "planning/*.md",
            "logs/work-log.md",
            "work-log.md",
        ],
    )
    learnings_files = find_files(root, ["docs/harness/learnings.jsonl", ".codex/harness/learnings.jsonl"])

    git_root = None
    git_dirty = None
    git_status = None
    code, out = run(["git", "rev-parse", "--show-toplevel"], root)
    if code == 0 and out:
        git_root = out
        _, status = run(["git", "status", "--short"], root)
        git_status = status.splitlines()
        git_dirty = bool(git_status)

    result = {
        "ok": True,
        "skill_version": skill_version(),
        "project_root": str(root),
        "candidate_state_files": harness_files,
        "candidate_state_file_details": file_details(root, harness_files),
        "entrypoints": entrypoints,
        "entrypoint_details": file_details(root, entrypoints),
        "project_docs": project_docs,
        "project_doc_details": file_details(root, project_docs),
        "learnings_files": learnings_files,
        "git": {
            "root": git_root,
            "dirty": git_dirty,
            "status": git_status,
        },
        "recommendation": {
            "existing_harness_decision": "choose update, supersede, or separate" if harness_files else "create new",
            "default_state_file_when_empty": "docs/harness/{task-slug}.md",
            "entrypoint": entrypoints[0] if entrypoints else "AGENTS.md or CLAUDE.md",
        },
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
