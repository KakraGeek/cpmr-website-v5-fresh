from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

try:
    import yaml
except ImportError:
    print("Missing dependency: PyYAML")
    print("Install it with: pip install pyyaml")
    sys.exit(1)

ROOT = Path.cwd()
DOCS_DIR = ROOT / "docs"
STORIES_DIR = DOCS_DIR / "stories"
AUTOMATION_DIR = ROOT / "automation"
OUT_DIR = AUTOMATION_DIR / "out"

ACTIVE_STORY_FILE = AUTOMATION_DIR / "active_story.yml"
EXECUTION_HISTORY_FILE = AUTOMATION_DIR / "execution_history.yml"
ARCHITECT_GATE_FILE = AUTOMATION_DIR / "architect_gates.yml"
BACKLOG_AUDIT_FILE = AUTOMATION_DIR / "backlog_integrity.yml"

STATUSES = [
    "TODO", "READY", "IN_PROGRESS", "DEV_COMPLETE", "ANALYST_REVIEW",
    "ARCHITECT_REVIEW", "QA_FAILED", "BLOCKED", "VERIFIED", "DONE"
]
EXECUTABLE = ["QA_FAILED", "READY", "TODO"]

DEFAULT_CONTEXT_FILES = [
    "docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md",
    "docs/01_planning/02_prd.md",
    "docs/02_design/03_ux_blueprint.md",
    "docs/02_design/DESIGN.md",
    "docs/03_architecture/04_architecture.md",
    "docs/03_architecture/06_project_context.md",
    "docs/04_stories/05_story_map.md",
]

REQUIRED_FIELDS = [
    "id", "epic", "sprint_order", "title", "status", "user_story",
    "acceptance_criteria", "tasks", "dependencies", "context_files",
    "execution", "qa_checklist"
]
REQUIRED_EXECUTION_FIELDS = [
    "files_allowed", "files_forbidden", "verification_commands"
]


def now() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def ensure_dirs() -> None:
    STORIES_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    AUTOMATION_DIR.mkdir(parents=True, exist_ok=True)


