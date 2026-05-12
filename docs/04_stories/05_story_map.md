# CPMR — Story Map & Epic Backlog

**Project:** `cpmr-website-v5-fresh` — Centre for Plant Medicine Research institutional website  
**Document type:** BMAD implementation backlog (`4-implementation` input)  
**Authoritative inputs:**  
`docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`,  
`docs/01_planning/01_analysis.md`,  
`docs/01_planning/02_prd.md`,  
`docs/02_design/03_ux_blueprint.md`,  
`docs/02_design/DESIGN.md`,  
`docs/03_architecture/04_architecture.md`,  
`docs/03_architecture/06_project_context.md`  
**Locked constraints:** Astro `output: 'static'`, `dist/` on shared hosting; governed content in `src/content/` and `src/data/`; `DESIGN.md` v1 as UI contract (`06_project_context.md`).  
**Date:** 2026-05-12  

---

## 1. Story map overview

This story map sequences delivery so the site remains **build-valid**, **token-compliant**, and **static-hosting honest** at every increment. Epics progress from **engineering foundation** → **design system plumbing** → **global chrome and IA** → **priority surfaces** (home, about, departments, research, services) → **publishing features** (news, events, gallery, search) → **quality gates** → **deployment** → **future editorial separation notes**.

**Mapping to product intent:** Department mini-sites, Clinic/DAU clarity, and governed content are threaded early (E2–E7) so structural decisions do not late-shift routing or schemas. Search and media ship after core templates exist so indexes and galleries reference stable URLs.

**BMAD execution:** Prefer **one story per implementation cycle** unless humans override (`06_project_context.md`). Each story is sized so `npm run validate` can remain green after merge.

---

## 2. Epic order

| Order | Epic ID | Epic name |
| --- | --- | --- |
| 1 | **E0** | Foundation, repository, validation, deterministic automation baseline |
| 2 | **E1** | `DESIGN.md` and token integration |
| 3 | **E2** | Core layout, header, footer, navigation, breadcrumbs |
| 4 | **E3** | Homepage modules |
| 5 | **E4** | About and institutional pages |
| 6 | **E5** | Department mini-site engine |
| 7 | **E6** | Research, staff, and publications |
| 8 | **E7** | Services, clinic, DAU, and products |
| 9 | **E8** | News and announcements |
| 10 | **E9** | Events system |
| 11 | **E10** | Media gallery and downloads |
| 12 | **E11** | Static search |
| 13 | **E12** | Accessibility, performance, and SEO validation |
| 14 | **E13** | Shared-hosting deployment |
| 15 | **E14** | Optional CMS / future app separation notes |

---

## 3. Story sequencing rules

1. **Preserve build gate:** No story may merge if `npm run validate` fails (`06_project_context.md`).  
2. **Horizontal before vertical depth:** Global layout and navigation (E2) precede filled content verticals (E4–E10) unless a story is explicitly scaffold-only with empty collections.  
3. **Templates before bulk content:** Establish collection schemas and page shells before editorial mass-import (`02_prd.md` §7 C6).  
4. **One trailing-slash policy:** Chosen in E0/E2 and applied consistently in all new routes (`06_project_context.md`).  
5. **No broken public links:** Footer and nav omit destinations until content is approved (`02_prd.md` §30; `04_architecture.md` §19).  
6. **Relationship IDs stable:** Cross-collection references use string IDs agreed in content architecture; avoid rename churn mid-epic (`04_architecture.md` §5).  
7. **Search after discoverable routes:** E11 runs after E2 and at least one department/service/staff path exists (PRD §33 search acceptance).  
8. **Documentation-only epics:** E14 produces docs/ADRs only—no runtime scope creep.  
9. **Announcements strip vs collection:** Epic order places **E3** before **E8**; **E3-S03** may ship with a governed stub, then **E8-S01** replaces it with the `announcements` collection without changing epic sequence.

---

## 4. Dependency rules

- **Hard dependencies** block story start; **soft dependencies** signal parallelizable work with stubbed data.  
- **Content collections:** Adding a new collection or Zod schema that other routes consume is a **hard dependency** for pages that query it.  
- **Layout components:** `BaseLayout`, `SiteHeader`, `SiteFooter` are **hard dependencies** for all page-level stories after E2-S01.  
- **DESIGN tokens:** E1 completion is a **hard dependency** for any visual component story that applies colour, spacing, radius, shadow, or z-index (DESIGN.md §0).  
- **Department slug scheme:** Finalised in E5 early stories; E6/E8/E9/E10 must use the same slug keys for filters and relationships.  
- **Search index:** Depends on built HTML routes; generation runs **post-build** (E11) and must not introduce SSR (`04_architecture.md` §10).  

