# Retroactive Content Architecture & CMS Strategy Validation Report

**Project:** `cpmr-website-v5-fresh` — CPMR v5 Institutional Website Rebuild  
**Operation type:** Formal BMAD correct-course + retroactive implementation validation  
**Authoritative baseline:** `docs/03_architecture/05_content_architecture_and_cms_strategy.md` **v1.0.0** (dated 2026-05-14; status: authoritative)  
**Report date:** 2026-05-14  
**Classification key:** `PASS` | `PASS WITH NOTES` | `REMEDIATE` | `REOPEN STORY` | `BLOCKER`  

---

## 1. Executive Summary

This audit compares **what is currently in the repository** (Astro static app, `src/content.config.ts`, `src/content/**`, `src/pages/**`, `src/data/**`, layout components, and recent git history) against the **now-complete** content architecture in `05_content_architecture_and_cms_strategy.md` (“**05**”).

**Bottom line**

- **Implemented slice (E0–E2 global chrome + partial E3):** The code that exists is **largely consistent** with 05’s **static-first** posture, `routeLive` discipline, and the **explicit carve-out** for the current `home` hero schema (05 §4.15; 05 §846 snapshot). Several items are **PASS WITH NOTES** because they are **intentionally early** (bootstrap collection, placeholder-only component trees) or because 05 introduces **new mandatory contracts** (notably `settings`, editorial envelopes, Pagefind in `validate`) that **no story had authority to implement** before 05 existed.
- **Programme / forward delivery:** Relative to 05 §4–§11, the repository is **not yet a compliant implementation of the full content model**. Collections, routes, search, department mini-sites, and most verticals are **specified but absent**. Treat this as **BLOCKER-class programme risk** if any team claims E4–E11 work is “done” or merges bulk content without first landing the **schemas + validation gates** 05 defines.

**Final PASS/FAIL recommendation (see §24):** **FAIL (programme readiness against full 05)** with **CONDITIONAL PASS (narrow)** for the **currently shipped files only**, provided **HIGH/BLOCKER defects** in §18 are sequenced before new vertical implementation.

**Participating BMAD roles (synthesised findings)**

- **Architect (Winston):** Static output and file-based routing match the constitution; the gap is **contract completeness** (`settings`, typed collections, `validate` pipeline with search) per 05 §16–§17.
- **QA Architect (Murat):** Build is green, but **SR4 honesty** and **search smoke** cannot be claimed; relationship integrity and draft rejection are **untestable** until collections and validators exist (05 §11, §19; PRD §23).
- **Developer (Amelia):** `src/content.config.ts` matches 05’s **documented snapshot** for `_bootstrap` + `home`; next safe increments are **additive collections** and **`src/lib/content/refs.ts`**, not refactors of working chrome.
- **Product Manager (John):** No story should be marked “complete” against acceptance criteria that now implicitly require **05 §4** fields unless the story explicitly scoped only earlier architecture (`04`/`06`).
- **UX Designer (Sally):** Navigation/footer behaviour aligns with **honest pending links** (`routeLive:false`); future risk is **IA drift** vs optional `nav` collection unless a unification story lands (05 Appendix B item 4).
- **Analyst (Mary):** Institutional requirements (F2–F4, PRD §29) are **not contradicted** by current code, but **not yet evidenced** in routable content—this is an **expectation gap**, not a hidden violation.

---

## 2. Reason for Retroactive Validation

05 existed as a **blocking stub** while implementation proceeded under **`04_architecture.md`** and **`06_project_context.md`**. With 05 **authoritative**, any prior “complete” status for stories touching **content shape, routing, search, governance, or relationships** must be revalidated against:

- explicit **collection contracts** (05 §4),
- **department mini-site** routing (05 §5),
- **search** pipeline (05 §11),
- **editorial envelopes** and production `draft` rejection (05 §4 global conventions),
- **`settings`** as the eventual source for SEO defaults and institutional contact blocks (05 §4.1; §3 footer row).