def read_yaml(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    if not isinstance(data, dict):
        raise ValueError(f"YAML root must be a mapping: {path}")
    return data


def write_yaml(path: Path, data: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True)


def story_files() -> List[Path]:
    ensure_dirs()
    return sorted(list(STORIES_DIR.glob("*.yml")) + list(STORIES_DIR.glob("*.yaml")))


def normalize_status(value: Any) -> str:
    if value is None:
        return "TODO"
    return str(value).strip().upper()


def append_event(event: str, story_id: str = "") -> None:
    data = read_yaml(EXECUTION_HISTORY_FILE)
    events = data.get("events", [])
    events.append({"timestamp": now(), "story_id": story_id, "event": event})
    data["events"] = events
    write_yaml(EXECUTION_HISTORY_FILE, data)


def validate_story(story: Dict[str, Any], path: Path) -> List[str]:
    errors: List[str] = []
    for field in REQUIRED_FIELDS:
        if field not in story:
            errors.append(f"{path.name}: missing required field {field}")
    status = normalize_status(story.get("status"))
    if status not in STATUSES:
        errors.append(f"{path.name}: invalid status {status}")
    execution = story.get("execution", {})
    if not isinstance(execution, dict):
        errors.append(f"{path.name}: execution must be a mapping")
    else:
        for field in REQUIRED_EXECUTION_FIELDS:
            if field not in execution:
                errors.append(f"{path.name}: missing execution.{field}")
    if "sprint_order" in story:
        try:
            int(story.get("sprint_order"))
        except Exception:
            errors.append(f"{path.name}: sprint_order must be an integer")
    return errors


def load_all_stories() -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for path in story_files():
        story = read_yaml(path)
        story["__path"] = path
        items.append(story)
    return items


def done_ids() -> Set[str]:
    ids: Set[str] = set()
    for story in load_all_stories():
        if normalize_status(story.get("status")) == "DONE":
            ids.add(str(story.get("id")))
    return ids


def dependencies_done(story: Dict[str, Any]) -> bool:
    deps = story.get("dependencies", []) or []
    completed = done_ids()
    return all(str(dep) in completed for dep in deps)


def sort_key(story: Dict[str, Any]):
    return (int(story.get("sprint_order", 999999)), str(story.get("id", "")))


def find_next_story() -> Optional[Path]:
    stories = sorted(load_all_stories(), key=sort_key)
    for status in EXECUTABLE:
        for story in stories:
            errors = validate_story(story, story["__path"])
            if errors:
                raise ValueError("Backlog validation failed before selection:\n" + "\n".join(errors))
            if normalize_status(story.get("status")) != status:
                continue
            if not dependencies_done(story):
                continue
            return story["__path"]
    return None


def set_status(path: Path, status: str) -> None:
    story = read_yaml(path)
    story["status"] = status
    story["last_updated"] = now()
    write_yaml(path, story)
    append_event(f"status -> {status}", str(story.get("id")))
    print(f"Updated {story.get('id')} to {status}")


def save_active(path: Path) -> None:
    story = read_yaml(path)
    write_yaml(ACTIVE_STORY_FILE, {
        "active_story": path.relative_to(ROOT).as_posix(),
        "story_id": story.get("id"),
        "title": story.get("title"),
        "status_at_activation": story.get("status"),
        "updated_at": now(),
    })


def active_path() -> Optional[Path]:
    data = read_yaml(ACTIVE_STORY_FILE)
    active = data.get("active_story")
    if not active:
        return None
    path = ROOT / active
    if not path.exists():
        return None
    return path


def clear_active() -> None:
    if ACTIVE_STORY_FILE.exists():
        ACTIVE_STORY_FILE.unlink()


def context_text(story: Dict[str, Any]) -> str:
    context_files = story.get("context_files") or DEFAULT_CONTEXT_FILES
    chunks: List[str] = []
    for rel in context_files:
        path = ROOT / str(rel)
        if not path.exists():
            chunks.append(f"\n\n## {rel}\nFILE NOT FOUND. Stop and ask human operator to restore this file.\n")
        else:
            chunks.append(f"\n\n## {rel}\n{path.read_text(encoding='utf-8', errors='ignore')}\n")
    return "".join(chunks)


def format_list(items: Any) -> str:
    if not items:
        return "- None specified"
    if isinstance(items, str):
        return items
    if isinstance(items, list):
        return "\n".join(f"- {item}" for item in items)
    return str(items)


def build_dev_prompt(path: Path) -> str:
    story = read_yaml(path)
    execution = story.get("execution", {})
    return f"""# BMAD DEV AGENT EXECUTION PROMPT

You are the BMAD Developer Agent for the CPMR fresh Astro rebuild.
You must implement exactly ONE story.

# STORY FILE
{path.relative_to(ROOT).as_posix()}

# STORY METADATA
Story ID: {story.get('id')}
Epic: {story.get('epic')}
Sprint Order: {story.get('sprint_order')}
Title: {story.get('title')}
Current Status: {story.get('status')}
Architect Gate Required: {story.get('architect_gate_required', 'No')}

# USER STORY
{story.get('user_story')}

# ACCEPTANCE CRITERIA
{format_list(story.get('acceptance_criteria'))}

# IMPLEMENTATION TASKS
{format_list(story.get('tasks'))}

# DEPENDENCIES
{format_list(story.get('dependencies', []))}

# FILES ALLOWED
{format_list(execution.get('files_allowed', []))}

# FILES FORBIDDEN
{format_list(execution.get('files_forbidden', []))}

# VERIFICATION COMMANDS THAT MUST PASS
{format_list(execution.get('verification_commands', []))}

# QA CHECKLIST AWARENESS
{format_list(story.get('qa_checklist'))}

# AUTHORITATIVE CONTEXT
{context_text(story)}

# STRICT EXECUTION RULES
1. Implement only this story.
2. Do not implement future stories.
3. Do not modify forbidden files.
4. Preserve Astro static output compatibility.
5. Do not introduce SSR-only behavior.
6. Do not invent UI styles outside DESIGN.md.
7. Do not hardcode final editable content into components.
8. Stop if authoritative documents conflict.
9. Return a clear implementation summary.
10. Do not mark DONE.

# REQUIRED OUTPUT AFTER IMPLEMENTATION
1. Story implemented: Yes or No
2. Files changed
3. Acceptance criteria coverage
4. Verification commands to run
5. Risks or unresolved issues
6. Recommended next step
"""


def build_qa_prompt(path: Path) -> str:
    story = read_yaml(path)
    execution = story.get("execution", {})
    return f"""# BMAD ANALYST ACCEPTANCE VALIDATION PROMPT

You are performing the CPMR acceptance validation gate.
Validate exactly ONE implemented story.
Do not approve unless every acceptance criterion is satisfied.

# STORY FILE
{path.relative_to(ROOT).as_posix()}

# STORY METADATA
Story ID: {story.get('id')}
Epic: {story.get('epic')}
Sprint Order: {story.get('sprint_order')}
Title: {story.get('title')}
Current Status: {story.get('status')}
Architect Gate Required: {story.get('architect_gate_required', 'No')}

# USER STORY
{story.get('user_story')}

# ACCEPTANCE CRITERIA
{format_list(story.get('acceptance_criteria'))}

# QA CHECKLIST
{format_list(story.get('qa_checklist'))}

# FILES ALLOWED
{format_list(execution.get('files_allowed', []))}

# FILES FORBIDDEN
{format_list(execution.get('files_forbidden', []))}

# VERIFICATION COMMANDS
{format_list(execution.get('verification_commands', []))}

# AUTHORITATIVE CONTEXT
{context_text(story)}

# VALIDATION TASK
Check:
1. Every acceptance criterion.
2. Every QA checklist item.
3. Forbidden file changes.
4. DESIGN.md alignment.
5. Architecture alignment.
6. Static build compatibility.
7. Accessibility expectations.
8. Responsive behavior.
9. Raw metadata or placeholder text.
10. Scope leakage into future stories.
11. Whether Architect gate is required.

# REQUIRED OUTPUT FORMAT
Analyst Validation Result: PASS or FAIL

Acceptance Criteria Table:
- Criterion
- Status
- Evidence
- Notes

Blocking Defects:
- List blocking defects or write None.

Non-Blocking Observations:
- List observations or write None.

Forbidden File Review:
- PASS or FAIL
- Evidence

DESIGN.md Review:
- PASS or FAIL
- Evidence

Architecture Review:
- PASS or FAIL
- Evidence

Static Build Compatibility:
- PASS or FAIL
- Evidence

Architect Gate Required:
- Yes or No
- Reason

Recommendation:
- Proceed to Architect gate
- Return to Dev
- Mark VERIFIED
"""


def write_prompts(path: Path) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "current_dev_prompt.md").write_text(build_dev_prompt(path), encoding="utf-8")
    (OUT_DIR / "current_qa_prompt.md").write_text(build_qa_prompt(path), encoding="utf-8")


