# BMAD execution ledger — content architecture remediation

**Purpose:** Human-readable traceability for programme execution and remediation, satisfying **REM-CARCH-001** and **docs/03_architecture/05_content_architecture_and_cms_strategy.md** §20 (handoff: backlog / story discipline).

**Authoritative content architecture:** `docs/03_architecture/05_content_architecture_and_cms_strategy.md` **v1.0.0**

**Machine-readable mirror:** `_bmad-output/execution/backlog.json` (schema version in `meta.schema_version`)

**Audit baseline:** `docs/05_qa/retroactive_content_architecture_validation_report.md`

**Remediation plan:** `docs/06_delivery/content_architecture_remediation_execution_plan.md`

---

## Single source of truth (agreed for this programme)

| Artefact | Role |
| --- | --- |
| `docs/stories/*.yml` | Authoritative for **per-story** narrative, acceptance criteria, and formal status fields owned by story workflow. |
| `_bmad-output/execution/backlog.json` | Authoritative **machine-readable** mirror for **remediation IDs**, **programme gates**, **story_corrections**, **safe_order**, and cross-audit linkage (`meta.source_audit`, `meta.architecture_baseline`). |
| This ledger | **Human-readable** programme state: active blockers, reopen reasons, remediation queue, architect gate log. |

If automation later exports JSON from YAML, update `meta` in `backlog.json` and add a row under **Architect gate log** — do not silently retire this folder without an ADR.

---

## 1. Programme blockers (active)

Aligned with **execution plan §11** and `backlog.json` → `programme_gates`.

| ID | Class | Statement |
| --- | --- | --- |
| **B-PROG-009** | IMMEDIATE_BLOCKER (CONTENT-ARCH-RETRO-009) | No epic **E4–E11** may be marked complete without **05**-aligned schemas, routes, and validation discipline. |
| **B-TRUTH-E1S05** | Story truth (CONTENT-ARCH-RETRO-007) | **Update (2026-05-14):** `CONTRIBUTING.md` landed under **REM-CARCH-008** (see **§7**). Programme must flip **`docs/stories/E1-S05-token-compliance-checklist.yml`** from `PROCESS_FIX_REQUIRED` recommendation to **`QA_REVIEW` / `DONE`** after checklist sign-off — do not silently re-close without QA. |
| **B-SETTINGS** | Technical readiness (CONTENT-ARCH-RETRO-003) | **Update (2026-05-14):** **`settings`** collection + seeds landed under **REM-CARCH-003**; **REM-CARCH-004** wires the deep footer contact block to **`contact`** (see **§10**). **REM-CARCH-005** (canonical + default document / OG / Twitter meta from **`site`** + **`seo_defaults`**) is **implemented in repo** — see **§11**; human architect / PM ack still recommended before treating **E12-S02** SEO claims as fully signed. |

---

## 2. Story corrections and reopen posture

From `backlog.json` → `story_corrections` (summaries; see JSON for exact `recommended_status`).

| Story | Recommended status | Linked remediation | Reason (short) |
| --- | --- | --- | --- |
| **E1-S05** | PROCESS_FIX_REQUIRED | REM-CARCH-008 | `CONTRIBUTING.md` missing vs AC. |
| **E2-S08** | ARCHITECT_REVIEW | REM-CARCH-007 | Gate evidence must cite **05**; YAML / process hygiene. |
| **E3** (epic) | PARTIAL (reporting) | — | Only **E3-S01** delivered vs story map scope. |

---

## 3. Remediation stories (queue)

PR links are filled when merged; until then use branch / commit SHA in PR description.