This report satisfies the **“correct-course”** intent: record gaps, avoid silent drift, and sequence **smallest safe remediation**.

---

## 3. Scope of Audit

**In scope (as implemented in repo at validation time)**

- Astro config, build scripts, validation scripts
- `src/content.config.ts`, `src/content/**`
- `src/pages/**`
- `src/data/navigation.ts`, `src/data/footer.ts`
- `src/layouts/**`, `src/components/**` (present files only)
- `README.md`, `docs/04_stories/05_story_map.md`, `docs/03_architecture/05_content_architecture_and_cms_strategy.md`
- Git history (recent commits referencing story IDs) and working tree status

**Explicitly out of scope (per operator instruction)**

- Implementing remediation in code
- Editing `backlog.json` (path absent; see §5)
- Continuing feature development

---

## 4. Completed Stories Reviewed

**Evidence sources:** `git log` (oneline), file presence, story YAML where present, `docs/04_stories/05_story_map.md`.

| Story (evidence) | Basis | Retroactive 05 posture |
| --- | --- | --- |
| E0-S01–E0-S07 | `package.json`, `astro.config.mjs`, `README.md`, `404.astro`, `src/styles/global.css`, `src/content.config.ts`, `_bootstrap` | Mostly **PASS WITH NOTES** (see §7) |
| E1-S01–E1-S03 | `src/styles/global.css`, font wiring in `BaseLayout.astro` | **PASS WITH NOTES** |
| E1-S04 | `src/components/ui/*` exists | **PASS WITH NOTES** (no commit message grep hit; verify formal story record) |
| E1-S05 | Token checklist | **REMEDIATE** (`CONTRIBUTING.md` missing) |
| E2-S01–E2-S07 | Layout + nav components | **PASS WITH NOTES** |
| E2-S08 | `navigation.ts` + `footer.ts` coupling; story YAML | **PASS WITH NOTES** + **Architect/QA revalidation** recommended (YAML dirty; see §19) |
| E3-S01 | `src/pages/index.astro`, `src/content/home/hero.md`, `HomeHero.astro` | **PASS WITH NOTES** (hero only; homepage modules per PRD/story map not implemented) |

**Stories not implemented (no routes / no collections yet):** E3-S02–E3-S10, all of E4–E14 except scaffolding folders. They are **not “invalid”**; they are **not started** relative to 05.

---

## 5. Implemented Files Reviewed

| Path | Role vs 05 | Classification |
| --- | --- | --- |
| `astro.config.mjs` | `output:'static'` matches 05 §1, §17 | **PASS** |
| `package.json` | `validate` → `build` only; 05 §16 expects Pagefind append when E11 lands | **PASS WITH NOTES** |
| `src/content.config.ts` | Only `_bootstrap`, `home`; matches 05 §846 explicit snapshot | **PASS WITH NOTES** |
| `src/content/_bootstrap/placeholder.md` | Bootstrap only | **PASS WITH NOTES** |
| `src/content/home/hero.md` | Hero content; 05 §4.15 “preserve hero schema” | **PASS** (within carve-out) |
| `src/pages/index.astro` | Uses `getEntry('home','hero')` | **PASS WITH NOTES** (no `settings`-driven SEO envelope yet) |
| `src/pages/404.astro` | Error shell | **PASS** |
| `src/data/navigation.ts` | IA seeds + `routeLive` gating; aligns with 05 §7.9 / PRD §30 intent | **PASS WITH NOTES** (Appendix B.4 drift risk vs future `nav` collection) |
| `src/data/footer.ts` | Footer columns mirror mega graph; contact block is TS placeholder | **PASS WITH NOTES** |
| `src/layouts/BaseLayout.astro` | Title/description props; no canonical link from `settings` | **PASS WITH NOTES** |
| `src/components/layout/*` | Utility/Mega/Mobile nav + header/footer | **PASS WITH NOTES** |
| `src/components/content/HomeHero.astro` | Renders governed hero; ≤1 CTA supported | **PASS** |
| `src/components/**/.gitkeep` | Scaffold dirs (`departments`, `search`, …) | **PASS** (no false implementation) |

