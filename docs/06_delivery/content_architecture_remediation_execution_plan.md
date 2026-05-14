# Content Architecture Remediation — Execution Plan

**Project:** CPMR v5 Institutional Website Rebuild (`cpmr-website-v5-fresh`)  
**Operation:** BMAD remediation planning (no implementation in this step)  
**Authoritative audit:** `docs/05_qa/retroactive_content_architecture_validation_report.md` (2026-05-14)  
**Architecture baseline:** `docs/03_architecture/05_content_architecture_and_cms_strategy.md` **v1.0.0** (authoritative)  
**Supporting baselines:** `docs/03_architecture/04_architecture.md`, `docs/01_planning/02_prd.md`, `docs/04_stories/05_story_map.md`  
**Plan date:** 2026-05-14  
**Participating perspectives (synthesised):** Architect, QA Architect (Test Architect), Product Manager, Execution Controller, Developer feasibility  

---

## 1. Executive summary

The retroactive validation report confirms **no acute contradictions** in shipped code for the **early static slice** (E0–E2 chrome plus **E3-S01** hero). The programme risk is **contract absence**: **`settings`**, editorial envelopes, relationship validators, Pagefind in `validate`, and most routes/collections are **specified in doc 05 but not implemented**. One story (**E1-S05**) appears **falsely closed** against its own acceptance criteria (`CONTRIBUTING.md` missing). **E2-S08** requires **process reopen / architect revalidation** because gate evidence must explicitly cite **05** (nav/footer alignment with long-term `settings` / optional `nav` per Appendix B.4), and the audit recorded **uncommitted YAML status drift**.

This plan converts each **CONTENT-ARCH-RETRO-00x** defect into **backlog corrections**, **reopened or held stories**, **new remediation stories**, **dependency corrections**, **QA and architect revalidation packages**, and a **safe execution order** that avoids breaking the green build while restoring traceability.

**Stop/go (preview):** **GO** for **narrow remediation** (docs + `settings` bootstrap + footer/SEO wiring + execution artefacts) on the current branch with normal PR discipline. **NO-GO** for declaring **E4+ epics complete** or bulk content import until **blocker-class programme gates** (mapped from **CONTENT-ARCH-RETRO-009**) are satisfied by schema-first delivery.

---

## 2. Audit findings summary

| Theme | Report posture | Planning implication |
| --- | --- | --- |
| Static output & `routeLive` honesty | Largely **PASS** / **PASS WITH NOTES** | Preserve; do not refactor working chrome without cause |
| Doc **05** as authority for content contracts | New mandatory references | Add **05** to onboarding, story `context_files`, architect gates |
| `settings` singletons (05 §4.1) | **Absent** — **HIGH** | Land **before** institution-wide strings pretend to be “governed” |
| Footer contact in TS placeholders | **MEDIUM** — violates 05 §3 row | Migrate after `settings` exists |
| `validate` vs Pagefind | Not implemented (expected pre-E11) | Defer implementation to **E11-S02**; track as explicit dependency |
| `refs.ts` / relationship integrity | Not implementable until collections | Schedule with first cross-collection content |
| `CONTRIBUTING.md` | Missing — **E1-S05** AC breach | **Reopen** E1-S05 or mark **PROCESS_FIX_REQUIRED** |
| `_bmad-output/execution/*` | Missing at audit time | Restore artefacts **or** formally retire requirement (decision story) |
| Programme completeness vs 05 | **BLOCKER** if claiming E4–E11 “done” | Freeze claims; schema-first sequencing |

---

## 3. Defect severity matrix

