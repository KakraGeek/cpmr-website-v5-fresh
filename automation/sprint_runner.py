from __future__ import annotations

import argparse
import re
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
PROCESS_FIX_FILE = AUTOMATION_DIR / "process_fix_required.yml"

STATUSES = [
    "TODO",
    "READY",
    "IN_PROGRESS",
    "DEV_COMPLETE",
    "ANALYST_REVIEW",
    "ARCHITECT_REVIEW",
    "QA_FAILED",
    "PROCESS_FIX_REQUIRED",
    "BLOCKED",
    "VERIFIED",
    "DONE",
]

EXECUTABLE = ["QA_FAILED", "READY", "TODO"]

DEFAULT_CONTEXT_FILES = [
    "docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md",
    "docs/01_planning/01_analysis.md",
    "docs/01_planning/02_prd.md",
    "docs/02_design/03_ux_blueprint.md",
    "docs/02_design/DESIGN.md",
    "docs/03_architecture/04_architecture.md",
    "docs/03_architecture/06_project_context.md",
    "docs/04_stories/05_story_map.md",
]

REQUIRED_FIELDS = [
    "id",
    "epic",
    "sprint_order",
    "title",
    "status",
    "user_story",
    "acceptance_criteria",
    "tasks",
    "dependencies",
    "context_files",
    "execution",
    "qa_checklist",
]

REQUIRED_EXECUTION_FIELDS = [
    "files_allowed",
    "files_forbidden",
    "verification_commands",
]

# Top-level story YAML keys the sprint runner may update without rewriting the file.
STORY_BOOKKEEPING_KEYS = frozenset({
    "status",
    "last_updated",
    "qa_notes",
    "validation_notes",
})

BOOKKEEPING_LINE_RE = re.compile(
    r"^(status|last_updated|qa_notes|validation_notes):"
)


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


def _line_ending(line: str) -> str:
    if line.endswith("\r\n"):
        return "\r\n"
    if line.endswith("\n"):
        return "\n"
    return "\n"


def _format_bookkeeping_scalar(key: str, value: str) -> str:
    if "\n" in value:
        raise ValueError(f"{key} bookkeeping value must be a single line")
    if key == "status" and re.fullmatch(r"[A-Z_]+", value):
        return value
    escaped = value.replace("'", "''")
    return f"'{escaped}'"


def patch_story_metadata(path: Path, **updates: str) -> None:
    """
    Update runner bookkeeping fields in a story file without safe_dump reformatting.

    Preserves original YAML layout (block scalars, indentation, list style) so QA
    process-metadata review only sees intentional scope edits.
    """
    if not updates:
        return
    unknown = set(updates.keys()) - STORY_BOOKKEEPING_KEYS
    if unknown:
        raise ValueError(
            f"Refusing to patch non-bookkeeping story keys via runner: {sorted(unknown)}"
        )

    raw = path.read_text(encoding="utf-8")
    lines = raw.splitlines(keepends=True)
    if not lines and raw:
        lines = [raw]

    found = {key: False for key in updates}
    result: List[str] = []
    status_result_index: Optional[int] = None

    for line in lines:
        stripped = line.rstrip("\r\n")
        match = BOOKKEEPING_LINE_RE.match(stripped)
        if match and match.group(1) in updates:
            key = match.group(1)
            eol = _line_ending(line)
            result.append(f"{key}: {_format_bookkeeping_scalar(key, updates[key])}{eol}")
            found[key] = True
            if key == "status":
                status_result_index = len(result) - 1
        else:
            result.append(line)

    missing = [key for key in updates if not found[key]]
    if missing:
        insert_at = (status_result_index + 1) if status_result_index is not None else len(result)
        for key in missing:
            result.insert(
                insert_at,
                f"{key}: {_format_bookkeeping_scalar(key, updates[key])}\n",
            )
            insert_at += 1

    out = "".join(result)
    if raw.endswith("\n") and not out.endswith("\n"):
        out += "\n"
    path.write_text(out, encoding="utf-8")


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
    patch_story_metadata(path, status=status, last_updated=now())
    story = read_yaml(path)
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