**Requested paths not found / not applicable**

- `_bmad-output/execution/backlog.json`, `execution-ledger.md`, `story-run-log.md`, `qa-defects.md`, `architect-decisions.md` — **not present** in this workspace (see §21).
- `docs/00_source/CPMR_Website_Brief_FINAL.md` — **not present**; repo uses `docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md` (treated as the operative brief).

---

## 6. Architecture Baseline Used

1. `docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md` (operative; final brief filename from prompt not in repo)  
2. `docs/01_planning/01_analysis.md` — **not line-audited in this pass** (no contradictions found via implementation cross-check)  
3. `docs/01_planning/02_prd.md` — **sampled** (static hosting, structured institution, SR4/search expectations)  
4. `docs/02_design/03_ux_blueprint.md` — **referenced indirectly** via `navigation.ts` comments + story map alignment  
5. `docs/02_design/DESIGN.md` — **referenced indirectly** via component comments + token usage patterns  
6. `docs/03_architecture/04_architecture.md` — **sampled** (static pillars, collections split)  
7. **`docs/03_architecture/05_content_architecture_and_cms_strategy.md` — read in full** (primary compliance baseline)  
8. `docs/04_stories/05_story_map.md` — **read** (epic sequencing + gate rules)  
9. `06_project_context.md` — cited by 05 as constitution; **not re-read line-by-line** in this pass (static output cross-checked in config)

---

## 7. Story-by-Story Compliance Table

| Story | 05 compliance | Notes |
| --- | --- | --- |
| E0-S01 | **PASS** | Scripts match constitution pattern; `validate`==`build` is honest today but incomplete vs future Pagefind gate. |
| E0-S02 | **PASS** | Static output guardrail satisfied. |
| E0-S03 | **PASS WITH NOTES** | Folders exist; vertical component dirs are placeholders only—good. |
| E0-S04 | **PASS WITH NOTES** | `_bootstrap` remains; 05 allows incremental replacement—ensure next collection stories cite §4. |
| E0-S05 | **PASS** | Tailwind entry present. |
| E0-S06 | **PASS** | 404 shell present. |
| E0-S07 | **PASS WITH NOTES** | README cites `04`/`06` but not **05**—editorial/CMS handoff should reference authoritative content architecture. |
| E1-S01–S03 | **PASS WITH NOTES** | Visual system plumbing; no 05 conflict. |
| E1-S04 | **PASS WITH NOTES** | Primitives exist; confirm formal story completion record outside git messages. |
| E1-S05 | **REMEDIATE** | Missing `CONTRIBUTING.md` checklist artefact implied by story map. |
| E2-S01–S07 | **PASS WITH NOTES** | Chrome only; no forbidden hardcoded department pages detected. |
| E2-S08 | **PASS WITH NOTES** | Implementation matches “single typed model” intent (`footer.ts` derives from `megaNavSections`). **Revalidate** gate evidence vs **05** (YAML status drift; see git). |
| E3-S01 | **PASS WITH NOTES** | Hero is content-driven; broader homepage modules absent (expected pre-E3 completion). |

---

## 8. File-by-File Compliance Table