| ID | Title | Classification | Dependencies | PR |
| --- | --- | --- | --- | --- |
| REM-CARCH-001 | Execution artefact restoration or ADR | REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES | — | *(this change)* |
| REM-CARCH-002 | README cites 05 content architecture | REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES | — | Evidence §8 |
| REM-CARCH-003 | settings singleton collection bootstrap | IMMEDIATE_BLOCKER | — | **Implemented (working tree)** — see **§9**; formal PR / gate sign-off TBD |
| REM-CARCH-004 | Footer contact lines sourced from settings | REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES | REM-CARCH-003 | **Implemented (working tree)** — see **§10**; formal PR / gate sign-off TBD |
| REM-CARCH-005 | Canonical URLs and default SEO meta from settings | REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES | REM-CARCH-003 | **Implemented (working tree)** — see **§11**; formal PR / gate sign-off TBD |
| REM-CARCH-006 | refs.ts build-time integrity utilities | REQUIRED_BEFORE_FIRST_BULK_CROSS_COLLECTION_IMPORT | REM-CARCH-003 | **Implemented 2026-05-14** — see **§13** |
| REM-CARCH-007 | Navigation compiler versus nav collection decision record | REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES | — | **Implemented 2026-05-14** — see **§12** |
| REM-CARCH-008 | Add CONTRIBUTING.md token checklist | IMMEDIATE_BLOCKER | — | **Implemented 2026-05-14** — see **§7** |

**Safe order (from `backlog.json`):** REM-CARCH-001 → REM-CARCH-008 → REM-CARCH-002 → REM-CARCH-003 → REM-CARCH-004 → REM-CARCH-005 → REM-CARCH-007 → REM-CARCH-006 → **E11-S02** (Pagefind / validate; defect 005).

---

## 4. Deferred to epic stories

| Defect | Target story | Classification |
| --- | --- | --- |
| CONTENT-ARCH-RETRO-005 | E11-S02 | SAFE_TO_DEFER |

---

## 5. Architect gate log

| Date | Story / gate | Approver | Doc refs (must include **05** where required) | Outcome |
| --- | --- | --- | --- | --- |
| 2026-05-14 | **REM-CARCH-003** (`settings` collection) | *(pending named approver)* | **05 §4.1**, **05 §156–162** (editorial envelope, `index_behavior`, SEO envelope on `site` / `seo_defaults`) | **Implemented in repo:** `src/content.config.ts` + `src/content/settings/{site,footer,contact,seo_defaults}.md`; `npm run build` / `npm run validate` green. Human architect ack still recommended before declaring programme gate fully “signed”. |
| 2026-05-14 | **REM-CARCH-004** (footer contact from `settings`) | *(pending named approver)* | **05 §3**, **05 §4.1** (`contact` singleton, `index_behavior: exclude`) | **Implemented in repo:** `getFooterContactFromSettings()` + `SiteFooter.astro`; build/validate green. Human architect ack still recommended. |
| 2026-05-14 | **REM-CARCH-005** (canonical + default SEO meta) | *(pending named approver)* | **05 §12.2** (canonical + settings base URL), **05 §4.1** (`site`, `seo_defaults`), **05 §4.15** (`home` hero not used as SEO envelope) | **Implemented in repo:** `public_site_url` on **`site`**; `BaseLayout.astro` reads **`settings`** at build time; `/` uses **`seo_defaults`** when props omitted; `trailingSlash: 'always'` in **`astro.config.mjs`**. `npm run build` / `npm run validate` green. Human architect ack on production URL + slash policy still recommended. |
| 2026-05-14 | **REM-CARCH-007** (nav compiler vs `nav` collection) | *(pending named approver)* | **05 §2.3** (single navigation graph), **05 Appendix B.4**, **05 §15**, **05 §20** | **Decision record:** `docs/03_architecture/07_navigation_compiler_vs_nav_collection_decision.md`; **E2-S08** `context_files` + `qa_checklist` updated; **`src/data/navigation.ts`** header comment links decision. Doc-first + comment-only in `src/data`; no new collection, routes, or search paths. |
| 2026-05-14 | **REM-CARCH-006** (`refs.ts` integrity utilities) | *(pending named approver)* | **05 §2.5**, **05 §4**, **05 §19 item 3**, **05 §6.1** (`staff:` tokens) | **Implemented in repo:** `src/lib/content/refs.ts` + build-time smoke from **`src/content.config.ts`**; fail/warn matrix documented in-module; `npm run build` / `npm run validate` green. Human architect ack on tightening scholarly → fail still recommended before regulated bulk import. |
| 2026-05-15 | **E5-S01** (`departments` collection + index) | Winston / programme architect gate | **04 §5–§6**, **05 §4.3**, **ADR-003**, UX Blueprint **§10.4** | **PASS** — `departments` Zod union (`department` \| `index_shell`); kebab-case `id` = filename stem; public index filters `editorial_status: approved` **and** `verified: true`; static `getCollection` only; `automation/architect_gates.yml` updated. **Conditions:** (1) amend **05 §4.3** to document `index_shell` + `verified` when convenient; (2) E5-S02 must ship department landings before enabling global nav/deep links to card URLs; (3) extend index filter to exclude `archived` when archived seeds exist. |