---

## 5. Architect gate rules

Trigger an **Architect gate** (human/architect review of `04_architecture.md`, ADRs, and constitution alignment) before merging when a story:

1. Changes **`output: 'static'`**, routing mode, or adds server adapters **(forbidden for MVP—gate catches mistakes)**.  
2. Introduces a **new content collection** or **breaking schema change** affecting multiple epics.  
3. Selects or swaps **search implementation** (Pagefind vs JSON+Fuse vs third-party) (`04_architecture.md` ADR-004).  
4. Selects **form submission mechanism** handling PII (ADR-005; privacy).  
5. Alters **`astro.config.mjs` `base`**, asset prefixes, or deployment path strategy for subdirectory hosting.  
6. Adds **islands** or significant client JS that impacts performance budgets (`06_project_context.md`).  
7. Touches **department URL subtree** contract (`/departments/[slug]/…`) in a way that changes agreed slugs or child route list.

**Default:** Stories marked **Architect gate: Yes** must not skip review. **No** means implementation can proceed within existing ADRs and schemas.

---

## 6. Definition of ready

A story is **ready** when:

1. **Inputs exist:** Upstream PRD/UX/architecture sections cited in the story are accepted for the current phase.  
2. **Content policy clear:** For editorial pages, placeholder vs verified content rules are explicit (`02_prd.md` §7).  
3. **IDs and slugs:** For department-linked stories, target department IDs exist in seed content or are explicitly stubbed with documented fake IDs **not** shown in public nav until verified.  
4. **Design contract:** Applicable `DESIGN.md` templates (`T_*`) and tokens are identified; no new visual values without token amendment.  
5. **Dependencies merged:** All hard dependency stories are done and `npm run validate` is green on `main` (or integration branch).  
6. **Gate resolved:** Architect-gated stories have approval or recorded ADR update.

---

## 7. Definition of done

A story is **done** when:

1. **`npm run validate` passes** locally and in CI if configured (`06_project_context.md`).  
2. **Acceptance criteria** in the story are met without contradicting higher documents; conflicts trigger doc updates, not silent drift.  
3. **No forbidden patterns** from `04_architecture.md` §19 and `06_project_context.md` (no SSR, no runtime CMS on public host for MVP, no silent search gaps—SR4).  
4. **Accessibility baseline:** Keyboard reachability and visible focus on new interactive UI; one `h1` per route; images have `alt` in content or `alt=""` when decorative (`DESIGN.md` §15).  
5. **Governed copy:** New institutional strings live in `src/content/` or `src/data/` when they represent durable truth (`06_project_context.md`).  
6. **Review:** Code review complete; architect gate satisfied if required.  
7. **Documentation:** If behaviour affects editors or deployers, `README` or `docs/` updated in the same story when small and scoped.

---

## 8. Epics and stories

### Epic E0 — Foundation, repository, validation, deterministic automation baseline