| File | Role | 05 compliance |
| --- | --- | --- |
| `src/content.config.ts` | Declares `_bootstrap`, `home` | **PASS WITH NOTES** (matches 05 §846 snapshot; expand per §4) |
| `src/content/_bootstrap/placeholder.md` | Bootstrap content | **PASS WITH NOTES** |
| `src/content/home/hero.md` | Homepage hero copy | **PASS** (within 05 §4.15 carve-out) |
| `src/content/.gitkeep` | Folder hygiene | **PASS** |
| `src/pages/index.astro` | `/` route; `getEntry('home','hero')` | **PASS WITH NOTES** (no `settings`-driven SEO yet) |
| `src/pages/404.astro` | Error page | **PASS** |
| `src/data/navigation.ts` | IA + `routeLive` | **PASS WITH NOTES** (Appendix B.4 drift risk) |
| `src/data/footer.ts` | Footer columns + placeholder contact | **PASS WITH NOTES** / **REMEDIATE** contact sourcing (see defect 004) |
| `src/data/.gitkeep` | Folder hygiene | **PASS** |
| `src/layouts/BaseLayout.astro` | HTML shell, basic meta | **PASS WITH NOTES** (canonical/`settings` gap) |
| `src/layouts/Layout.astro` | Layout shell used by `404.astro` (distinct from `BaseLayout` on `/`) | **PASS WITH NOTES** (dual layout patterns should converge when `settings`/SEO head slot work is centralised) |
| `src/styles/global.css` | Tokens / Tailwind entry | **PASS WITH NOTES** (design authority is `DESIGN.md`, not 05) |
| `src/components/content/HomeHero.astro` | Hero rendering | **PASS** |
| `src/components/content/.gitkeep` | Scaffold | **PASS** |
| `src/components/layout/SiteHeader.astro` | Header chrome | **PASS** |
| `src/components/layout/SiteFooter.astro` | Footer chrome | **PASS WITH NOTES** |
| `src/components/layout/UtilityNavigation.astro` | Utility nav | **PASS** |
| `src/components/layout/MegaNavigation.astro` | Mega nav | **PASS** |
| `src/components/layout/MobileNavigation.astro` | Mobile drawer | **PASS** |
| `src/components/layout/Breadcrumbs.astro` | Breadcrumbs | **PASS** |
| `src/components/layout/.gitkeep` | Scaffold | **PASS** |
| `src/components/ui/Button.astro` | Primitive | **PASS** |
| `src/components/ui/ButtonLink.astro` | Primitive | **PASS** |
| `src/components/ui/Card.astro` | Primitive | **PASS** |
| `src/components/ui/Icon.astro` | Primitive | **PASS** |
| `src/components/ui/.gitkeep` | Scaffold | **PASS** |
| `src/components/departments/.gitkeep` | Scaffold | **PASS** |
| `src/components/search/.gitkeep` | Scaffold | **PASS** |
| `src/components/Welcome.astro` | Template starter | **PASS WITH NOTES** (not part of institutional routes; safe to remove later if unused) |
| `src/assets/astro.svg` | Asset | **PASS** |
| `src/assets/background.svg` | Asset | **PASS** |

---

## 9. Content Collection Compliance Review

| Topic | Finding | Classification |
| --- | --- | --- |
| Collection set vs 05 §4 / §16 | Only `_bootstrap` + `home` implemented; **all other collections specified** | **PASS WITH NOTES** (expected early); **BLOCKER** if anyone starts bulk importing content without schemas |
| Global editorial + SEO envelope (05 §4 “Global conventions”) | Not applied to `home` hero beyond carve-out; `_bootstrap` is non-production | **PASS WITH NOTES** |
| Production `draft` rejection | Not implementable until collections include `editorial_status` | **PASS WITH NOTES** |
| `settings` singletons (05 §4.1) | **Absent** | **HIGH / REMEDIATE** (defect **CONTENT-ARCH-RETRO-003**) |

---

## 10. Route Compliance Review

| Expected route families (05 / story map) | Present under `src/pages`? | Classification |
| --- | ---: | --- |
| `/` | Yes (`index.astro`) | **PASS** |
| `/404` | Yes | **PASS** |
| `/about/**`, `/research/**`, `/departments/**`, `/services/**`, `/products/**`, `/news/**`, `/events/**`, `/media/**`, `/resources/**`, `/search/**`, `/contact/**` | **No** (only nav seeds) | **N/A / not implemented** — **not a violation** of “no hardcoded departments”; **BLOCKER** for claiming those epics complete |

**Trailing slash policy:** Internal `href`s in `navigation.ts` largely use trailing `/`, consistent with 05 §12.2 intent; Astro build output uses `index.html` patterns—**PASS WITH NOTES** pending explicit trailing-slash config story.