---

## 6. REM-CARCH-001 evidence

- **2026-05-14:** Created `_bmad-output/execution/execution-ledger.md` (this file). Confirmed `_bmad-output/execution/backlog.json` present and aligned with **execution plan Appendix B** fields (programme gates, remediation rows, safe order).
- **Rule satisfied:** **05 §20** — execution/backlog handoff visibility for agents and programme control; no change to Astro routes, collections, or search code paths.

---

## 7. REM-CARCH-008 evidence

- **2026-05-14:** Added repository-root **`CONTRIBUTING.md`** satisfying **CONTENT-ARCH-RETRO-007** / **execution plan** remediation **REM-CARCH-008** (parent **E1-S05**).
- **Contents:** (a) PR reviewer **token compliance checklist** aligned with **`docs/02_design/DESIGN.md` §0** forbidden list; (b) short **content placement checklist** explicitly traced to **`docs/03_architecture/05_content_architecture_and_cms_strategy.md`** (doc **05** §2 / §4 themes — identifiers, `src/content/` vs `src/data/`, no ad-hoc models); (c) merge gate reminder `npm run validate` / `npm run build`.
- **Rules satisfied:** **05** — editorial governance and reviewer discipline for static collections; **DESIGN.md** — zero-tolerance styling list referenced with link; **validation report** defect **007** remediation path (“Add `CONTRIBUTING.md` with token forbidden patterns checklist referencing `DESIGN.md` §0”).
- **Intentionally unchanged:** `README.md` (separate backlog item **REM-CARCH-002**); `src/**` (no runtime, route, collection, or Pagefind behaviour touched — **SR4** / search indexing unchanged).

---

## 8. REM-CARCH-002 evidence

- **2026-05-14:** Updated repository-root **`README.md`** so onboarding and the **“Where content lives (for editors)”** section explicitly cite **doc 05** at `docs/03_architecture/05_content_architecture_and_cms_strategy.md` (baseline v1.0.0), alongside `docs/03_architecture/04_architecture.md` and `docs/03_architecture/06_project_context.md`, with roles distinguished per **execution plan REM-CARCH-002** acceptance criteria.
- **Collection placement sentence** now states **05** as the specifying authority and **04 §9** as the builder-facing restatement (aligns with **05 §1.4 / §20** traceability expectations).
- **Intentionally unchanged:** `src/**`, routes, Astro collections config, and any search/Pagefind wiring — **doc-only** remediation per plan risk rating **Low**; no new dependencies.

---

## 9. REM-CARCH-003 evidence (`settings` singleton collection bootstrap)

