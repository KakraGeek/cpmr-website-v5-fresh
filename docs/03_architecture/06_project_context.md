# CPMR Project Context — Implementation Constitution

This document is the **binding implementation constitution** for AI agents working on the CPMR institutional website **fresh Astro static rebuild**. It complements human-readable architecture and planning docs; when instructions conflict, resolve using **forbidden assumptions** and **human review** sections below.

**BMAD output convention:** Primary generated artifacts live under `_bmad-output/` per `_bmad/bmm/config.yaml`. This file remains the canonical **project rules** location at `docs/03_architecture/06_project_context.md`.

---

## 1. Project identity

- **Repository:** `cpmr-website-v5-fresh` (package version `0.0.1`).
- **Product:** CPMR institutional website — static-first public site rebuilt with **Astro** and **Tailwind CSS v4**.
- **Owner-facing name in UI (bootstrap):** “CPMR Website Rebuild” (see `src/pages/index.astro`) until content stories replace it.
- **Authoritative planning and design inputs** (read before expanding scope):  
  `docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`,  
  `docs/01_planning/01_analysis.md`,  
  `docs/01_planning/02_prd.md`,  
  `docs/02_design/03_ux_blueprint.md`,  
  `docs/02_design/DESIGN.md`,  
  `docs/03_architecture/04_architecture.md`,  
  `docs/03_architecture/05_content_architecture_and_cms_strategy.md`,  
  `docs/04_stories/05_story_map.md`,  
  `docs/stories/*.yml`,  
  `automation/active_story.yml`.

---

## 2. Locked stack

Do **not** change these choices without an explicit architecture decision and human approval.

| Layer | Locked choice |
| --- | --- |
| Runtime | **Node.js** `>= 22.12.0` (`package.json` `engines`) |
| Framework | **Astro** `^6.3.1` |
| Styling | **Tailwind CSS** `^4.3.0` via **`@tailwindcss/vite`** `^4.3.0` |
| Build | **Vite** (via Astro); Tailwind registered as a Vite plugin in `astro.config.mjs` |
| Output mode | **`output: 'static'`** — see Section 4 |
| Package manager | **npm** (scripts in `package.json`) |

**Scripts (authoritative):**

- `npm run dev` / `npm start` — `astro dev`
- `npm run build` — `astro build`
- `npm run preview` — `astro preview` (local verification of static output)
- `npm run validate` — runs **`astro build`** (build must succeed for validation)

---

## 3. BMAD Method workflow rules

Orientation follows **`bmad-help`** and `_bmad/_config/bmad-help.csv` (BMad Method rows). Agents treat this as the **runtime workflow map**.

### Phase model (BMad Method)

1. **Analysis (`1-analysis`)** — Brainstorming, market/domain/technical research, product brief or PRFAQ. Optional individually; **do not invent downstream artifacts from thin air** if stakeholders depend on recorded analysis.
2. **Planning (`2-planning`)** — **Create PRD** is **required** (`required=true`). **Validate / Edit PRD** optional but recommended. **Create UX** runs after PRD and is strongly recommended when UI is primary.
3. **Solutioning (`3-solutioning`)** — **Create Architecture**, **Create Epics and Stories**, and **Check Implementation Readiness** are **required** gates in order for implementation readiness.
4. **Implementation (`4-implementation`)** — **Sprint Planning** is **required** before sequential story work. Story loop: **Create Story** → **Validate Story** → **Dev Story** → **Code Review** (iterate DS ↔ CR until approved); optional **Checkpoint**, **QA Automation**, **Retrospective**. **Correct Course** anytime for major pivots.

### Operating rules

- **Pipeline discipline:** Respect the intended order: brief/analysis → **PM/PRD** only after analyst grounding → UX → architecture → epics/stories → readiness → sprint → stories. **Do not start PRD work without analyst/analysis inputs** where the project expects them.
- **Single focus:** **One story at a time** with deterministic execution (see Section 9). Do not batch unrelated stories in one implementation pass unless humans explicitly change process.
- **Fresh context:** Use a **fresh Cursor chat** for each major BMAD workflow step or skill run when practical — avoids contamination and skipped gates.
- **Command uncertainty:** If unsure which skill or step applies, **`bmad-help`** is the routing authority; do not guess menus or phase ordering.
- **No fabrication:** **Do not invent requirements** or stakeholder decisions; anchor claims in repo docs or ask for human input.

---

## 4. Astro static output rules

- **`astro.config.mjs` must keep `output: 'static'`.** The public site is **fully static** after `astro build`.
- **No server runtime** is assumed for the deployed site: no Astro server adapters, no SSR-only APIs, no “needs Node on the host” features unless project governance explicitly migrates away from static hosting (would be a major change).
- **Pages** live under `src/pages/`. **Layouts and components** under `src/layouts/`, `src/components/` (and similar). **Global CSS** entry: `src/styles/global.css`, imported from pages/layouts as needed.
- **Build artifact:** default Astro static output (typically `dist/`). Verify with `npm run build` / `npm run validate`.
- **`astro preview`** is for local verification only; production is still static files.

---

## 5. Tailwind CSS v4 implementation rules

