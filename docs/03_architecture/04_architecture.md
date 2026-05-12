# CPMR Technical Architecture — Astro Static Institutional Site

**Project:** Centre for Plant Medicine Research (CPMR) institutional website  
**Repository:** `cpmr-website-v5-fresh`  
**Document type:** Solution architecture (`3-solutioning`)  
**Status:** Draft for implementation readiness and story breakdown  
**Locked deployment model:** `output: 'static'`, `dist/` on generic shared/static hosting  
**Authoritative inputs:**  
`docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`,  
`docs/01_planning/01_analysis.md`,  
`docs/01_planning/02_prd.md`,  
`docs/02_design/03_ux_blueprint.md`,  
`docs/02_design/DESIGN.md`,  
`docs/03_architecture/06_project_context.md`,  
`package.json`,  
`astro.config.mjs`  
**Date:** 2026-05-12  
**Version:** `1.0.0`

---

## 1. Executive architecture summary

The CPMR public website is a **fully static** Astro 6 application: HTML, CSS, JavaScript, and assets are emitted at **`astro build`** time into **`dist/`**, with **no runtime Node.js, database, or CMS** on the production host for MVP.

Architecture centres on three pillars:

1. **Static-first delivery** — `output: 'static'` is mandatory; public routes are pre-rendered. Dynamic behaviour is limited to **client-side** enhancements (navigation UI, filters, search client, optional islands) that do not require per-request server logic.
2. **Content-driven structure** — Institutional copy and structured entities live under **`src/content/`** (Markdown/MDX + frontmatter, validated by Astro Content Collections) and **`src/data/`** (JSON/YAML/TS aggregates such as navigation, footer, and generated indexes). Components implement layout and behaviour; they do not own “final” institutional truth as hardcoded strings long-term.
3. **Department mini-sites** — Each verified department is a **stable URL subtree** under `/departments/[department-slug]/`, with listing/detail routes for staff, projects, publications, services, news, and downloads as content allows. Relationships are resolved **at build time** from shared identifiers in content schemas (not runtime joins).

This document aligns with **`DESIGN.md` v1.0.0** (visual and component contract) and **`06_project_context.md`** (implementation constitution). If a design rule ever conflicts with the constitution (e.g. static output), **the constitution wins** and `DESIGN.md` must be updated—per `DESIGN.md` §0.

---

## 2. Stack decision

| Layer | Decision | Notes |
| --- | --- | --- |
| Language | **TypeScript** | Astro and project scripts use TS where applicable. |
| Framework | **Astro `^6.3.1`** | File-based routing; static output; optional islands later. |
| Styling | **Tailwind CSS `^4.3.0`** via **`@tailwindcss/vite` `^4.3.0`** | Plugin registered in `astro.config.mjs` `vite.plugins`. Global entry: `src/styles/global.css` with `@import "tailwindcss";`. |
| Build | **Vite** (via Astro) | Single pipeline; avoid duplicate Tailwind/PostCSS stacks. |
| Runtime (build only) | **Node.js `>= 22.12.0`** | Authoritative in `package.json` `engines`. |
| Package manager | **npm** | Scripts: `dev`, `build`, `preview`, `validate` (`validate` → `astro build`). |

**Explicit non-selections for MVP public delivery:**

- **No Astro server adapter** and **no SSR-default** public routes.
- **No runtime WordPress/headless CMS/API** on the public host for core pages.
- **No database** on the production host for MVP.

See **§16–17** for how future CMS or app layers may attach **without** breaking this baseline unless governance approves a constitution change.

---

## 3. Static output constraints

- **`astro.config.mjs` must keep `output: 'static'`.** No hybrid/server output for the MVP product described in the PRD (`02_prd.md` §6 NFR2, §34).
- **Build artefact:** default Astro static output directory (**`dist/`** unless configured otherwise). Verify with `npm run build` / `npm run validate`.
- **No reliance on per-request APIs** for primary navigation or core page HTML. Features that imply server sessions, authenticated preview on the host, or DB-backed page assembly are **out of scope** for MVP hosting (`02_prd.md` §29 CM3).
- **`astro preview`** validates the built output locally; production remains plain static files behind Apache, nginx, CDN, or GitHub Pages–class hosting (`06_project_context.md` §4, §8).