**Goal:** Repository builds cleanly, folder conventions exist, validation is the merge gate, and scaffolding supports content collections.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E0-S01 | Repository baseline and scripts | As a developer, I want consistent npm scripts so that build and validation are deterministic. | `package.json` exposes `dev`, `build`, `preview`, `validate` per constitution; `validate` runs `astro build`; Node engine matches `package.json`. | None | `package.json`, `astro.config.mjs` | Yes | `id: E0-S01`, `epic: E0`, `type: chore`, `estimate: S` |
| E0-S02 | Astro static output guardrails | As a maintainer, I want static output enforced so that shared hosting remains valid. | `output: 'static'` in `astro.config.mjs`; no server adapter added; comment or doc pointer to constitution. | E0-S01 | `astro.config.mjs` | Yes | Flag `static_output: true` in YAML frontmatter |
| E0-S03 | Source tree conventions | As a developer, I want predictable folders for components, layouts, content, and data. | Directories exist per `04_architecture.md` §7.1 (`src/components/{ui,layout,content,departments,search}`, `src/layouts`, `src/pages`, `src/content`, `src/data`, `src/styles`); empty dirs have `.gitkeep` if required by tooling. | E0-S01 | `src/**` | No | Add `paths_touched` array |
| E0-S04 | Content collections bootstrap | As a developer, I want a single content config entry point so schemas can grow safely. | `src/content/config.ts` or `src/content.config.ts` (per Astro 6 project convention) exists with at least one trivial collection or placeholder export that builds. | E0-S01 | `src/content.config.ts` or `src/content/config.ts`, `tsconfig.json` | Yes | Reference `collections` list when added |
| E0-S05 | Global stylesheet entry | As a developer, I want one Tailwind v4 entry file so tokens map once. | `src/styles/global.css` imports Tailwind; wired in layout; build succeeds. | E0-S01 | `src/styles/global.css`, layouts | No | Pair with E1 for `@theme` fill |
| E0-S06 | Error page shell | As a visitor, I want a styled 404 so broken links do not feel abandoned. | `src/pages/404.astro` renders inside base HTML shell; links back home; build includes route. | E0-S05 | `src/pages/404.astro` | No | `template: error` |
| E0-S07 | Editor onboarding stub | As an editor, I want a short doc explaining governed files vs components. | `README.md` or `docs/` snippet describes `src/content` + `src/data` ownership and build preview commands (`02_prd.md` §29). | E0-S03 | `README.md` | No | `audience: editors` |

---

### Epic E1 — DESIGN.md and token integration

**Goal:** Tailwind v4 `@theme` mirrors DESIGN.md §1; agents cannot bypass tokens accidentally.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E1-S01 | Token transcription to `@theme` | As a UI developer, I want tokens in CSS so Tailwind utilities match DESIGN.md. | `src/styles/global.css` `@theme` block matches DESIGN.md §20 canonical mapping for colours, type scale, radii, shadows, z-index layers used in §1; no stray invented tokens. | E0-S05 | `src/styles/global.css`, `docs/02_design/DESIGN.md` | Yes | Version tokens `meta.version` from DESIGN.md |
| E1-S02 | Semantic utility aliases | As a developer, I want `bg-surface-*` and `text-text-*` classes aligned to tokens. | Utility classes used in DESIGN.md examples resolve via theme; smoke test page or Storybook-like static preview optional—not required if documented sample in comments. | E1-S01 | `src/styles/global.css` | No | List `tailwind_semantic_aliases` |
| E1-S03 | Typography loading strategy | As a designer, I want Inter and Source Serif 4 available without layout shift. | Fonts loaded per DESIGN.md font stacks; `font-display` acceptable; no CLS regressions on sample layout. | E1-S01 | `src/styles/global.css`, `src/layouts/*` | No | `fonts: [inter, source-serif-4]` |
| E1-S04 | UI primitives package | As a developer, I want Button, Card, and Icon wrappers using tokens only. | Components in `src/components/ui/` use semantic utilities; no forbidden arbitrary values (`06_project_context.md`); focus ring uses `shadow.ring_focus` token. | E1-S02 | `src/components/ui/**` | No | Map each component `name` for YAML |
| E1-S05 | Token compliance checklist | As a reviewer, I want a short checklist to reject arbitrary Tailwind in PRs. | Documented checklist references DESIGN.md §0 forbidden list; linked from `CONTRIBUTING` or `README`. | E1-S04 | `CONTRIBUTING.md` or `README.md` | No | `qa: design-token-lint-manual` |

---

### Epic E2 — Core layout, header, footer, navigation, breadcrumbs