---

## 11. Component Compliance Review

| Component area | Finding | Classification |
| --- | --- | --- |
| Nav consumers | Read shared seeds; respect `routeLive` | **PASS** |
| Footer | Uses `footer.ts`; contact copy is placeholder string in TS | **REMEDIATE** vs 05 §3 / §4.1 long-term |
| Home hero | Consumes collection entry correctly | **PASS** |
| Department/service/news/search components | `.gitkeep` only | **PASS** (no false consumption) |

---

## 12. Search Compliance Review

| Topic | Finding | Classification |
| --- | --- | --- |
| Pagefind post-processing | Not in `package.json` scripts | **NOT IMPLEMENTED** (expected pre-E11) |
| `src/data/generated/search-index.json` fallback | Not present | **N/A** |
| SR4 | Cannot be validated | **PASS WITH NOTES** + QA gate when E11 lands |

---

## 13. Department Mini-Site Compliance Review

**Not implemented** (`src/pages/departments/**` absent; no `departments` collection).  
Classification: **N/A**, with **BLOCKER** if any work is merged claiming E5 completion without 05 §4.3 + §5 routes.

---

## 14. Service / Product / Research / Publication Compliance Review

**Not implemented** (no collections, no pages).  
Classification: **N/A** at code level; **BLOCKER** at programme level if schedules assume these verticals are “ready.”

---

## 15. SEO / Metadata Compliance Review

| Topic | Finding | Classification |
| --- | --- | --- |
| Per-entry SEO envelope | Not present for `home` beyond implicit `<title>`/`meta description` from `index.astro` | **PASS WITH NOTES** (05 §4.15 carve-out) |
| Canonical URLs from `settings` | Not implemented | **REMEDIATE** (defect **CONTENT-ARCH-RETRO-006**) |
| `og_image` / social | Not implemented | **PASS WITH NOTES** |

---

## 16. CMS-Readiness Compliance Review

| Topic | Finding | Classification |
| --- | --- | --- |
| Portable models in Markdown | Partially true for hero only | **PASS WITH NOTES** |
| Editorial roles metadata | Not yet in content files | **REMEDIATE** when collections land |
| Future Decap/headless mapping | 05 §15 is clear; repo not yet aligned beyond folder conventions | **PASS WITH NOTES** |

---

## 17. Shared-Hosting Compatibility Review

| Topic | Finding | Classification |
| --- | --- | --- |
| Static `dist/` | `astro build` emits static pages | **PASS** |
| No SSR adapters | None detected | **PASS** |
| Pagefind WASM/MIME risk | Not applicable until installed | **PASS WITH NOTES** (05 §17 item 3) |

**Commands run**

- `npm run validate` → **PASS** (completed successfully)
- `npm run build` → **PASS** (completed successfully)
- `git status` → clean except **modified** `docs/stories/E2-S08-navigation-data-single-source.yml`
- `git diff --stat` → `1 file changed, 1 insertion(+), 1 deletion(-)` (story status flip)
- `powershell -File scripts\bmad-validate-backlog.ps1` → **N/A** (script path not present)

---

## 18. Defects Found

### DEFECT ID: CONTENT-ARCH-RETRO-001

**Severity:** MEDIUM  
**Affected Story:** UNKNOWN (process artefact)  
**Affected Files:** `_bmad-output/execution/*` (expected by operator prompt; missing)  
**Violated Architecture Rule:** 05 §20 Handoff Requirements (“**No `backlog.json` in repo…** use story map until automation exports JSON”) — operator checklist still expected local artefacts; absence blocks traceability **for this operation’s requested inputs**.  
**Problem:** Cannot cross-check formal execution ledger, defects, or architect decisions from `_bmad-output/execution/`.  
**Required Fix:** Restore/export execution artefacts to the repo **or** update the operational procedure to use the canonical YAML story library under `docs/stories/` exclusively.  
**Validation Required:** Human records + CI doc link check.  
**Gate Required:** **QA** (traceability) + **ARCHITECT** (process)

