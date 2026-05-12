---
project_name: cpmr-website-v5-fresh
user_name: Kakra
date: '2026-05-12'
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - testing_rules
  - quality_rules
  - workflow_rules
  - anti_patterns
status: complete
rule_count: 48
optimized_for_llm: true
inputs:
  - docs/01_planning/02_prd.md
  - docs/02_design/DESIGN.md
  - docs/03_architecture/04_architecture.md
---

# Project Context for AI Agents — CPMR

_This file is the **implementation constitution** for the CPMR institutional website. Agents must follow it before writing or changing code. It emphasizes unobvious constraints that are easy to violate. Primary planning artifacts also live under `_bmad-output/` per `_bmad/bmm/config.yaml`; this path remains the canonical **project rules** file._

**Conflict resolution:** If `docs/02_design/DESIGN.md` conflicts with static delivery or this file, **this constitution wins** and `DESIGN.md` must be updated (see `DESIGN.md` §0).

---

## Technology Stack & Versions

| Layer | Version / choice | Notes |
| --- | --- | --- |
| Node.js | `>= 22.12.0` | `package.json` `engines` |
| Astro | `^6.3.1` | File-based routing; keep `output: 'static'` |
| Tailwind CSS | `^4.3.0` | Via `@tailwindcss/vite` `^4.3.0` only — no duplicate PostCSS Tailwind pipeline |
| Vite | via Astro | `tailwindcss()` in `vite.plugins` inside `astro.config.mjs` |
| TypeScript | project standard | Use where Astro/scripts expect `.ts` |
| Package manager | **npm** | Scripts: `dev`, `start`, `build`, `preview`, `validate` |

**Authoritative scripts:** `npm run validate` → `astro build` (merge-ready gate). `npm run build` / `preview` for artefact and local static verification. Deploy **`dist/`** to generic static hosting — **no Node on the production server** for core HTML.

---

## Critical Implementation Rules

### Language-specific rules

- Prefer **explicit types** in shared utilities and content loaders; match existing Astro/TS patterns in the repo.
- **Async data:** Use Astro `getStaticPaths` / `getCollection` / `getEntry` patterns — relationships resolve **at build time**, not per-request DB joins.
- **IDs:** Use stable string keys in frontmatter (`departmentId`, `relatedProjectIds`, etc.) for cross-collection filtering.

### Framework-specific rules (Astro)

- **`astro.config.mjs`:** Must retain `output: 'static'`. Do **not** add Astro server adapters or SSR-default public routes for MVP.
- **Routes:** `src/pages/` owns URLs; dynamic segments via `[param]`. Pick **one** trailing-slash policy project-wide and stick to it (architecture recommends trailing slash on).
- **Layouts:** Base layout supplies `<html lang="en">`, skip link, `<main id="main">`, global SEO slots; see `04_architecture.md` §8.
- **Content Collections:** Declare schemas in `src/content/config.ts` or `src/content.config.ts` (Astro 6 convention) with Zod (or project-standard validator) for every governed type.
- **`src/data/`:** Navigation aggregates, feature flags, generated indexes — not long-form copy unless explicitly modeled.
- **Islands:** React/Vue/Svelte islands are **optional and story-gated**; default to minimal JS until a story justifies bundle cost.
- **Department mini-sites:** Stable subtree `/departments/[department-slug]/…`; department nav/order from frontmatter or `src/data`, not hardcoded per department components.

### DESIGN.md & styling rules

- **`docs/02_design/DESIGN.md` v1.0.0 is the UI contract** — not a placeholder. All colour, spacing, typography, radius, shadow, and z-index decisions flow from **§1 tokens** mapped to Tailwind `@theme` / utilities.
- **Zero tolerance:** No raw hex outside §1, no arbitrary Tailwind values (`bg-[#…]`, `p-[13px]`, `rounded-[7px]`, `z-[42]`, arbitrary shadows), no inline `style` for colour/spacing/type/radius/shadow/z-index, no per-component one-off CSS files for theme styling, no `outline: none` without token-based focus replacement.
- **If no token applies:** Stop and amend `DESIGN.md` — do not invent visual values.
- **Icons:** Decorative icons `aria-hidden`; sizing uses design tokens (`DESIGN.md` §13–15).