def cmd_status() -> None:
    print("BMAD Deterministic Sprint Runner Status")
    print("---------------------------------------")
    for story in sorted(load_all_stories(), key=sort_key):
        print(f"{story.get('sprint_order')} | {story.get('id')} | {normalize_status(story.get('status'))} | {story.get('title')}")
    active = read_yaml(ACTIVE_STORY_FILE)
    if active:
        print("\nActive story:")
        print(active)


def cmd_validate_backlog() -> None:
    errors: List[str] = []
    ids: Set[str] = set()
    for story in load_all_stories():
        path = story["__path"]
        errors.extend(validate_story(story, path))
        sid = str(story.get("id", ""))
        if sid in ids:
            errors.append(f"Duplicate story id: {sid}")
        ids.add(sid)
    for story in load_all_stories():
        for dep in story.get("dependencies", []) or []:
            if str(dep) not in ids:
                errors.append(f"{story.get('id')}: dependency not found: {dep}")
    audit = {"checked_at": now(), "status": "PASS" if not errors else "FAIL", "errors": errors}
    write_yaml(BACKLOG_AUDIT_FILE, audit)
    if errors:
        print("BACKLOG VALIDATION FAILED")
        for e in errors:
            print(f"- {e}")
        sys.exit(1)
    print("BACKLOG VALIDATION PASSED")


def cmd_next() -> None:
    cmd_validate_backlog()
    current = active_path()
    if current:
        current_story = read_yaml(current)
        current_status = normalize_status(current_story.get("status"))
        if current_status not in ["DONE", "VERIFIED", "QA_FAILED", "BLOCKED"]:
            print("Active story is still open. Run recover, verify, mark-verified, mark-done, or mark-qa-failed before selecting a new story.")
            print(f"Active story: {current_story.get('id')} - {current_story.get('title')} [{current_status}]")
            sys.exit(1)
    path = find_next_story()
    if not path:
        print("No executable story found.")
        return
    set_status(path, "IN_PROGRESS")
    save_active(path)
    write_prompts(path)
    story = read_yaml(path)
    print("Next story selected:")
    print(f"File: {path.relative_to(ROOT)}")
    print(f"ID: {story.get('id')}")
    print(f"Title: {story.get('title')}")
    print("Generated prompts:")
    print("automation/out/current_dev_prompt.md")
    print("automation/out/current_qa_prompt.md")