**Goal:** Implement `DESIGN.md` layout components and UX blueprint navigation behaviours.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2-S01 | Base layout shell | As a visitor, I want skip link, landmarks, and a single main region on every page. | `BaseLayout.astro` provides `<html lang="en">`, skip link to `#main`, `<main id="main">`, slots for SEO; matches DESIGN.md §15 baseline. | E1-S04 | `src/layouts/BaseLayout.astro` | No | `template: T_BASE` |
| E2-S02 | Site header composition | As a visitor, I want branding and primary navigation entry points visible on desktop. | Header uses tokens; contains logo, utility slot, nav trigger; keyboard focus order logical. | E2-S01 | `src/components/layout/SiteHeader.astro` | No | `component: SiteHeader` |
| E2-S03 | Utility navigation | As a user, I want Clinic, DAU, Downloads, Publications, Contact, Search one click away on large screens. | Utility links match `03_ux_blueprint.md` §4; visible labels; `aria-current` on active route; real `<a href>`. | E2-S02 | `src/components/layout/UtilityNavigation.astro`, `src/data/navigation.ts` | No | `ia: utility_nav` |
| E2-S04 | Mega navigation (desktop) | As a researcher, I want deep IA without hunting. | Mega panel opens with keyboard; `aria-expanded`; columns match blueprint §5; no hover-only traps. | E2-S02 | `src/components/layout/MegaNavigation.astro` | No | `breakpoint: lg` |
| E2-S05 | Mobile navigation drawer | As a mobile user, I want Quick links then IA accordions. | Drawer order matches blueprint §6; accordion buttons `aria-expanded`; touch targets ≥44px. | E2-S04 | `src/components/layout/MobileNavigation.astro` | No | `a11y: drawer` |
| E2-S06 | Footer depth | As a visitor, I want institutional links and contact clarity in the footer. | Multi-column footer sourced from `src/data` or collection; no links to unapproved routes; contact block present. | E2-S01 | `src/components/layout/SiteFooter.astro`, `src/data/footer.ts` | No | `template: footer_deep` |
| E2-S07 | Breadcrumbs component | As a user, I want context on deep pages. | `Breadcrumbs.astro` renders trail; current page not over-linked; matches DESIGN.md component registry. | E2-S01 | `src/components/layout/Breadcrumbs.astro` | No | `component: Breadcrumbs` |
| E2-S08 | Navigation data single source | As a maintainer, I want mega + mobile + footer driven from one structured definition. | Single `src/data` module exports nav model consumed by header/footer; typing explicit. | E2-S03–E2-S06 | `src/data/navigation.ts`, types | Yes | `schema: navigation_v1` |

---

### Epic E3 — Homepage modules

**Goal:** Implement PRD §8 / blueprint §7 homepage modules from governed content.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E3-S01 | Home route and hero | As a first-time visitor, I understand what CPMR is within seconds. | `/` uses `BaseLayout`; Hero pulls from `src/content` entry; one optional primary link max (DESIGN.md §19). | E2-S01, E1-S01 | `src/pages/index.astro`, `src/content/home/*` | No | `module: H1` |
| E3-S02 | Quick access grid | As a patient, I reach Clinic or DAU in one click from home. | Six tiles: Clinic, DAU, Departments, Publications, Products, Contact; each real `href`; keyboard operable. | E3-S01 | `src/components/content/QuickAccessCard.astro`, `src/pages/index.astro` | No | `module: H2`, PRD H2 |
| E3-S03 | Announcements strip | As a citizen, I see urgent notices without clutter. | Strip shows ≤2 items; high contrast; governance fields from content; non-dismissible default. May use an interim home-section stub until **E8-S01** introduces the `announcements` collection and rewires the strip. | E3-S01 | `src/pages/index.astro`, later `src/content/announcements/*` | No | `module: H3`; coordinate with E8-S01 |
| E3-S04 | Mandate snapshot | As a stakeholder, I grasp legal/social role quickly. | Short copy block + link to About/Mandate; content-driven. | E3-S01 | `src/content/home/*` | No | `module: H4` |
| E3-S05 | Research & department previews | As a researcher, I see pathways into science work. | Sections render cards with links to Research and Departments; empty states honest. | E3-S01, E5-S02 (soft stub OK) | `src/pages/index.astro`, components | No | `modules: [H5,H6]` |
| E3-S06 | Services & products previews | As a user, I discover operational offerings responsibly. | Services subset + product categories with disclaimer microcopy; links valid or hidden. | E3-S01 | `src/pages/index.astro`, content | No | `modules: [H7,H8]` |
| E3-S07 | News & events row | As a media user, I see recency. | Split layout or tabs; news pulls from collection when **E8-S02** exists; events row may use stub/empty honest state until **E9-S02**, then wire events collection. | E3-S01, E8-S02 | `src/pages/index.astro` | No | `modules: [H9]`; events wiring follows E9 |
| E3-S08 | Publications / resources teaser | As an academic, I find evidence entry points. | Teaser chooses publications OR priority download editorially via content flag. | E3-S01, E6-S04 | `src/pages/index.astro` | No | `module: H10` |
| E3-S09 | Partners band | As a partner, I see credibility markers. | Logo strip with accessible names; outbound policy text where needed. | E3-S01 | `src/content/home/*`, assets | No | `module: H11` |
| E3-S10 | Homepage integration QA | As QA, I want no duplicate H1 and stable CLS. | Lighthouse smoke optional; headings ordered; images sized; `npm run validate` green. | E3-S01–E3-S09 | `src/pages/index.astro` | No | `qa: homepage` |