---

## 4. Astro routing architecture

### 4.1 File-system routing

- **`src/pages/`** owns URLs. Each `.astro`, `.md`, `.mdx` (if enabled) file maps to a route; dynamic segments use **`[param]`** folders or filenames.
- **Trailing slashes:** adopt **one** convention project-wide (recommended: trailing slash **on** for institutional consistency—implement via Astro config when enabled for the version in use). Document the chosen policy in the root layout and internal links.

### 4.2 IA mapping (baseline)

Top-level IA matches Brief/PRD/UX (`02_prd.md` §5 F1; `03_ux_blueprint.md` §3):

| Area | Example route roots |
| --- | --- |
| Home | `/` |
| About | `/about/`, children under `/about/...` |
| Research | `/research/`, `/research/projects/`, `/research/publications/` |
| Departments | `/departments/` index; `/departments/[slug]/` mini-site |
| Services | `/services/`, `/services/clinic/`, `/services/drug-analysis-unit/` |
| Products | `/products/` and category routes |
| News & Events | `/news/`, `/events/`, `/announcements/` (exact split per content collections) |
| Resources / Downloads | `/resources/` with `/resources/downloads/` or dedicated `/downloads/`—**pick one** root in stories and keep redirects stable |
| Careers | `/careers/` |
| Contact | `/contact/` |
| Search | `/search/` **and/or** overlay-only UX (`03_ux_blueprint.md` §4). Static route recommended for shareable results and progressive enhancement. |

### 4.3 Dynamic routes

- **Departments:** `/departments/[department]/index.astro` (or equivalent) for hub; nested dynamics for child collections (see §6).
- **Detail pages:** `[slug].astro` patterns for projects, publications, news, staff, downloads—as defined per collection.
- **Pagination:** static pagination via **`getStaticPaths`** returning finite pages from collection queries (no infinite server pagination).

### 4.4 Error pages

- **`src/pages/404.astro`** (and optional `500` only if applicable to hosting) for client-facing errors; must remain static-compatible.

---

## 5. Content collection architecture

### 5.1 Astro Content Collections

Use **`src/content/config.ts`** (or `src/content.config.ts` per Astro 6 project convention) to declare **schemas** with Zod (or Astro’s recommended validator) for every governed type.

**Recommended collection split** (adjust names to match implementation stories):

| Collection | Purpose |
| --- | --- |
| `departments` | Department mini-site core metadata: slug, name, mandate excerpt, hero, contact block IDs, nav order |
| `staff` | People: role, department foreign keys, photo asset refs, bio |
| `projects` | Research projects: status, summary, links to departments/staff |
| `publications` | Publications metadata: authors, year, DOI, PDF asset gate |
| `services` | Clinic, DAU, generic services: fees, hours, FAQs |
| `products` | Categories and product entries |
| `news`, `events`, `announcements` | Distinct templates per PRD §18–20 |
| `downloads` | Document centre entries: file path, mime, owning unit |
| `pages` | Generic institutional pages where MDX/longform is appropriate |
| `settings` or `site` | Singleton or small set for global hero/footer/contact strings |

**Relationships:** use **stable string IDs** in frontmatter (`departmentId`, `relatedProjectIds`, etc.) and resolve relationships in page loaders by filtering collections—**at build time**.

### 5.2 `src/data/`

Use for:

- **Aggregated navigation** (mega menu / footer column definitions) when not sourced from a single MD file.
- **Generated indexes** (e.g. flattened search documents) produced by **build scripts** if needed.
- **Feature flags** for MVP gating (e.g. hide Events nav)—prefer content-driven flags over scattered literals.

### 5.3 MDX policy

Enable MDX only if stories require rich embeds; keep **schema validation** on all MDX frontmatter. Long institutional prose may remain **Markdown** within collections for simplicity.

---

## 6. Department mini-site architecture

### 6.1 Definition

A **mini-site** is a **route subtree** with:

- A **department landing** page (`T_DEPARTMENT_HOME` in `DESIGN.md` §14.3).
- **Local wayfinding** — tabs or in-section nav (`DepartmentTabs` pattern in `DESIGN.md`) scoped to that department.
- **Child listings** as content exists: staff, projects, publications, services, news, downloads, contact.

