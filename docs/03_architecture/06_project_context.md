# CPMR v6 Fresh Build BMAD Method Rules

You are operating inside the CPMR v6 BMAD Method Astro rebuild.

Authoritative project files:
1. docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md
2. docs/01_planning/01_analysis.md
3. docs/01_planning/02_prd.md
4. docs/02_design/03_ux_blueprint.md
5. docs/02_design/DESIGN.md
6. docs/03_architecture/04_architecture.md
7. docs/03_architecture/05_content_architecture_and_cms_strategy.md
8. docs/03_architecture/06_project_context.md
9. docs/04_stories/05_story_map.md
10. docs/stories/*.yml
11. automation/active_story.yml

Rules:
- Use the current BMAD Method workflow model.
- Enforce Initial Brief -> Analyst -> PM -> UX -> Architect -> Scrum Master -> Development -> QA.
- Run bmad-help when command availability is unclear.
- Do not invent requirements.
- Do not start PM/PRD before Analyst analysis exists.
- Do not skip gates.
- Do not implement UI outside DESIGN.md.
- Do not hardcode final editable content into components.
- Preserve Astro static output.
- Preserve shared-hosting compatibility.
- Implement one story at a time.
- Use fresh Cursor chat for every major BMAD workflow.
- Stop if authoritative inputs conflict.