---

### Epic E4 — About and institutional pages

**Goal:** Deliver About hub and priority institutional subpages (`T_GENERIC_CONTENT`).

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E4-S01 | About hub | As a government reader, I find institutional depth from a single hub. | `/about/` lists subpages; side nav on desktop; mobile “In this section” pattern per blueprint §8. | E2-S07 | `src/pages/about/index.astro` | No | `route: /about/` |
| E4-S02 | Overview & History | As a citizen, I learn narrative and milestones. | Routes `/about/overview/`, `/about/history/` with `T_GENERIC_CONTENT`; timeline accessible if present. | E4-S01 | `src/pages/about/**/*.astro`, `src/content/pages/*` | No | `templates: [T_GENERIC_CONTENT]` |
| E4-S03 | Mandate & Vision/Mission | As a stakeholder, I see formal mandate statements. | Separate routes; paired vision/mission layout desktop side-by-side. | E4-S01 | `src/pages/about/**`, content | No | Verified copy only |
| E4-S04 | Leadership profiles listing | As media, I access leadership bios without placeholders. | Listing + detail; photos alt text; **no placeholder names** at launch readiness (`02_prd.md`). | E4-S01, E6-S03 | `src/pages/about/leadership/**`, `src/content/staff/*` | No | `risk: verified_bios` |
| E4-S05 | Board & Management tables | As a researcher, I verify governance bodies. | Accessible tables with captions; responsive stacking per DESIGN.md. | E4-S01 | `src/pages/about/**`, components `Table` | No | `a11y: tables` |
| E4-S06 | Organisation structure | As a visitor, I understand institutional structure. | Diagram with linearised text alternative (`03_ux_blueprint.md` §8). | E4-S01 | `src/pages/about/organisation/**` | No | `asset: org-chart` |
| E4-S07 | Awards & Partners | As an international partner, I assess credibility. | Awards list; Partners & Affiliations grid with outbound link policy. | E4-S01 | `src/pages/about/**`, assets | No | `modules: awards_partners` |

---

### Epic E5 — Department mini-site engine

**Goal:** Implement `/departments/[slug]/…` subtree, local navigation, and relationship surfacing at build time.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E5-S01 | Departments index | As a user, I browse verified departments. | `/departments/` lists departments from collection; unverified omitted from public nav policy (`03_ux_blueprint.md` §10.4). | E0-S04 | `src/pages/departments/index.astro`, `src/content/departments/*` | Yes | `collection: departments` |
| E5-S02 | Department landing template | As a visitor, I experience a department as a “place”. | `T_DEPARTMENT_HOME` (`DESIGN.md` §14.3) composed; department hero + tabs; sections stubbed honestly when empty. | E5-S01, E2-S07 | `src/pages/departments/[slug]/index.astro`, `src/components/departments/**` | Yes | `template: T_DEPARTMENT_HOME` |
| E5-S03 | Department local navigation | As a user, I move within a department without returning to global home. | `DepartmentTabs` sticky desktop; mobile strategy per DESIGN.md; labels from department frontmatter. | E5-S02 | `src/components/departments/DepartmentTabs.astro` | No | `component: DepartmentTabs` |
| E5-S04 | Department staff listing | As a visitor, I meet the team. | `/departments/[slug]/staff/`; filters client-side basic; cards accessible. | E5-S02, E6-S03 | `src/pages/departments/[slug]/staff.astro` | No | `route: dept_staff` |
| E5-S05 | Department projects listing | As a researcher, I see departmental projects. | `/departments/[slug]/projects/` filters projects by `departmentId`. | E5-S02, E6-S02 | `src/pages/departments/[slug]/projects/**` | No | `relationship: departmentId` |
| E5-S06 | Department publications listing | As an academic, I filter publications by department. | `/departments/[slug]/publications/` inherits list item pattern (`DESIGN.md`). | E5-S02, E6-S04 | `src/pages/departments/[slug]/publications.astro` | No | `reuse: PublicationItem` |
| E5-S07 | Department services & news | As a visitor, I see services and updates scoped to department. | Routes for `/services/` subset and `/news/` filtered; honest empty states. | E5-S02, E7-S01, E8-S02 | `src/pages/departments/[slug]/**` | No | `routes_parallel` |
| E5-S08 | Department downloads & contact | As a manufacturer, I obtain forms and contacts. | Downloads list + contact block using governed data; no personal phones unless policy allows. | E5-S02, E10-S03 | `src/pages/departments/[slug]/downloads.astro`, contact | No | `pii_policy` |
| E5-S09 | Department relationship QA | As QA, cross-links resolve at build time. | Build walks collections; broken foreign IDs fail build or log—strategy documented. | E5-S02 | scripts optional | Yes | `build_time_integrity` |