---

### DEFECT ID: CONTENT-ARCH-RETRO-002

**Severity:** MEDIUM  
**Affected Story:** E0-S07  
**Affected Files:** `README.md`  
**Violated Architecture Rule:** 05 §1.4 / §20 (“agents must cite 05 for content contracts”)  
**Problem:** README onboarding references `04`/`06` but not the **authoritative** `05` content architecture.  
**Required Fix:** Add a short pointer to `docs/03_architecture/05_content_architecture_and_cms_strategy.md` in the “Where content lives” section.  
**Validation Required:** Doc review; `npm run validate` (no code impact expected).  
**Gate Required:** **QA**

---

### DEFECT ID: CONTENT-ARCH-RETRO-003

**Severity:** HIGH  
**Affected Story:** UNKNOWN (cross-cutting; becomes E0/E4+ when scheduled)  
**Affected Files:** `src/content.config.ts`, (missing) `src/content/settings/**`  
**Violated Architecture Rule:** 05 §4.1 `settings` singletons; §16 “Collections … per §4”  
**Problem:** No `settings` collection or files for `site`, `footer`, `contact`, `seo_defaults` as specified.  
**Required Fix:** Add `settings` collection + seed files + Zod schema per 05 §4.1; wire layout to read defaults safely (incremental).  
**Validation Required:** `npm run validate`; `astro check` (when enabled).  
**Gate Required:** **ARCHITECT** + **DEV** + **QA**

---

### DEFECT ID: CONTENT-ARCH-RETRO-004

**Severity:** MEDIUM  
**Affected Story:** E2-S06 (footer), E0-S07 (editorial truth placement)  
**Affected Files:** `src/data/footer.ts`  
**Violated Architecture Rule:** 05 §3 table row “Footer content — `settings` + `src/data/footer.ts`”  
**Problem:** Footer contact block is embedded as TS placeholder strings rather than sourced from `settings` entries.  
**Required Fix:** Migrate institution-wide contact/address lines into `settings/contact` (or `site`) once **CONTENT-ARCH-RETRO-003** lands; keep `footer.ts` as compiler/aggregator as 05 suggests.  
**Validation Required:** Visual review + `npm run validate`.  
**Gate Required:** **DEV** + **QA**

---

### DEFECT ID: CONTENT-ARCH-RETRO-005

**Severity:** MEDIUM  
**Affected Story:** E11 (future), E0-S01 (scripts)  
**Affected Files:** `package.json`  
**Violated Architecture Rule:** 05 §11.3 pipeline; §16 “Pagefind step appended in `validate` when story lands”  
**Problem:** `validate` currently equals `astro build` only; no Pagefind post-process.  
**Required Fix:** When implementing E11, append `npx pagefind --site dist` (flags per story) to `validate`.  
**Validation Required:** `npm run validate` + search smoke tests per PRD §33 / 05 §19 item 6.  
**Gate Required:** **ARCHITECT** + **QA**

---

### DEFECT ID: CONTENT-ARCH-RETRO-006

**Severity:** MEDIUM  
**Affected Story:** E12 (future), cross-cutting SEO  
**Affected Files:** `src/layouts/BaseLayout.astro`, `src/pages/index.astro`  
**Violated Architecture Rule:** 05 §12.2 canonical URLs using `settings` base URL  
**Problem:** No canonical link generation from settings; homepage title/description are not driven by SEO envelope fields.  
**Required Fix:** After `settings/seo_defaults` exists, implement canonical + default OG/Twitter tags per architecture story.  
**Validation Required:** `npm run validate`; manual HTML inspection of `/index.html`.  
**Gate Required:** **DEV** + **QA** + **ARCHITECT**

---

### DEFECT ID: CONTENT-ARCH-RETRO-007