- **2026-05-14:** Added Astro content collection **`settings`** in **`src/content.config.ts`** with Zod models traced to **`docs/03_architecture/05_content_architecture_and_cms_strategy.md` §4.1** (singleton ids `site`, `footer`, `contact`, `seo_defaults`) plus **§156–162** editorial envelope, **`index_behavior`**, and SEO envelope fields on **`site`** and **`seo_defaults`** entries.
- **Seed files (new):** `src/content/settings/site.md`, `footer.md`, `contact.md`, `seo_defaults.md` — all `editorial_status: approved` to satisfy production “no `draft`/`in_review` in static slice” posture; body copy is short institutional framing, not lorem leadership.
- **Discriminator:** Frontmatter **`settings_kind`** mirrors the Astro entry id stem so **`z.discriminatedUnion`** can validate four shapes inside one collection (technical necessity; filenames remain the authoritative ids per **05 §4.1** table).
- **Intentionally unchanged (single-story discipline):** No wiring of footer, BaseLayout canonical/meta, or **`src/data/footer.ts`** — those remain **REM-CARCH-004** / **REM-CARCH-005**. No Pagefind script changes (**E11-S02** still owns search index generation).
- **Validation:** `npm run build` and `npm run validate` (build chain) succeed on the branch after adding the collection and seeds.

---

## 10. REM-CARCH-004 evidence (footer contact from `settings`)

- **2026-05-14:** Footer institution **address (and optional phone/email)** now load at static build time from Astro collection **`settings`** entry **`contact`** (`src/content/settings/contact.md` → `getEntry('settings', 'contact')`), aggregated in **`src/data/footer.ts`** via **`getFooterContactFromSettings()`**, consumed in **`src/components/layout/SiteFooter.astro`** (`await getFooterContactFromSettings()`). Mega-nav–derived **footer columns** unchanged.
- **Rules satisfied:** **05 §3** (footer surfaces align with governed `settings` + data compiler pattern); **05 §4.1** (`contact` singleton, `index_behavior: exclude` unchanged — **no Pagefind / full-text posture change** for this block).
- **Visual / copy parity:** `postal_address_lines` in the seed `contact.md` match the prior TS placeholder framing (two lines); phone/email remain absent until verified (unchanged honest omission).
- **Intentionally unchanged (single-story discipline):** **`footerCopyrightLegalName`** remains in `footer.ts` (copyright row — out of scope for “contact lines” in **004**; a later story may align with **`site`**). Canonical / default head meta are **REM-CARCH-005** (not **004**). No new npm dependencies from **004**; no route or collection id changes beyond comment refresh on **`settingsFooterSchema`** in **`src/content.config.ts`**.
- **Validation:** `npm run build` and `npm run validate` succeed after wiring.

---

## 11. REM-CARCH-005 evidence (canonical URLs + default SEO meta from `settings`)

- **2026-05-14:** **`src/layouts/BaseLayout.astro`** now loads **`getEntry('settings','site')`** and **`getEntry('settings','seo_defaults')`** at static build time and emits **`<link rel="canonical">`**, **`<meta name="description">`**, **Open Graph** (`og:type`, `og:title`, `og:description`, `og:url`, optional `og:image`), and **Twitter** card/title/description/(optional image) per **`docs/03_architecture/05_content_architecture_and_cms_strategy.md` §12.2** and **PRD §26 SEO1**.
- **`site` schema:** required **`public_site_url`** (absolute production origin, no trailing slash) added in **`src/content.config.ts`**; seed value **`https://cpmr.org.gh`** in **`src/content/settings/site.md`** (aligns with **PRD** live reference pattern — operators must confirm production host before launch claims).
- **Canonical path:** derived from **`Astro.url.pathname`** (or optional layout prop **`seoCanonicalPath`** for rare overrides), normalised to **trailing slash** for non-root paths per **05 §12.2** + **`06_project_context.md`**; **`astro.config.mjs`** sets **`trailingSlash: 'always'`** so emitted routes and canonical policy stay aligned (**`04_architecture.md` §4.1**).
- **Homepage (`src/pages/index.astro`):** no longer passes ad-hoc **`title` / `description`** from the **`home`** hero; **`BaseLayout`** falls back to **`seo_defaults`** strings — preserves **05 §4.15** (hero module contract unchanged; hero still supplies visible **`HomeHero`** content including a single page **`h1`**).
- **Optional `og:image`:** when **`site.og_image`** is set (absolute `https://`, site-relative `/…`, or other path), tags resolve to an **absolute URL** using **`public_site_url`** origin — no new collection types.
- **Intentionally unchanged (single-story discipline):** **`Layout.astro`** (404 shell), Pagefind / **`npm run validate`** script contract (**E11-S02** still owns search index wiring), no department routes, no new npm dependencies.
- **Validation:** `npm run build` and `npm run validate` succeed; **`dist/index.html`** contains **`rel="canonical"`** `https://cpmr.org.gh/` and OG/Twitter mirrors.