### 6.2 URL baseline

- **Index:** `/departments/[department-slug]/`
- **Children** (examples; final list in stories):  
  `/departments/[slug]/staff/`  
  `/departments/[slug]/projects/`  
  `/departments/[slug]/projects/[project-slug]/`  
  `/departments/[slug]/publications/`  
  `/departments/[slug]/services/`  
  `/departments/[slug]/news/`  
  `/departments/[slug]/downloads/`  
  `/departments/[slug]/contact/`

Use **one slug scheme** for departments everywhere (`02_prd.md` §10 D3).

### 6.3 Content-driven rule

Department navigation labels, order, and “featured” blocks must come from **department frontmatter** or **`src/data`** — not hardcoded per-department components.

---

## 7. Component architecture

Alignment with **`DESIGN.md`** (§13–14): components are **named**, token-driven, and mapped to templates (`T_*`).

### 7.1 Folder layout (recommended)

```
src/components/
  ui/           # primitives: Button, Card, Input (token-bound)
  layout/       # SiteHeader, SiteFooter, MegaNavigation, UtilityNavigation
  content/      # ProseBlock, SectionHeader, Table, FAQAccordion
  departments/  # DepartmentHero, DepartmentTabs
  search/       # Search overlay, FilterChips, SearchResultCard
```

### 7.2 Rules

- **No raw hex/radius/spacing** outside tokens (`DESIGN.md` §0, §1).
- **Presentational components** accept typed props; **page shells** wire data from `getCollection` / `getEntry`.
- **Icons:** align with `DESIGN.md` sizing tokens; decorative icons `aria-hidden`.

### 7.3 Islands (future)

Framework islands (React/Vue/Svelte) are **optional** and story-gated. Prefer **zero-JS** or minimal vanilla behaviour until PRD/story justifies bundle cost (`06_project_context.md` §8).

---

## 8. Layout architecture

- **`src/layouts/BaseLayout.astro`** (or equivalent) provides `<html lang="en">`, `<main id="main">`, skip link, global SEO slots, and wraps **SiteHeader** / **SiteFooter** per `DESIGN.md` §14.
- **Template patterns:** `T_GENERIC_CONTENT`, `T_SERVICE_DETAIL`, `T_SEARCH_RESULTS`, department templates — implement as documented in `DESIGN.md` §14; section order for services is **fixed** (Clinic/DAU depth — `DESIGN.md` §14.4).
- **Width and typography:** follow `layout_width.*` and `measure.prose` from `DESIGN.md` §1 — mapped through Tailwind theme extension (see `DESIGN.md` §20 if present).

---

## 9. Data and content source rules

| Content type | Source | Notes |
| --- | --- | --- |
| Institutional copy (mandate, hero text, approvals) | `src/content` MD/MDX | Validated schemas |
| Structured lists (staff, projects, publications) | Content collections | Relationship IDs |
| Navigation / footer / quick links | `src/content` and/or `src/data` | Single source per concern |
| Binary files | `src/assets/` or `public/` | PDFs in `public/` if referenced by stable URL; optimise images via Astro assets when possible |
| **Forbidden as long-term home for truth** | Hardcoded strings in components | Allowed only for bootstrap until replaced by governed content (`06_project_context.md` §6) |

**Review metadata:** fields such as `lastReviewed` should exist on fee/contact-heavy entries (`02_prd.md` §7 C5) and surface in UI via shared components (`Table` “last updated” pattern — `DESIGN.md` §14.4).

---

## 10. Static search architecture

### 10.1 Requirements trace

`02_prd.md` §23: search must cover core types **without SSR or DB**; UX groups results by type (`03_ux_blueprint.md` §21).

### 10.2 Recommended approach (MVP)