| Defect ID | Report severity | **Remediation class** | Rationale |
| --- | --- | --- | --- |
| CONTENT-ARCH-RETRO-001 | MEDIUM | **REQUIRED BEFORE RELATED FEATURE CONTINUES** (process) | Blocks traceability for BMAD execution; does not stop `npm run validate` |
| CONTENT-ARCH-RETRO-002 | MEDIUM | **REQUIRED BEFORE RELATED FEATURE CONTINUES** | Editors/agents mis-routed vs authoritative **05** |
| CONTENT-ARCH-RETRO-003 | HIGH | **IMMEDIATE BLOCKER** for “05-compliant” global IA/SEO/footer | Absence blocks honest global contracts |
| CONTENT-ARCH-RETRO-004 | MEDIUM | **REQUIRED BEFORE RELATED FEATURE CONTINUES** | Depends on **003**; institutional contact truth |
| CONTENT-ARCH-RETRO-005 | MEDIUM | **SAFE TO DEFER** | Correct home is **E11-S02** per story map |
| CONTENT-ARCH-RETRO-006 | MEDIUM | **SAFE TO DEFER** until **003** lands | Then becomes **REQUIRED BEFORE** E12 SEO claims |
| CONTENT-ARCH-RETRO-007 | MEDIUM | **IMMEDIATE BLOCKER** for **E1-S05 truthfulness** | False “DONE” undermines all token QA claims |
| CONTENT-ARCH-RETRO-008 | HIGH (programme) | **REQUIRED BEFORE first bulk cross-collection editorial** | Prevents silent broken refs on financial/legal surfaces |
| CONTENT-ARCH-RETRO-009 | BLOCKER (programme) | **IMMEDIATE BLOCKER** for epic-completion claims | Not a runtime outage; **governance / honesty** stop-line |

**Legend (classification rules used):**

1. **IMMEDIATE BLOCKER** — must clear before marking affected stories DONE or before claiming compliance.  
2. **REQUIRED BEFORE RELATED FEATURE CONTINUES** — sequence before dependent verticals or gates.  
3. **SAFE TO DEFER** — correctly absent until its owning epic; track only.  
4. **COSMETIC / LOW PRIORITY** — none of the listed defects are purely cosmetic; optional follow-ups (e.g. `Welcome.astro` removal) stay out of this plan.

---

## 4. Reopened stories table

| Story ID | Action | Reason (audit trace) | Gate / evidence required |
| --- | --- | --- | --- |
| **E1-S05** | **Reopen** → `PROCESS_FIX_REQUIRED` (or `QA_FAILED`) | **CONTENT-ARCH-RETRO-007**: AC requires checklist in `CONTRIBUTING` **or** README; `CONTRIBUTING.md` **missing** while story YAML says `DONE` | QA: verify file + links; PM: correct epic E1 reporting |
| **E2-S08** | **Hold / reopen architect cycle** (do **not** treat as cleanly closed until gate packet updated) | **§19**: `architect_gate_required: true`; evidence must cite **05** §3 / §4.1 / Appendix B.4; **uncommitted** status flip on story YAML | Architect: signed alignment to **05**; QA: extend checklist rows for **05 §15–§19** |
| **E3** (epic level) | **Mark partial** in execution records | Only **E3-S01** implemented; remainder not started vs PRD H2–H12 | PM: epic dashboard; no code change |

**Stories not reopened for code contradiction:** none required by audit for implemented routes (no forbidden department pages detected).

---

## 5. New remediation stories table

Each row is implementable as `docs/stories/REM-CARCH-*.yml` **or** absorbed into parent stories where noted. IDs are stable for backlog traceability.

| Remediation ID | Parent / anchor | Maps to defect | Problem summary (one line) |
| --- | --- | --- | --- |
| **REM-CARCH-001** | Process / Execution Controller | **001** | Establish `_bmad-output/execution/` traceability (`backlog.json`, `execution-ledger.md`) **or** ADR to retire JSON requirement |
| **REM-CARCH-002** | **E0-S07** | **002** | README must cite **05** for content contracts |
| **REM-CARCH-003** | **E0-S04** (primary), gates **E4+** | **003** | Introduce `settings` collection + Zod schemas + seed entries per **05 §4.1** |
| **REM-CARCH-004** | **E2-S06** | **004** | Move footer institution contact block from TS placeholders into `settings` once **003** exists |
| **REM-CARCH-005** | **E12-S02** (and **E3-S01** consumers) | **006** | Canonical + default social meta from `settings` / SEO envelope |
| **REM-CARCH-006** | **E5-S09** / cross-epic | **008** | Add `src/lib/content/refs.ts` (or equivalent) + build-time integrity hooks for financial/legal priority |
| **REM-CARCH-007** | **E2-S08** follow-on | Report **§20 item 7** | Explicit decision: keep `navigation.ts` as compiler vs optional `nav` collection — document + optional thin story |
| **REM-CARCH-008** | **E1-S05** (alternative to reopen-only) | **007** | If team prefers minimal diff: add `CONTRIBUTING.md` under reopened E1-S05 (same sprint) |