---

### Epic E6 — Research, staff, and publications

**Goal:** Research hub, projects, publications repository, researcher profiles.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E6-S01 | Research hub | As a researcher, I start discovery from an institutional overview. | `/research/` narrative + links to themes, projects, publications, profiles (`03_ux_blueprint.md` §9). | E2-S07 | `src/pages/research/index.astro`, content | No | `route: /research/` |
| E6-S02 | Research projects index & detail | As a scientist, I read structured project stories. | Index + `/research/projects/[slug]/`; fields per PRD §11 R2; relationships wired. | E6-S01, E0-S04 | `src/pages/research/projects/**`, `src/content/projects/*` | Yes | `collection: projects` |
| E6-S03 | Staff directory & profiles | As a user, I browse people with filters. | Global `/research/researchers/` or agreed path; profile template; dept links. | E0-S04 | `src/pages/research/**`, `src/content/staff/*` | No | `filters: client` |
| E6-S04 | Publications library | As an academic, I search and filter publications. | Listing + detail; filters static-compatible (`02_prd.md` §12 P2); PDF gating respected. | E6-S01 | `src/pages/research/publications/**`, `src/content/publications/*` | Yes | `collection: publications` |
| E6-S05 | Research facilities & collaboration | As a partner, I assess infrastructure and contact pathways. | Facilities page + collaboration contact template. | E6-S01 | `src/pages/research/**`, content | No | `routes: facilities_collab` |

---

### Epic E7 — Services, clinic, DAU, and products

**Goal:** Operational templates (`T_SERVICE_DETAIL`), fees-as-content, products institutional framing.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E7-S01 | Services hub | As a visitor, I understand available services grouped logically. | `/services/` grouped links; Clinic & DAU promoted first (`03_ux_blueprint.md` §15). | E2-S07 | `src/pages/services/index.astro` | No | `route: /services/` |
| E7-S02 | Generic service template | As an editor, I reuse one deep template for non-priority services. | Implements fixed section order when sections exist (`DESIGN.md` §14.4); skips empty sections. | E7-S01 | `src/pages/services/[slug].astro`, `src/content/services/*` | No | `template: T_SERVICE_DETAIL` |
| E7-S03 | Clinic service page | As a patient, I complete the Clinic journey from home. | `/services/clinic/` meets PRD §15; quick tel/mailto/maps; fees tables accessible; last-reviewed surfaced. | E7-S02 | `src/pages/services/clinic.astro` or nested, content | No | `priority: P0` |
| E7-S04 | Drug Analysis Unit page | As a manufacturer, I follow submission steps confidently. | `/services/drug-analysis-unit/` meets PRD §16; FAQs; downloadable forms in `public/` or downloads collection. | E7-S02 | `src/pages/services/drug-analysis-unit.astro`, files | No | `priority: P0` |
| E7-S05 | Service fees hub | As finance, I find authoritative fee references. | `/services/fees/` explains dating + links to service pages; accessible tables. | E7-S01 | `src/pages/services/fees.astro`, content | No | `metadata: lastReviewed` |
| E7-S06 | Products overview & categories | As a citizen, I browse products responsibly. | `/products/` + category routes per PRD §17; disclaimers; enquiry path; no checkout. | E2-S07 | `src/pages/products/**`, `src/content/products/*` | No | `commerce: false` |
| E7-S07 | Product detail pages | As a user, I read one product’s facts. | Detail template with image, responsible-use note, enquiry CTA. | E7-S06 | `src/pages/products/**` | No | `template: product_detail` |

---

### Epic E8 — News and announcements