- **Vite plugin:** `import tailwindcss from '@tailwindcss/vite'` and include `tailwindcss()` in `vite.plugins` inside `astro.config.mjs`. **Do not** downgrade to Tailwind v3 postcss-only setup unless explicitly directed.
- **CSS entry:** `src/styles/global.css` must retain **`@import "tailwindcss";`** as the Tailwind v4 entry. Pages/layouts that need utilities should import this stylesheet (see `src/pages/index.astro`).
- **Utilities:** Use Tailwind utility classes in `.astro` templates; prefer design tokens and consistent patterns once `DESIGN.md` is binding (see Section 7).
- **Avoid fighting the stack:** Do not add duplicate Tailwind pipelines (e.g., redundant PostCSS Tailwind config) without removing the Vite plugin approach first.

---

## 6. Content governance rules

- **Editable content** (copy, structured site data, YAML/JSON feeds consumed by the site) **must live under `src/content/` or `src/data/`** — not hidden inside components as hardcoded “final” truth.
- **Presentation vs content:** Components implement layout and behavior; **marketing and institutional copy** belong in content/data layers so non-developers can evolve them without code edits where possible.
- **No runtime CMS/database:** Do not assume WordPress, headless CMS APIs, or databases **at runtime** for this static deployment model. Pre-build ingestion (build-time fetch, committed data files) may exist only if explicitly approved and still produces **static** output.
- **Short-term placeholders** in components are acceptable only when a story explicitly allows bootstrap markup and **must be replaced** by governed content sources as stories land.

---

## 7. DESIGN.md governance rules

- **`docs/02_design/DESIGN.md` is the UI contract** for visual design decisions (colors, typography, components, spacing rules) once finalized through UX workflow.
- **Current state:** The repo may contain a **placeholder** `DESIGN.md` explicitly stating not to implement against it. While placeholder or missing real specs:
  - **Do not** ship polished UI “finals” derived from the placeholder.
  - Limit UI work to **neutral scaffolding**, accessibility basics, and story-driven stubs aligned with PRD/architecture.
- **Do not implement UI outside `DESIGN.md`** once the real contract replaces the placeholder — meaning no one-off styling that contradicts the signed-off design system without updating `DESIGN.md` first.

---

## 8. Shared-hosting constraints

Target deployment is **generic static hosting** (Apache, nginx, GitHub Pages–class surfaces, CDN static origins):

- **Output:** HTML, CSS, JS, and static assets only; **no dependency on Node.js** on the server.
- **Paths:** Prefer **relative** asset and link patterns suitable for subdirectory deployment when applicable (follow emerging architecture notes when `04_architecture.md` is populated).
- **Environment:** No server-side secrets, sessions, or databases on the host for core pages.
- **Performance:** Keep bundles reasonable; lazy-load heavy client islands only when Astro/React/Vue islands are introduced with explicit stories.

---

## 9. Story implementation rules

- **Single-story determinism:** Implement **exactly one story** per development cycle unless humans explicitly reprioritize. Follow **`docs/stories/*.yml`** and **`automation/active_story.yml`** when present.
- **Serial workflow:** Align with BMad Method implementation phase: **Create Story** → **Validate Story** → **Dev Story** → **Code Review** → next story or epic closure activities.
- **Scope:** A story implements **only** its acceptance criteria and linked docs; avoid scope bleed into future stories.
- **Traceability:** Commit messages / PR descriptions should reference the story identifier when the team uses tracked IDs.
- **Quick Dev (`bmad-quick-dev`)** is not a license to skip gates; it still must obey static output, content locations, and `DESIGN.md` rules.

---

## 10. Validation and gate rules

- **Build gate:** **`npm run validate` must pass** before considering work merge-ready (aliases `astro build`).
- **Planning gates:** PRD → Architecture → Epics/Stories → **Implementation Readiness** must be satisfied before treating implementation as formally “greenlit.”
- **Story gates:** Story validation and code review are **expected** before merging story work; reopen **Dev Story** when review finds defects.
- **Optional quality:** PRD validation, checkpoint preview, QA automation, retrospectives — use when stakeholders require them; they do not replace the build gate.

---

## 11. Forbidden assumptions

Agents **must not** assume any of the following unless explicitly documented and approved:

1. **SSR, API routes, or server adapters** for Astro in production.
2. **Runtime databases**, CRM integrations, or authenticated CMS reads on each request.
3. **Secrets or env-driven server configuration** on the static host for core pages.
4. **Final marketing copy** embedded only in components **without** `src/content` / `src/data` governance.
5. **UX completeness** from `DESIGN.md` **while it remains an explicit placeholder**.
6. **Parallel multi-story implementation** as the default (violates deterministic one-story-at-a-time execution).
7. **New dependencies** that imply servers, databases, or non-static deployment — without architecture review.

---

## 12. When to stop and ask for human review

Stop and request human decisions when:

- **Authoritative docs conflict** (PRD vs architecture vs stories vs this constitution).
- **`DESIGN.md` is still a placeholder** but the work requires visual finalization or brand-sensitive presentation.
- **Static output or shared-hosting constraints** cannot be met without changing stack (e.g., need for SSR, dynamic server routes, or runtime data).
- **Scope creep** or ambiguous acceptance criteria would force multiple stories at once.
- **Legal, accessibility certification, or institutional approval** is implied but not recorded.
- **Adding dependencies**, **changing Astro output mode**, or **introducing runtime services** — always human-approved.

---

*Generated for the CPMR Astro static rebuild. Stack facts locked to `package.json`, `astro.config.mjs`, `src/pages/index.astro`, and `src/styles/global.css` as of constitution authorship; BMAD phases and gates aligned with `_bmad/_config/bmad-help.csv` (BMad Method).*