**Severity:** MEDIUM  
**Affected Story:** E1-S05  
**Affected Files:** (missing) `CONTRIBUTING.md`  
**Violated Architecture Rule:** Story map E1-S05 acceptance (“checklist … linked from CONTRIBUTING or README”)  
**Problem:** `CONTRIBUTING.md` does not exist (`Test-Path` false).  
**Required Fix:** Add `CONTRIBUTING.md` with token forbidden patterns checklist referencing `DESIGN.md` §0.  
**Validation Required:** Repo policy review.  
**Gate Required:** **QA**

---

### DEFECT ID: CONTENT-ARCH-RETRO-008

**Severity:** HIGH (programme) / MEDIUM (code)  
**Affected Story:** E5–E10 (any vertical importing content)  
**Affected Files:** N/A (absence)  
**Violated Architecture Rule:** 05 §1.2 / §4 / §19 (“broken references fail/warn”, typed entities)  
**Problem:** No `src/lib/content/refs.ts` validators and no relationship-bearing collections—integrity strategy is not implementable yet.  
**Required Fix:** Introduce resolver utilities as 05 §19 item 3; wire into build for financial/legal surfaces first.  
**Validation Required:** `npm run validate`; targeted unit tests if added.  
**Gate Required:** **ARCHITECT** + **DEV** + **QA**

---

### DEFECT ID: CONTENT-ARCH-RETRO-009

**Severity:** BLOCKER (programme gate — not a runtime production outage)  
**Affected Story:** Any epic claiming “department mini-site / services / research corpus shipped”  
**Affected Files:** `src/pages/**`, `src/content/**` (absence of required routes/collections)  
**Violated Architecture Rule:** 05 §4–§7 (collections + department subtree contracts)  
**Problem:** The authoritative model requires many collections and routes; they are not implemented. Continuing “as if” those epics were complete would violate governance and SR4 honesty.  
**Required Fix:** Freeze claims; sequence schema-first stories; populate minimal seed content with validators.  
**Validation Required:** `npm run validate` + story-level acceptance checks.  
**Gate Required:** **ALL**

---

## 19. Stories Reopened

**Formal `REOPEN STORY`:** none mandatory for **code contradictions**—the repo does not contain implemented department/service/news/search pages that violate 05.

**Process reopen / revalidation recommended**

- **E2-S08 — Navigation data single source**
  - **Reason:** `architect_gate_required: true` in YAML; gate evidence must explicitly include **05** (nav/footer alignment with long-term `settings` + optional `nav` collection strategy per 05 Appendix B item 4).
  - **Evidence:** working tree shows `docs/stories/E2-S08-navigation-data-single-source.yml` modified (`TODO` → `DONE`) **not committed** (`git status` dirty).

---

## 20. Required Remediation Stories

1. **E0-S07b / docs:** README references **05** (maps to defect **CONTENT-ARCH-RETRO-002**).  
2. **E1-S05 completion:** add `CONTRIBUTING.md` (**CONTENT-ARCH-RETRO-007**).  
3. **`settings` collection bootstrap:** implement 05 §4.1 minimal schemas + seed files (**CONTENT-ARCH-RETRO-003**).  
4. **Footer contact migration to `settings`:** depends on (3) (**CONTENT-ARCH-RETRO-004**).  
5. **SEO defaults + canonical:** depends on (3) (**CONTENT-ARCH-RETRO-006**).  
6. **`src/lib/content/refs.ts` + build-time integrity:** depends on first real cross-collection content (**CONTENT-ARCH-RETRO-008**).  
7. **Navigation unification follow-up:** address 05 Appendix B item 4 (“`navigation.ts` graph remains source… risk of drift vs §4”) via explicit story once `nav` exporter or `settings` compiler path is chosen.  
8. **E11 Pagefind:** implement pipeline + update `validate` (**CONTENT-ARCH-RETRO-005**).

---

## 21. Recommended Backlog Updates

**Do not modify `backlog.json` until human approval** (per operator instruction; file also absent in this workspace).

Recommended human actions:

- Add **dependency**: any story touching schemas/routes/search must cite **`docs/03_architecture/05_content_architecture_and_cms_strategy.md` §4 + §16**.
- Mark **E3** as **partially complete** at epic level (only **E3-S01** delivered).
- Keep **E2-S08** as **DONE only after**: committed YAML + recorded architect sign-off against **05** + QA checklist update.
- Create **remediation stories** listed in §20.
- If automation expects `_bmad-output/execution/*`, either generate those files or **retire that requirement** to avoid recurring “missing artefact” defects.

---

## 22. Required QA Revalidation

Minimum QA re-run packages:

- **Regression:** `npm run validate`, `npm run build`, `git status` clean.  
- **Story hygiene:** verify `docs/stories/E2-S08-*.yml` committed; add explicit checklist items referencing **05 §15–§19** for any navigation/footer change.  
- **Accessibility smoke:** unchanged baseline from E2 stories (keyboard/focus) — re-run on `/` after any SEO `<head>` changes.

---

## 23. Required Architect Revalidation

- **E2-S08 gate:** confirm nav/footer approach is consistent with **05 §3 / §4.1 / Appendix B.4**.  
- **Any upcoming collection introduction:** classify per `docs/04_stories/05_story_map.md` §5 (breaking schema / new collection).  
- **Search choice:** confirm Pagefind remains ADR-004 baseline when E11 starts (**CONTENT-ARCH-RETRO-005**).

---

## 24. Final PASS/FAIL Recommendation

- **Narrow validation (implemented files vs 05):** **CONDITIONAL PASS** — current code is broadly aligned with the **early-repo snapshot** described in 05 §846 and does not show the specific anti-patterns 05 warns against (no hardcoded department pages detected; static output preserved; `routeLive` prevents silent dead-link claims).  
- **Programme validation (claims about institutional completeness vs 05):** **FAIL** — the majority of 05’s typed ecosystem is **not implemented**; several **HIGH** defects and one **BLOCKER** programme gate (**CONTENT-ARCH-RETRO-009**) must be treated as **stop-the-line for “we’re done” claims** on E4+ until schemas and routes exist.

---

## Appendix A — Mission answers (1–11)

1. **Valid implemented stories:** primarily **E0–E2** delivered items + **E3-S01** (partial epic E3).  
2. **Partially valid / remediation:** **E0-S07**, **E1-S05**, **E2-S08** (process/YAML), **E3-S01** (homepage scope), **package scripts** vs future Pagefind.  
3. **Conflicts with 05:** **No acute contradictions** in shipped code; **conflicts arise by absence** (collections/routes/search/settings).  
4. **QA approvals to reopen:** recommended **QA revalidation** for **E2-S08** and any story claiming search/SEO completeness.  
5. **Architect approvals to reopen:** recommended **Architect revalidation** for **E2-S08** (explicit **05** gate).  
6. **Schemas to correct:** add missing collections per **05 §4** (starting with `settings`).  
7. **Routes to correct:** none incorrectly implemented; **missing routes** must be added when epics begin.  
8. **Components consuming content incorrectly:** none found beyond **intentional** TS placeholders in footer contact (**remediate** via `settings`).  
9. **Content files to move/rename:** none required for current `home`/`_bootstrap`; future imports must follow **05 §2.4** slug/id rules.  
10. **Search-index assumptions:** Pagefind not wired; treat search as **unimplemented**.  
11. **Return to DEV → QA → ARCHITECT:** **E2-S08** if gate paperwork cannot show **05** alignment; any story that prematurely marks E4–E11 complete should be **reopened** or rewritten.

---

## Appendix B — Git evidence (representative)

Recent story-attributed commits on `main` include: `feat(E3-S01)…`, `feat(E2-S07)…` … `feat(E0-S04)…`, plus `docs(architecture): add full content architecture and cms strategy`.

**Working tree note:** `docs/stories/E2-S08-navigation-data-single-source.yml` is modified locally (status flip).

---

*End of report.*