**Primary candidate: [Pagefind](https://pagefind.app/)** (or equivalent static indexer) running **after** `astro build`, emitting a client-loaded index under `dist/`. Fits shared hosting (static files only), scales with institutional pages, and avoids shipping a large bespoke search bundle.

**Alternative:** **Precomputed JSON index** (title, url, type, excerpt) generated by a **`node`** script at build time + **client-side fuzzy search** (e.g. Fuse.js). Use when Pagefind integration is blocked; trade-off: custom maintenance.

**Third-party search** (e.g. hosted crawl/index) is acceptable **only** with privacy/host approval (`02_prd.md` §23 SR2).

### 10.3 UX contract

- Entry: utility **Search** opens overlay and/or `/search/` (`03_ux_blueprint.md` §4).
- Results: grouped sections; **type filter chips only for types present in the built index** (honesty rule — `02_prd.md` §23 SR4).
- No-results: institutional suggestions (Clinic, DAU, Departments) — `03_ux_blueprint.md` §21.3.

### 10.4 Build pipeline

Document in stories: **`npm run build`** produces site → **search index step** enriches `dist/` → **`npm run validate`** includes index generation when adopted.

---

## 11. Image and document asset architecture

### 11.1 Images

- Prefer **`astro:assets`** / `<Image />` for optimised raster images with width/height to reduce CLS (`02_prd.md` §27 PF2).
- **Alt text** mandatory in content model (`02_prd.md` §7 C4); decorative images `alt=""` per `DESIGN.md` §15.
- **Gallery/lightbox** behaviours must respect keyboard and focus (`DESIGN.md` §20; §15).

### 11.2 Documents (PDF)

- Store user-downloadable PDFs under **`public/`** (stable URL) or versioned paths with metadata in **`downloads`** collection.
- **Integrity:** updates replace files via governed process (`02_prd.md` §22 DL4).

---

## 12. Accessibility architecture

- **Design target:** WCAG **2.1 AA** per `DESIGN.md` §15 (institutional baseline).
- **Implementation obligations:** skip link, landmarks, single `h1`, visible focus (`shadow.ring_focus`), labelled forms, table semantics, motion preferences (`prefers-reduced-motion`), touch targets ≥ **44×44px** (`03_ux_blueprint.md` §6; `DESIGN.md` §15–16).
- **Manual testing:** keyboard-only passes for Clinic, DAU, department landing, and search (`02_prd.md` §33).
- **Formal audit:** Phase 2 option (`02_prd.md` §31; §35 risks).

---

## 13. SEO and metadata architecture

- **Per-page metadata:** `title`, `description`, canonical URL pattern via shared layout SEO component or Astro **`head`** slots (`02_prd.md` §26 SEO1).
- **Open Graph / Twitter:** optional fields once branding assets exist; align with `DESIGN.md` social tokens if specified.
- **`sitemap.xml` / `robots.txt`:** add **`@astrojs/sitemap`** (or static equivalents) in a dedicated story; ensure absolute URLs configurable for staging vs production.
- **Slug policy:** stable department and document slugs (`02_prd.md` §26 SEO2); avoid duplicate content across filters—use canonical rules for listing/query patterns if introduced client-side only (SEO5).
- **Legacy redirects:** **301 map** at CDN/host layer (`02_prd.md` §26 SEO4); architecture tracks required slugs; implementation depends on host.

---

## 14. Performance architecture

- **Lean JS:** default pages ship minimal scripts; defer heavy client behaviour (`02_prd.md` §27 PF1).
- **Images:** lazy-load below-fold galleries; responsive sources (`02_prd.md` §27 PF2–PF3).
- **Fonts:** if webfonts added, use `font-display` and subsetting per `DESIGN.md` typography rules.
- **Budgets:** optional Lighthouse budgets in QA (`02_prd.md` §27 PF4); representative testing on mid-tier Android (`02_prd.md` §8 goal 8).

---

## 15. Shared-hosting deployment architecture

- **Artefact:** upload **`dist/`** contents to static host root (`02_prd.md` §28 SH1).
- **No Node** on server for HTML (`06_project_context.md` §8).
- **Paths:** prefer **`base`** configuration if deploying to subdirectories; use relative/public-path patterns compatible with hosting (`02_prd.md` §28 SH2).
- **Secrets:** none required for static HTML; third-party form/search keys are **public-by-design** — review exposure (`02_prd.md` §28 SH3).
- **Caching:** long-cache hashed assets; conservative cache for `index.html` if applicable at CDN.

---

## 16. Future CMS compatibility

The Initial Brief targets **CMS-class** editorial workflows; MVP satisfies intent via **files + human process** (`02_prd.md` §29).

**Future-compatible patterns:**

- **Stable content schemas** (Zod) map cleanly to headless CMS content models later.
- **Build-time ingestion:** optional pipeline that **fetches exports** or runs codegen **before** `astro build`, still emitting **static** `dist/`.
- **Git-based editorial workflows** (PRs, protected branches) remain valid even after CMS adoption.

**Explicit boundary:** introducing **runtime** CMS reads or preview-on-host requires **ADR + constitution amendment** (`06_project_context.md` §6, §11).

---

## 17. Future app-layer separation

Should authenticated tools, dashboards, or dynamic data appear (Brief Phase 3 / `02_prd.md` §32):

- Host them as a **separate app** (e.g. Next.js, Supabase) on another origin or path, linked only where institution approves.
- **Public marketing site remains static Astro** unless governance replaces MVP assumptions.

Document interfaces between layers (links, shared branding only — **no shared DB** with public MVP unless explicitly approved).

---

## 18. Architecture decision records

| ID | Decision | Status |
| --- | --- | --- |
| ADR-001 | **Static-only public delivery** — `output: 'static'`, no SSR adapter for MVP | Accepted |
| ADR-002 | **Governed content locations** — `src/content` + `src/data` for editable truth | Accepted |
| ADR-003 | **Department subtree URLs** — `/departments/[slug]/…` mini-sites | Accepted |
| ADR-004 | **Search** — Pagefind (preferred) or build-generated JSON + client fuzzy search; hosted search only with privacy sign-off | Proposed (implement in stories) |
| ADR-005 | **Forms on static host** — third-party form endpoints or approved mailto patterns; no bespoke PHP/server on shared host | Proposed (privacy review) |
| ADR-006 | **Analytics** — optional client-side tag only after policy approval (`02_prd.md` §31) | Deferred |
| ADR-007 | **Conflict resolution** — `06_project_context.md` overrides conflicting UI docs | Accepted |

---

## 19. Forbidden patterns

Aligned with **`06_project_context.md` §11** and product constraints:

1. **SSR**, Astro **server adapters**, or **API routes** for MVP public pages.
2. **Runtime databases** or **per-request CMS/API** for core HTML.
3. **Embedding final institutional copy** only inside components without `src/content` / `src/data` migration path.
4. **SSR-only dependencies** that cannot run as build-time or client islands with static hosting.
5. **Silent search gaps** — do not omit entire content classes from the index without explicit phased labelling (`02_prd.md` §23 SR4).
6. **Broken footer/nav links** to unapproved routes (`02_prd.md` §30 footer rule).
7. ** arbitrary Tailwind values** bypassing `DESIGN.md` tokens (`DESIGN.md` §0).
8. **Parallel multi-story scope creep** against constitution story rules (`06_project_context.md` §9).

---

## 20. Implementation readiness conditions

Implementation may proceed when:

1. **Planning:** PRD (`02_prd.md`) and UX blueprint (`03_ux_blueprint.md`) are accepted for the current phase; **`DESIGN.md` v1** is the UI contract (current repo status: authoritative per `DESIGN.md` header).
2. **Architecture:** This document reviewed; **ADRs** for search and forms assigned to stories.
3. **Content architecture:** Populate or replace placeholder **`docs/03_architecture/05_content_architecture_and_cms_strategy.md`** with concrete schemas aligned to §5–9 here (currently empty in repo).
4. **Inventory:** `docs/00_source/content_inventory.md` and client feedback register populated **before** claiming migration completeness (`02_prd.md` §7 C6).
5. **Build gate:** `npm run validate` passes on `main`-candidate branches (`06_project_context.md` §10).
6. **Collections:** `src/content/config` schemas merged with seed entries for at least: global settings/footer, one department path, Clinic/DAU routes stubbed per templates.
7. **Search:** MVP index covers **home, Clinic, DAU, ≥1 department, ≥1 staff profile** acceptance path (`02_prd.md` §33).
8. **BMAD gate:** Run **`bmad-check-implementation-readiness`** after epics/stories exist (`06_project_context.md` §3).

---

*End of architecture document.*