**Note on REM-CARCH-005 vs E11:** **CONTENT-ARCH-RETRO-005** remains owned by **E11-S02** (Pagefind in `validate`); do **not** duplicate as a separate remediation story unless E11 scope slips.

---

## 6. Remediation story definitions (detail)

### REM-CARCH-001 — Execution artefact restoration

| Field | Value |
| --- | --- |
| **Parent** | Execution / BMAD ops (no epic story) |
| **Problem** | Missing `_bmad-output/execution/backlog.json` and `execution-ledger.md` blocked cross-checks (**001**). |
| **Rule violated** | **05 §20** handoff + programme expectation of traceable execution state. |
| **Affected files** | `_bmad-output/execution/backlog.json` (create), `execution-ledger.md` (create), optionally `docs/06_delivery/*.md` pointers |
| **Required correction** | Create execution artefacts **or** publish ADR: “YAML in `docs/stories/` is sole source; JSON export is CI-only.” |
| **Acceptance criteria** | (a) Human-readable ledger lists active blockers; (b) `backlog.json` reflects reopened stories + remediation rows; (c) Automation docs updated if path changes. |
| **Validation commands** | N/A code; optional: `python automation/sprint_runner.py --help` if wired later |
| **QA requirements** | Verify IDs match `docs/stories/*.yml`; no silent `DONE` without AC proof |
| **Architect requirements** | Approve single source of truth (JSON vs YAML) |
| **Dependencies** | None |
| **Risk** | **Low** (process only) |

**REM-CARCH-001 implementation evidence (process):** On **2026-05-14**, `_bmad-output/execution/execution-ledger.md` was added as the human-readable ledger; `_bmad-output/execution/backlog.json` remains the machine-readable mirror per **05 §20** handoff expectations and this plan’s Appendix B/C. Story YAML under `docs/stories/` remains the per-story authority unless a future ADR moves export to CI-only.

---

### REM-CARCH-002 — README cites doc 05

| Field | Value |
| --- | --- |
| **Parent** | **E0-S07** |
| **Problem** | README omits authoritative **05** (**002**). |
| **Rule violated** | **05 §1.4 / §20** — cite **05** for content contracts. |
| **Affected files** | `README.md` |
| **Required correction** | Add short subsection pointer: `docs/03_architecture/05_content_architecture_and_cms_strategy.md`. |
| **Acceptance criteria** | README “where content lives” mentions **04**, **06**, and **05** with roles distinguished. |
| **Validation commands** | `npm run validate` |
| **QA requirements** | Doc-only review |
| **Architect requirements** | Optional ack (low risk) |
| **Dependencies** | None (can parallel **001**) |
| **Risk** | **Low** |

---

### REM-CARCH-003 — `settings` collection bootstrap