---

## 12. REM-CARCH-007 evidence (navigation compiler vs optional `nav` collection)

- **2026-05-14:** Added **`docs/03_architecture/07_navigation_compiler_vs_nav_collection_decision.md`** — formal **Accepted** decision that **`src/data/navigation.ts`** remains the build-time **navigation compiler** and **`routeLive`** source until programme triggers (editorial ownership, multi-output reuse, or CMS export with **05 §15** alignment) justify a **`nav` collection**; any such introduction **must** compile or validate into the **single typed consumer surface** (per **05 §2.3** and **Appendix B.4** anti-drift rule).
- **Story traceability:** **`docs/stories/E2-S08-navigation-data-single-source.yml`** — added **`docs/03_architecture/05_content_architecture_and_cms_strategy.md`** and the new **07** decision to **`context_files`**; added **`qa_checklist`** row explicitly tying **REM-CARCH-007** to **05** §2.3 / Appendix B.4.
- **Code pointer (thin):** **`src/data/navigation.ts`** file header extended with REM-CARCH-007 / **07** doc link — **no** graph, route, or export shape changes.
- **Intentionally unchanged (single-story discipline):** No Astro **`nav`** collection, no **`content.config.ts`** navigation schema, no Pagefind / validate script changes, no department routes — **search indexing and shared-hosting static slice unchanged** beyond TypeScript comment bytes.
- **Validation:** `npm run build` and `npm run validate` succeed after this slice (programme run **2026-05-14**).

---

## 13. REM-CARCH-006 evidence (`refs.ts` build-time integrity utilities)

- **2026-05-14:** Added **`src/lib/content/refs.ts`** — build-time resolver helpers traced to **`docs/03_architecture/05_content_architecture_and_cms_strategy.md` §2.5**, **§4** (relationship IDs), and **§19 item 3** (assert targets exist). Implements the documented **fail / warn matrix**: **`regulated_financial_legal`** → fail closed (`shouldFailBuild` + `applyRefIntegrityResult` throws); **`scholarly_general`** → warn-only (`console.warn` via `applyRefIntegrityResult`; build continues) per **REM-CARCH-006** / **CONTENT-ARCH-RETRO-008** and the remediation execution plan detail table.
- **API surface:** `indexCollectionIds`, `validatePlainIdsExist`, `parseStaffPrefixedRef`, `validatePublicationAuthorRefs` ( **`staff:{staffId}`** tokens per **05 §6.1** ), `formatRefIntegrityIssues`, `applyRefIntegrityResult`, `refDispositionForSurface`, plus **`assertBuildTimeRefIntegritySmokeTest()`** — synthetic missing-id cases proving the matrix.
- **Build hook:** **`src/content.config.ts`** imports **`assertBuildTimeRefIntegritySmokeTest`** and invokes it after **`collections`** export so **`npm run build`** / **`npm run validate`** (currently `astro build`) always exercises the utilities when Astro loads the content config — satisfies “known-bad fixture fails or warns” acceptance without adding new npm devDependencies for a separate test runner.
- **Intentionally unchanged (single-story discipline):** No new collections, no route or Pagefind changes, no department mini-site wiring, no bulk import — utilities are **ready for consumers** (Zod `superRefine`, page modules, or future scripts) when **`staff` / `services` / `downloads`** collections land.
- **Validation:** `npm run build` and `npm run validate` succeed after this slice.

---

*Ledger maintained by Execution Controller / programme lead. Update `last_updated` in `backlog.json` when queue materially changes.*