### Content & search rules

- **Governed truth:** Institutional copy and structured entities live under **`src/content/`** and **`src/data/`** — components present; they do not own final institutional strings long-term.
- **Static search (PRD §23):** No SSR or hosted DB for search MVP. Preferred architecture: **Pagefind** post-build under `dist/`, or build-generated JSON + client fuzzy search — see `04_architecture.md` §10.
- **SR4 honesty:** Do not ship silent gaps in search coverage for production without explicit phased labelling; prefer a minimal honest index over omitting whole content classes quietly.
- **Forms:** No bespoke PHP/server on shared host; third-party endpoints or approved patterns only — privacy-reviewed.

### Accessibility & performance

- **Target:** Implement per **`DESIGN.md` §15–16** and **`03_ux_blueprint.md`** — WCAG **2.1 AA** baseline in design docs (institutional).
- Skip link, landmarks, single `h1`, visible focus, labelled forms, table semantics, **`prefers-reduced-motion`**, touch targets ≥ **44×44px**.
- **Images:** `<Image />` / `astro:assets` where appropriate; **alt text** mandatory in content models; decorative images `alt=""`.
- **Performance:** Lean JS; lazy-load below-fold media; representative testing on mid-tier Android per PRD §27.

### Testing & validation rules

- **Mandatory gate:** **`npm run validate` passes** before merge-ready work.
- **Scope:** When tests exist, follow repo conventions for placement and naming; prefer integration checks on critical static routes when introduced.
- **Preview:** `astro preview` validates built output locally; production remains static files only.

### Code quality & style rules

- **Components:** Folder split per architecture — e.g. `ui/`, `layout/`, `content/`, `departments/`, `search/` under `src/components/`; presentational components take typed props; pages wire data.
- **Assets:** PDFs for stable URLs often under `public/`; optimise images via Astro pipeline where applicable.
- **SEO:** Unique `title`/`description` per template; stable slugs; sitemap/robots when stories add `@astrojs/sitemap` or equivalents.

### Development workflow rules (BMAD)

- **Phase order:** Analysis → **PRD** (`2-planning`) → UX → **Architecture**, **Epics/Stories**, **Implementation Readiness** (`3-solutioning`) → **Sprint Planning** → story loop (`4-implementation`).
- **Single-story determinism:** Implement **one story** per cycle unless humans explicitly override; follow `docs/stories/*.yml` and `automation/active_story.yml` when present.
- **Routing uncertainty:** Use **`bmad-help`** — do not guess BMAD menus.
- **No fabrication:** Do not invent stakeholder decisions; anchor in repo docs or ask humans.
- **Readiness:** Run **`bmad-check-implementation-readiness`** after epics/stories exist (`04_architecture.md` §20).

### Critical don’t-miss rules

1. **No SSR, API routes, or server adapters** for MVP public delivery.
2. **No runtime database/CMS/API** on the public host for core pages; build-time ingestion must still emit **static `dist/`**.
3. **No final marketing copy** stranded only in components without a `src/content` / `src/data` path.
4. **No silent search omissions** (SR4); no broken footer/nav links to unapproved routes (PRD §30 FTR).
5. **No dependencies** that imply server runtime or non-static deployment without architecture review and human approval.
6. **Future CMS or app layers:** Separate ADR + constitution amendment; public site stays static Astro unless governance replaces MVP (`04_architecture.md` §16–17).

---

## Usage Guidelines

**For AI agents**

- Read this file and **`DESIGN.md`** before UI work; read **`04_architecture.md`** for routing, collections, and search ADRs.
- Follow rules exactly; when unsure, prefer the **more restrictive** option or ask for human review (`§12` equivalents above).
- Update this constitution when stack or governance changes.

**For humans**

- Keep this file lean; remove rules that become obvious as the stack matures.
- When `DESIGN.md` or PRD changes materially, reconcile this file and architecture docs.
- Review periodically (e.g. quarterly) for outdated constraints.

---

_Last updated: 2026-05-12. Synthesized from `docs/01_planning/02_prd.md`, `docs/02_design/DESIGN.md`, and `docs/03_architecture/04_architecture.md`, plus `package.json` and `astro.config.mjs`._