| Field | Value |
| --- | --- |
| **Parent** | **E0-S04** (schema introduction) |
| **Problem** | No `settings` singletons (**003**). |
| **Rule violated** | **05 §4.1**, **05 §16** |
| **Affected files** | `src/content.config.ts`, `src/content/settings/**` (new), possibly `src/content/.gitkeep` |
| **Required correction** | Minimal Zod schemas + seed markdown/JSON per **05 §4.1** (`site`, `footer`, `contact`, `seo_defaults` as applicable); no mass content import. |
| **Acceptance criteria** | `getEntry`/`getCollection` resolves settings; build passes; editorial fields stubbed but valid. |
| **Validation commands** | `npm run validate`, `npm run build` |
| **QA requirements** | Schema snapshot review; fail-closed on unknown fields if policy requires |
| **Architect requirements** | **Gate required** (new collection per **05_story_map §5**) |
| **Dependencies** | None before **004**/**005** |
| **Risk** | **Medium** (foundational schema; mistakes propagate) |

---

### REM-CARCH-004 — Footer contact from `settings`

| Field | Value |
| --- | --- |
| **Parent** | **E2-S06** |
| **Problem** | Footer contact is TS placeholder vs **05 §3** table (**004**). |
| **Rule violated** | **05 §3** — footer content from `settings` + `src/data/footer.ts` |
| **Affected files** | `src/data/footer.ts`, `src/components/layout/SiteFooter.astro`, `src/content/settings/**` |
| **Required correction** | Read institution lines from settings; keep `footer.ts` as compiler/aggregator. |
| **Acceptance criteria** | No long-lived operational contact strings in TS; visual parity or intentional copy update logged. |
| **Validation commands** | `npm run validate`, `npm run build` |
| **QA requirements** | Visual + content diff; a11y unchanged |
| **Architect requirements** | Confirm alignment with **05 §4.1** |
| **Dependencies** | **Hard:** **REM-CARCH-003** |
| **Risk** | **Medium** |

---

### REM-CARCH-005 — Canonical + SEO defaults

| Field | Value |
| --- | --- |
| **Parent** | **E12-S02** (primary); touches **E3-S01** |
| **Problem** | No canonical from `settings`; homepage meta not driven by SEO envelope (**006**). |
| **Rule violated** | **05 §12.2** |
| **Affected files** | `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/content/settings/**` |
| **Required correction** | Implement canonical + default OG/Twitter where **05** specifies; respect **§4.15** hero carve-out. |
| **Acceptance criteria** | `/` HTML shows canonical; titles/descriptions pull defaults when entry lacks overrides. |
| **Validation commands** | `npm run validate`, manual `dist/index.html` inspection |
| **QA requirements** | Head tag diff checklist; regression on single `h1` |
| **Architect requirements** | Approve URL policy with trailing-slash story (**04_architecture §4.1**) |
| **Dependencies** | **Hard:** **REM-CARCH-003** |
| **Risk** | **Medium–High** (SEO mistakes are silent) |

---

### REM-CARCH-006 — `refs.ts` build-time integrity

| Field | Value |
| --- | --- |
| **Parent** | **E5-S09** (QA), first cross-collection consumers |
| **Problem** | No `src/lib/content/refs.ts` / validators (**008**). |
| **Rule violated** | **05 §1.2 / §4 / §19** |
| **Affected files** | `src/lib/content/refs.ts` (new), `src/content.config.ts`, optional `scripts/**` |
| **Required correction** | Introduce resolver utilities; start with **warn vs fail** policy documented; tighten for financial/legal. |
| **Acceptance criteria** | Known-bad fixture fails or warns per documented policy; CI documents behaviour. |
| **Validation commands** | `npm run validate`, targeted unit tests if added |
| **QA requirements** | Negative tests for broken IDs |
| **Architect requirements** | Approve fail/warn matrix |
| **Dependencies** | **Soft until** first multi-collection editorial lands; **hard before** bulk import |
| **Risk** | **High** if overly strict too early; **High** if too loose on regulated content |

---

### REM-CARCH-007 — Navigation model decision (IA drift)

| Field | Value |
| --- | --- |
| **Parent** | **E2-S08** |
| **Problem** | Long-term drift risk: `navigation.ts` vs future `nav` collection (**05 Appendix B.4**). |
| **Rule violated** | **05 Appendix B item 4** |
| **Affected files** | `docs/**` ADR or architecture addendum; optionally `src/data/navigation.ts` comments / thin wrapper |
| **Required correction** | Record decision + triggers for exporter/collection introduction. |
| **Acceptance criteria** | Architect-signed note linked from E2-S08 gate packet |
| **Validation commands** | Doc-only |
| **QA requirements** | Confirm E2 QA checklist references decision |
| **Architect requirements** | **Required** |
| **Dependencies** | Can follow **REM-CARCH-003** |
| **Risk** | **Low** if doc-only; **Medium** if code refactor without need |

---

## 7. Dependency corrections

| Location | Current / implied | Corrected / required |
| --- | --- | --- |
| **E0-S07** `context_files` | Lists `04`, `06` | Add **`docs/03_architecture/05_content_architecture_and_cms_strategy.md`** |
| **E2-S08** `context_files` | Omits **05** | Add **05**; extend `qa_checklist` with **05 §15–§19** rows (audit §22) |
| **E1-S05** | Marked `DONE` | **Reopen** until `CONTRIBUTING.md` exists **or** README-only path is **explicitly** renegotiated in PRD/story map |
| **E3-S02+** | Depend on `E3-S01` only | Add **soft** dependency: “global truth surfaces” should not contradict **settings** once **REM-CARCH-003** merges |
| **E11-S02** | Depends on search shell | Ensure **explicit** dependency: **`validate` includes Pagefind** when enabled (**005**) |
| **E12-S02** | Depends on `E2-S01` | Add **soft** dependency on **REM-CARCH-003** before claiming canonical URLs “complete” |
| **E5-S09** | Build integrity | **Hard** dependency on **REM-CARCH-006** policy before “fail build on broken refs” is toggled ON |

---

## 8. Validation gate requirements

### QA revalidation (minimum packages)

From audit **§22**, expanded:

| Package | When | Checks |
| --- | --- | --- |
| **Regression** | Every remediation PR | `npm run validate`, `npm run build`, clean `git status` |
| **Story hygiene** | Before closing **E2-S08** | Committed YAML; checklist cites **05** |
| **Accessibility smoke** | After `<head>` / layout changes | Keyboard/focus on `/`, single `h1` |
| **SR4 honesty** | After **E11** | Search smoke per PRD §33 / **05 §19** item 6 — **not** before index exists |
| **False completion sweep** | Once per remediation wave | Any story touching schemas/routes/search must cite **05 §4 + §16** in `context_files` |

### Architect revalidation

| Gate | Trigger | Deliverable |
| --- | --- | --- |
| **E2-S08** | Nav/footer contract | Written sign-off vs **05 §3, §4.1, Appendix B.4** |
| **New collections** | **REM-CARCH-003+** | Story map **§5** classification + ADR if breaking |
| **Search** | **E11-S02** | Confirm **ADR-004** (Pagefind) still baseline (**005**) |

---

## 9. Safe remediation order

Ordered for **build stability**, **dependency truth**, and **minimum thrash**:

1. **REM-CARCH-001** — execution artefacts (or formal ADR to retire JSON requirement) so state is visible.  
2. **E1-S05 reopen + REM-CARCH-008** — add `CONTRIBUTING.md` (restores reviewer contract).  
3. **REM-CARCH-002** — README points to **05** (low risk, high clarity).  
4. **REM-CARCH-003** — `settings` bootstrap (**unlocks** footer + SEO).  
5. **REM-CARCH-004** — footer contact migration.  
6. **REM-CARCH-005** — canonical / default meta (after SEO defaults exist).  
7. **E2-S08** — complete **architect gate packet** + **REM-CARCH-007** decision doc.  
8. **REM-CARCH-006** — introduce `refs.ts` with **documented warn/fail** policy before bulk related content.  
9. **E11-S02** (existing epic) — Pagefind + `validate` (**005**), not a duplicate remediation ID.  

**Parallelism allowed:** **001** ∥ **002**; **003** can start after **002** if teams separate (no hard code conflict), but **004–005** must stay after **003**.

---

## 10. Deferred items

| Item | Defect | Defer until | Reason |
| --- | --- | --- | --- |
| Pagefind in `validate` | **005** | **E11-S02** | Correct epic ownership; avoid premature WASM/hosting policy work |
| Full OG/Twitter polish beyond defaults | **006** (partial) | **E12** polish stories | Avoid headline scope creep before defaults exist |
| `refs.ts` strict fail-on-all | **008** | First regulated bulk import | Prevent blocking early stubs |
| Dual layout convergence (`Layout.astro` vs `BaseLayout.astro`) | Report **§8** notes | Dedicated layout hygiene story | Not blocking narrow 05 alignment |
| `Welcome.astro` removal | Report note | Cosmetic cleanup story | No governance impact |

---

## 11. Blockers

| Blocker ID | Class | Meaning |
| --- | --- | --- |
| **B-PROG-009** | Programme (**CONTENT-ARCH-RETRO-009**) | Do **not** mark **E4–E11** “complete” or merge bulk content without schemas + gates **05** defines. |
| **B-TRUTH-E1S05** | Story truth (**007**) | **E1-S05** cannot remain `DONE` without `CONTRIBUTING.md` or an explicit scope change approved by PM/architect. |
| **B-SETTINGS** | Technical readiness (**003**) | **REM-CARCH-004** and **REM-CARCH-005** must not ship meaningfully before **`settings`** exists. |

---

## 12. Recommended implementation sequence (sprint-shaped)

| Sprint slice | Goal | Exit criteria |
| --- | --- | --- |
| **Slice A — Hygiene** | Traceability + honesty | **001** resolved; **E1-S05** reopened with fix in flight; README cites **05** |
| **Slice B — Contracts** | `settings` landed | **003** merged; architect gate recorded |
| **Slice C — Surfaces** | Footer + SEO honest | **004** + **005** merged; QA head-tag checklist attached |
| **Slice D — Integrity** | refs policy | **006** merged with documented warn/fail |
| **Slice E — Gates** | E2-S08 closed properly | Architect + QA packets updated for **05**; **007** decision logged |
| **Slice F — Programme** | Forward epics | E4+ stories start only with schema-first stubs per **05** |

---

## 13. Risks of incorrect remediation

| Risk | Consequence | Mitigation |
| --- | --- | --- |
| **`settings` schema churn** | Rewrite all consumers mid-epic | Architect pre-approves field list; version note in **05** |
| **Premature strict `refs.ts`** | Green build breaks on stubs | Phased warn → fail; scope to regulated collections first |
| **Silent re-close of E1-S05** | Token discipline collapses in review | QA holds merge without file proof |
| **SEO changes without trailing-slash policy** | Duplicate URL issues | Pair **REM-CARCH-005** with explicit ADR or config story |
| **Skipping execution artefacts** | Recurrent “missing backlog” defects | **001** first or formal retire path |

---

## 14. Recommended stop/go decision

| Decision | Condition |
| --- | --- |
| **GO — Remediation track** | Team accepts **E1-S05** reopen; allocates **REM-CARCH-003** in next sprint; keeps epic claims honest. |
| **CONDITIONAL GO — Feature track** | E3-S02+ may proceed **only** with honest stubs and **no** contradictions to **05**; any new collection introduces architect gate. |
| **NO-GO — “MVP complete” claims** | Until **B-PROG-009** cleared by implemented schemas/routes for claimed scope. |

---

## 15. Appendix A — Defect → story mapping (quick reference)

| Defect | Reopen story? | New remediation story? | Primary owner |
| --- | ---: | ---: | --- |
| 001 | No | **REM-CARCH-001** | Execution Controller / Architect |
| 002 | **E0-S07** (extend AC / context) | **REM-CARCH-002** (or subtask of E0-S07) | Dev + QA |
| 003 | No | **REM-CARCH-003** | Architect + Dev |
| 004 | **E2-S06** (revalidate) | **REM-CARCH-004** | Dev |
| 005 | No | *Use **E11-S02*** | Architect + Dev |
| 006 | **E12-S02** (when scheduled) | **REM-CARCH-005** | Dev + QA |
| 007 | **E1-S05** | **REM-CARCH-008** (= file add under reopened story) | Dev + QA |
| 008 | No (first consumer epics) | **REM-CARCH-006** | Architect + Dev + QA |
| 009 | All epics in false “done” state | **Process / PM** | PM + Architect |

---

## 16. Appendix B — Proposed `_bmad-output/execution/backlog.json`

> **Instruction:** Create directory `_bmad-output/execution/` if absent, then add this file (or merge equivalent fields into your tracker). This JSON is the **authoritative machine-readable mirror** of Sections 3–12.

```json
{
  "meta": {
    "schema_version": 1,
    "last_updated": "2026-05-14",
    "source_audit": "docs/05_qa/retroactive_content_architecture_validation_report.md",
    "architecture_baseline": "docs/03_architecture/05_content_architecture_and_cms_strategy.md",
    "architecture_baseline_version": "1.0.0"
  },
  "programme_gates": [
    {
      "id": "B-PROG-009",
      "defect": "CONTENT-ARCH-RETRO-009",
      "classification": "IMMEDIATE_BLOCKER",
      "statement": "No epic E4-E11 may be marked complete without 05-aligned schemas, routes, and validation discipline."
    }
  ],
  "story_corrections": [
    {
      "id": "E1-S05",
      "previous_status": "DONE",
      "recommended_status": "PROCESS_FIX_REQUIRED",
      "reason": "CONTENT-ARCH-RETRO-007: CONTRIBUTING.md missing; acceptance criteria unmet.",
      "linked_remediation": ["REM-CARCH-008"]
    },
    {
      "id": "E2-S08",
      "previous_status": "DONE",
      "recommended_status": "ARCHITECT_REVIEW",
      "reason": "Retro audit §19: gate evidence must cite 05; YAML drift risk if uncommitted.",
      "linked_remediation": ["REM-CARCH-007"]
    },
    {
      "id": "E3",
      "kind": "epic",
      "recommended_reporting_status": "PARTIAL",
      "reason": "Only E3-S01 delivered vs story map E3 scope."
    }
  ],
  "remediation_stories": [
    {
      "id": "REM-CARCH-001",
      "title": "Execution artefact restoration or ADR",
      "parent": null,
      "defects": ["CONTENT-ARCH-RETRO-001"],
      "classification": "REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES",
      "dependencies": []
    },
    {
      "id": "REM-CARCH-002",
      "title": "README cites 05 content architecture",
      "parent": "E0-S07",
      "defects": ["CONTENT-ARCH-RETRO-002"],
      "classification": "REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES",
      "dependencies": []
    },
    {
      "id": "REM-CARCH-003",
      "title": "settings singleton collection bootstrap",
      "parent": "E0-S04",
      "defects": ["CONTENT-ARCH-RETRO-003"],
      "classification": "IMMEDIATE_BLOCKER",
      "dependencies": []
    },
    {
      "id": "REM-CARCH-004",
      "title": "Footer contact lines sourced from settings",
      "parent": "E2-S06",
      "defects": ["CONTENT-ARCH-RETRO-004"],
      "classification": "REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES",
      "dependencies": ["REM-CARCH-003"]
    },
    {
      "id": "REM-CARCH-005",
      "title": "Canonical URLs and default SEO meta from settings",
      "parent": "E12-S02",
      "defects": ["CONTENT-ARCH-RETRO-006"],
      "classification": "REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES",
      "note": "Defer implementation scheduling until E12-S02 is active; not SAFE_TO_DEFER for SEO completeness claims.",
      "dependencies": ["REM-CARCH-003"]
    },
    {
      "id": "REM-CARCH-006",
      "title": "refs.ts build-time integrity utilities",
      "parent": "E5-S09",
      "defects": ["CONTENT-ARCH-RETRO-008"],
      "classification": "REQUIRED_BEFORE_FIRST_BULK_CROSS_COLLECTION_IMPORT",
      "dependencies": ["REM-CARCH-003"]
    },
    {
      "id": "REM-CARCH-007",
      "title": "Navigation compiler vs nav collection decision record",
      "parent": "E2-S08",
      "defects": ["05-APPENDIX-B-ITEM-4-NAV-DRIFT"],
      "classification": "REQUIRED_BEFORE_RELATED_FEATURE_CONTINUES",
      "dependencies": []
    },
    {
      "id": "REM-CARCH-008",
      "title": "Add CONTRIBUTING.md token checklist",
      "parent": "E1-S05",
      "defects": ["CONTENT-ARCH-RETRO-007"],
      "classification": "IMMEDIATE_BLOCKER",
      "dependencies": []
    }
  ],
  "deferred_to_epic_stories": [
    {
      "defect": "CONTENT-ARCH-RETRO-005",
      "target_story": "E11-S02",
      "classification": "SAFE_TO_DEFER"
    }
  ],
  "safe_order": [
    "REM-CARCH-001",
    "REM-CARCH-008",
    "REM-CARCH-002",
    "REM-CARCH-003",
    "REM-CARCH-004",
    "REM-CARCH-005",
    "REM-CARCH-007",
    "REM-CARCH-006",
    "E11-S02"
  ]
}
```

---

## 17. Appendix C — Proposed `execution-ledger.md` skeleton (non-normative)

Because **CONTENT-ARCH-RETRO-001** references both files, create `_bmad-output/execution/execution-ledger.md` with:

- Current **programme blockers** (Section 11)  
- **Reopened** stories with owner + target date  
- **Remediation** story IDs with PR links (filled over time)  
- **Architect gate** log (date, story, approver, doc refs including **05**)

---

*End of remediation execution plan.*