def current_story_rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


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


def process_metadata_allowed(path: Path, execution: Dict[str, Any]) -> List[str]:
    """
    QA-only metadata allowance.

    This does NOT give the Dev agent permission to edit story YAML.
    It only prevents QA from failing because the sprint runner itself updated
    the active story's status, timestamps, or bookkeeping fields.
    """
    current = current_story_rel(path)
    items = execution.get("process_metadata_allowed")

    if not items:
        return [current]

    if isinstance(items, str):
        values = [items]
    elif isinstance(items, list):
        values = [str(item) for item in items]
    else:
        values = []

    if current not in values:
        values.append(current)

    return values


def build_dev_prompt(path: Path) -> str:
    story = read_yaml(path)
    execution = story.get("execution", {})

    return f"""# BMAD DEV AGENT EXECUTION PROMPT

You are the BMAD Developer Agent for the CPMR fresh Astro rebuild.
You must implement exactly ONE story.

# STORY FILE
{current_story_rel(path)}

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

# IMPLEMENTATION FILES ALLOWED
{format_list(execution.get('files_allowed', []))}

# FILES FORBIDDEN FOR IMPLEMENTATION
{format_list(execution.get('files_forbidden', []))}

# VERIFICATION COMMANDS THAT MUST PASS
{format_list(execution.get('verification_commands', []))}

# QA CHECKLIST AWARENESS
{format_list(story.get('qa_checklist'))}

# AUTHORITATIVE CONTEXT
{context_text(story)}

# STRICT DEV EXECUTION RULES
1. Implement only this story.
2. Do not implement future stories.
3. Modify only IMPLEMENTATION FILES ALLOWED.
4. Do not manually edit the story YAML, active_story.yml, execution_history.yml, architect_gates.yml, backlog_integrity.yml, process_fix_required.yml, or generated prompt files.
5. Treat sprint-runner metadata files as runner-owned process state, not implementation scope.
6. Do not modify files listed under FILES FORBIDDEN FOR IMPLEMENTATION.
7. Preserve Astro static output compatibility.
8. Do not introduce SSR-only behavior.
9. Do not invent UI styles outside DESIGN.md.
10. Do not hardcode final editable institutional content into components.
11. Stop if authoritative documents conflict.
12. Return a clear implementation summary.
13. Do not mark VERIFIED or DONE.

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
{current_story_rel(path)}

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

# IMPLEMENTATION FILES ALLOWED
{format_list(execution.get('files_allowed', []))}

# PROCESS METADATA ALLOWED FOR QA ONLY
{format_list(process_metadata_allowed(path, execution))}

# FILES FORBIDDEN FOR IMPLEMENTATION
{format_list(execution.get('files_forbidden', []))}

# VERIFICATION COMMANDS
{format_list(execution.get('verification_commands', []))}

# AUTHORITATIVE CONTEXT
{context_text(story)}

# REQUIRED LOCAL INSPECTION COMMANDS
Run or request evidence equivalent to:
- git status --short
- git diff --name-only
- git diff -- {current_story_rel(path)}
- npm run build
- npm run validate

# FORBIDDEN FILE VALIDATION RULE
Implementation changes must be limited to IMPLEMENTATION FILES ALLOWED.

Files listed under PROCESS METADATA ALLOWED FOR QA ONLY are permitted only for runner-owned workflow metadata updates such as:
- status changes
- last_updated timestamps
- QA notes
- validation notes
- execution-state tracking
- sprint-runner bookkeeping

The current story YAML file must not fail forbidden-file validation merely because the sprint runner updated metadata fields.

However, the current story YAML must FAIL Process Metadata Review if the diff changes:
- user_story
- acceptance_criteria
- tasks
- dependencies
- context_files
- files_allowed
- files_forbidden
- verification_commands
- qa_checklist
- architect_gate_required
- any story scope, requirement, or implementation instruction

Any other file matching FILES FORBIDDEN FOR IMPLEMENTATION must fail validation unless it is explicitly listed in IMPLEMENTATION FILES ALLOWED.

# QA ROUTING RULE
Return to Dev ONLY when the defect is in implementation work inside IMPLEMENTATION FILES ALLOWED.

Do NOT return to Dev for:
- sprint-runner script defects
- prompt-generation defects
- story YAML schema defects
- process metadata policy defects
- stale active_story.yml state
- architect gate bookkeeping problems

For those issues, recommend: PROCESS FIX REQUIRED.

# VALIDATION TASK
Check:
1. Every acceptance criterion.
2. Every QA checklist item.
3. Forbidden file changes using IMPLEMENTATION FILES ALLOWED, PROCESS METADATA ALLOWED FOR QA ONLY, and FILES FORBIDDEN FOR IMPLEMENTATION.
4. Process metadata diff discipline.
5. DESIGN.md alignment where applicable.
6. Architecture alignment.
7. Static build compatibility.
8. Accessibility expectations where applicable.
9. Responsive behavior where applicable.
10. Raw metadata or placeholder text.
11. Scope leakage into future stories.
12. Whether Architect gate is required.

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

Process Metadata Review:
- PASS or FAIL
- Evidence

DESIGN.md Review:
- PASS or FAIL or NOT APPLICABLE
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
Choose exactly one:
- Proceed to Architect gate
- Return to Dev
- Process Fix Required
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
    process_fix = read_yaml(PROCESS_FIX_FILE)
    if process_fix:
        print("\nProcess fix required:")
        print(process_fix)


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

    if PROCESS_FIX_FILE.exists():
        process_fix = read_yaml(PROCESS_FIX_FILE)
        if process_fix:
            print("PROCESS FIX REQUIRED is currently open. Resolve or clear it before selecting another story.")
            print(process_fix)
            sys.exit(1)

    current = active_path()
    if current:
        current_story = read_yaml(current)
        current_status = normalize_status(current_story.get("status"))
        if current_status not in ["DONE", "VERIFIED", "QA_FAILED", "BLOCKED"]:
            print("Active story is still open. Run recover, verify, mark-verified, mark-done, mark-qa-failed, or mark-process-fix-required before selecting a new story.")
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


def cmd_mark_process_fix_required() -> None:
    path = active_path()
    if not path:
        print("No active story found.")
        sys.exit(1)
    story = read_yaml(path)
    reason = " ".join(sys.argv[2:]).strip() or "Process fix required. See QA output."
    set_status(path, "PROCESS_FIX_REQUIRED")
    write_yaml(PROCESS_FIX_FILE, {
        "story_id": story.get("id"),
        "story_file": current_story_rel(path),
        "title": story.get("title"),
        "reason": reason,
        "created_at": now(),
    })
    print("Process fix required recorded.")


def cmd_clear_process_fix() -> None:
    path = active_path()
    if PROCESS_FIX_FILE.exists():
        PROCESS_FIX_FILE.unlink()
    if path:
        story = read_yaml(path)
        if normalize_status(story.get("status")) == "PROCESS_FIX_REQUIRED":
            set_status(path, "QA_FAILED")
            print("Story moved back to QA_FAILED for rerun after process fix.")
    print("Process fix state cleared.")


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
        "status",
        "validate-backlog",
        "next",
        "recover",
        "verify",
        "mark-qa-failed",
        "mark-process-fix-required",
        "clear-process-fix",
        "mark-verified",
        "mark-done",
        "architect-pass",
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
    elif args.command == "mark-process-fix-required":
        cmd_mark_process_fix_required()
    elif args.command == "clear-process-fix":
        cmd_clear_process_fix()
    elif args.command == "mark-verified":
        cmd_mark_verified()
    elif args.command == "mark-done":
        cmd_mark_done()
    elif args.command == "architect-pass":
        cmd_architect_pass()


if __name__ == "__main__":
    main()