**Goal:** Distinct news vs announcements templates; archives; honest states.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E8-S01 | Announcements collection & surfaces | As communications, I publish urgent notices. | `announcements` collection schema lands; homepage strip from **E3-S03** reads entries (`02_prd.md` §19). | E0-S04, E3-S03 | `src/content/announcements/*`, `src/pages/index.astro` | No | `collection: announcements` |
| E8-S02 | News listing & detail | As media, I read institutional stories. | `/news/` grid; detail pages; fields per PRD §18; related dept/project optional. | E0-S04 | `src/pages/news/**`, `src/content/news/*` | No | `collection: news` |
| E8-S03 | News archive pagination | As a researcher, I browse older items. | Static pagination via `getStaticPaths`; stable URLs. | E8-S02 | `src/pages/news/**` | No | `pagination: static` |
| E8-S04 | Announcements archive | As a citizen, I review past notices. | Archive page; priority styling; no clutter with news cards. | E8-S01 | `src/pages/announcements/**` | No | `route: /announcements/` |

---

### Epic E9 — Events system

**Goal:** Events listing, detail, past events, calendar-friendly grouping.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E9-S01 | Events collection | As an editor, I manage events with venues and times. | Schema matches PRD §20; timezone handling documented. | E0-S04 | `src/content/events/*` | Yes | `collection: events` |
| E9-S02 | Events listing grouped by month | As a visitor, I scan upcoming events. | `/events/` list grouped with sticky month headings (`DESIGN.md` §14.5). | E9-S01 | `src/pages/events/index.astro` | No | `ux: monthly_groups` |
| E9-S03 | Event detail pages | As a user, I register or learn details. | Detail route; registration link optional; related department. | E9-S01 | `src/pages/events/[slug].astro` | No | `template: event_detail` |
| E9-S04 | Past events archive | As an institution, I retain historical record. | Archived events accessible; status field respected. | E9-S02 | `src/pages/events/**` | No | `filter: status` |

---

### Epic E10 — Media gallery and downloads

**Goal:** Gallery albums, accessible lightbox behaviours; downloads centre with filters.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E10-S01 | Media gallery collections | As media staff, I publish albums with captions. | Schema supports albums, captions, alt text, optional relations (`02_prd.md` §21). | E0-S04 | `src/content/gallery/*` | No | `collection: gallery` |
| E10-S02 | Gallery listing & album pages | As a visitor, I browse institutional photography. | Listing + album routes; keyboard navigable carousels if used (`DESIGN.md` §15). | E10-S01 | `src/pages/media/**` | No | `routes: /media/` |
| E10-S03 | Downloads centre | As a user, I find PDFs and forms quickly. | `/resources/downloads/` or `/downloads/` **single root chosen** (`04_architecture.md` §4.2); filters client-side; metadata displayed. | E0-S04 | `src/pages/resources/downloads/**`, `src/content/downloads/*` | Yes | `route_root_decision` |
| E10-S04 | Download integrity workflow | As an editor, I replace files safely. | Docs describe replacement + changelog expectation (`02_prd.md` §22 DL4). | E10-S03 | `docs/**`, `README` | No | `process: downloads` |

---

### Epic E11 — Static search

**Goal:** Implement ADR-004 pattern—Pagefind preferred—with honest coverage.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E11-S01 | Search UX shell | As a user, I open search from utility nav. | Overlay or `/search/` route; focus management and Escape close (`03_ux_blueprint.md` §4). | E2-S03 | `src/components/search/**`, `src/pages/search/index.astro` | No | `ux: search_entry` |
| E11-S02 | Pagefind integration post-build | As a builder, I generate a static index after `astro build`. | Script wires Pagefind (or chosen ADR) into `package.json` build pipeline; `validate` includes index gen when enabled. | E11-S01 | `package.json`, `scripts/**`, `dist/` | Yes | `adr: ADR-004` |
| E11-S03 | Result grouping & filters | As a user, I scan results by content type. | `T_SEARCH_RESULTS` (`DESIGN.md` §14.6); chips only for types present—SR4 honesty. | E11-S02 | `src/pages/search/**`, components | No | `nfr: SR4` |
| E11-S04 | No-results helpful pathways | As a visitor, I am guided when search fails. | Suggestions to Clinic, DAU, Departments (`03_ux_blueprint.md` §21). | E11-S03 | `src/components/search/EmptyState.astro` | No | `copy: empty_state` |
| E11-S05 | Search QA acceptance suite | As QA, I verify PRD search MVP path. | Tests/manual script proves: user can find Clinic, DAU, ≥1 department, ≥1 staff profile (`02_prd.md` §33). | E11-S02, E5-S01, E7-S03–E7-S04, E6-S03 | `tests/**` or checklist doc | No | `acceptance: PRD_SR` |