def cmd_recover() -> None:
    print("DETERMINISTIC RECOVERY")
    path = active_path()
    if not path:
        print("No active story file found. Run status, validate-backlog, then next.")
        return
    story = read_yaml(path)
    print(f"Recovered active story: {story.get('id')} - {story.get('title')}")
    print(f"Status: {story.get('status')}")
    write_prompts(path)
    print("Prompts regenerated:")
    print("automation/out/current_dev_prompt.md")
    print("automation/out/current_qa_prompt.md")
    append_event("recovery regenerated prompts", str(story.get("id")))


def cmd_verify() -> None:
    path = active_path()
    if not path:
        print("No active story found.")
        sys.exit(1)
    story = read_yaml(path)
    commands = story.get("execution", {}).get("verification_commands", [])
    if not commands:
        print("No verification commands defined.")
        sys.exit(1)
    for command in commands:
        print(f"> {command}")
        result = subprocess.run(command, shell=True, cwd=ROOT)
        if result.returncode != 0:
            print(f"FAILED: {command}")
            sys.exit(result.returncode)
        print(f"PASSED: {command}")
    set_status(path, "DEV_COMPLETE")
    print("All verification commands passed. Story marked DEV_COMPLETE.")


def cmd_mark_qa_failed() -> None:
    path = active_path()
    if not path:
        print("No active story found.")
        sys.exit(1)
    set_status(path, "QA_FAILED")


def cmd_mark_verified() -> None:
    path = active_path()
    if not path:
        print("No active story found.")
        sys.exit(1)
    story = read_yaml(path)
    if str(story.get("architect_gate_required", "No")).lower() in ["yes", "true"]:
        gates = read_yaml(ARCHITECT_GATE_FILE)
        status = gates.get(str(story.get("id")), {}).get("status")
        if status != "PASS":
            print("Architect gate required but not recorded as PASS.")
            sys.exit(1)
    set_status(path, "VERIFIED")


def cmd_mark_done() -> None:
    path = active_path()
    if not path:
        print("No active story found.")
        sys.exit(1)
    story = read_yaml(path)
    if normalize_status(story.get("status")) != "VERIFIED":
        print("Story must be VERIFIED before DONE.")
        sys.exit(1)
    set_status(path, "DONE")
    clear_active()
    print("Active story cleared. Run next to select the next executable story.")


def cmd_architect_pass() -> None:
    path = active_path()
    if not path:
        print("No active story found.")
        sys.exit(1)
    story = read_yaml(path)
    gates = read_yaml(ARCHITECT_GATE_FILE)
    gates[str(story.get("id"))] = {
        "status": "PASS",
        "updated_at": now(),
        "title": story.get("title"),
    }
    write_yaml(ARCHITECT_GATE_FILE, gates)
    append_event("architect gate PASS", str(story.get("id")))
    print(f"Architect PASS recorded for {story.get('id')}")


def main() -> None:
    ensure_dirs()
    parser = argparse.ArgumentParser(description="CPMR Deterministic BMAD Sprint Runner")
    parser.add_argument("command", choices=[
        "status", "validate-backlog", "next", "recover", "verify",
        "mark-qa-failed", "mark-verified", "mark-done", "architect-pass"
    ])
    args = parser.parse_args()
    if args.command == "status":
        cmd_status()
    elif args.command == "validate-backlog":
        cmd_validate_backlog()
    elif args.command == "next":
        cmd_next()
    elif args.command == "recover":
        cmd_recover()
    elif args.command == "verify":
        cmd_verify()
    elif args.command == "mark-qa-failed":
        cmd_mark_qa_failed()
    elif args.command == "mark-verified":
        cmd_mark_verified()
    elif args.command == "mark-done":
        cmd_mark_done()
    elif args.command == "architect-pass":
        cmd_architect_pass()


if __name__ == "__main__":
    main()