---

### Epic E12 — Accessibility, performance, and SEO validation

**Goal:** Enforce WCAG-oriented baseline, performance discipline, sitemap/robots/metadata.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E12-S01 | Critical keyboard journeys | As a keyboard user, I complete Clinic, DAU, dept landing, search. | Documented manual pass; fixes for blockers. | E7-S03–E7-S04, E5-S02, E11-S01 | multiple | No | `a11y: critical_paths` |
| E12-S02 | SEO layout slots | As SEO, I need titles/descriptions/canonicals. | Shared SEO component; unique titles per route class. | E2-S01 | `src/layouts/BaseLayout.astro`, components | No | `seo: base` |
| E12-S03 | Sitemap & robots | As search engines, I discover public URLs. | `@astrojs/sitemap` or static equivalents; robots rules documented. | E12-S02 | `astro.config.mjs`, `package.json` | Yes | `pkg: @astrojs/sitemap` |
| E12-S04 | Performance image hygiene | As a mobile user, pages stay fast. | Below-fold lazy loading; responsive images for heavy pages (`02_prd.md` §27). | E1-S01 | `src/components/**`, content images | No | `perf: images` |
| E12-S05 | Representational device testing | As QA, we validate mid-tier Android experience. | Short report attached to release notes or doc; issues filed. | E12-S04 | `docs/**` | No | `qa: device_matrix` |

---

### Epic E13 — Shared-hosting deployment

**Goal:** Document and verify static artefact deployment with optional `base` for subdirectory hosting.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E13-S01 | Deployment runbook | As an operator, I deploy `dist/` safely. | Steps for uploading static root; cache guidance; no Node on server (`02_prd.md` §28). | E0-S02 | `docs/**` | No | `ops: deploy_static` |
| E13-S02 | Base path verification | As an operator hosting under a subfolder, links resolve. | If `base` required, demonstrate config + link behaviour; no asset 404s. | E13-S01 | `astro.config.mjs` | Yes | `hosting: subdirectory` |
| E13-S03 | Redirect note placeholder | As SEO, I plan legacy 301s. | Document depends on inventory (`02_prd.md` §26 SEO4); no fake redirects. | E13-S01 | `docs/**` | No | `blocked_by: inventory` |
| E13-S04 | Release checklist | As a PM, I gate launches. | Checklist ties PRD §33 acceptance rows to verifiable checks. | E12-S03, E11-S05 | `docs/**` | No | `gate: launch` |

---

### Epic E14 — Optional CMS / future app separation notes

**Goal:** Capture governance-approved directions without implementing runtime CMS in MVP.

| Story ID | Title | User story | Acceptance criteria | Dependencies | Files likely affected | Architect gate | Notes for YAML conversion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E14-S01 | Headless CMS pipeline sketch | As a future PM, I know how CMS could feed static builds. | Document outlines build-time ingestion only; constitution caveats (`04_architecture.md` §16). | None | `docs/03_architecture/**` | Yes | `future: cms_pipeline` |
| E14-S02 | Separate app layer boundaries | As an architect, I prevent scope bleed into public site. | Document interfaces per `04_architecture.md` §17—public Astro remains static. | E14-S01 | `docs/03_architecture/**` | Yes | `future: app_layer` |
| E14-S03 | Editorial roles mapping | As an editor-in-chief, I map Brief roles to git/PR workflow. | Table maps Brief roles (`02_prd.md` §29 CM2) to human workflow steps. | E14-S01 | `docs/**` | No | `process: editorial` |

---

## Appendix — ID scheme for YAML automation

- **Story IDs** follow `E{epic}-S{seq}` for stable references in `docs/stories/*.yml`.  
- **Epic field** should mirror `E0`…`E14` exactly as in this document’s epic order table.  
- **Architect gate** boolean maps to `requires_arch_review: true|false`.  
- **Files likely affected** should expand into YAML `paths_glob` or explicit list per repo conventions.

---

*End of story map.*
