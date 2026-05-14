# Decision: Navigation compiler (`navigation.ts`) versus optional `nav` collection

**Status:** Accepted (CPMR v5 static rebuild, 2026-05-14)  
**Remediation:** `REM-CARCH-007` (parent story gate: **E2-S08**)  
**Defect addressed:** `05-APPENDIX-B-ITEM-4-NAV-DRIFT` / **CONTENT-ARCH** audit follow-up  
**Authoritative baseline:** `docs/03_architecture/05_content_architecture_and_cms_strategy.md` **v1.0.0**

---

## 1. Context

`docs/03_architecture/05_content_architecture_and_cms_strategy.md` states:

- **§2.3 — Single navigation graph:** `src/data/navigation.ts` remains the **mechanical nav emitter**; an optional future **`nav` collection** must compile *into* the **same typed export** to avoid drift (see **§15**).
- **Appendix B.4:** the `navigation.ts` graph remains the source of `routeLive` until a `nav` collection **exporter** exists — **drift risk vs §4** must be tracked; a story/remediation must unify or document the boundary.

`docs/06_delivery/content_architecture_remediation_execution_plan.md` (**REM-CARCH-007**) requires: record the decision and the **triggers** for introducing an exporter or a `nav` collection — **minimum safe change** is documentation; optional thin comments in `navigation.ts`.

---

## 2. Decision

**For the current programme phase, the canonical navigation + `routeLive` graph lives in `src/data/navigation.ts` (build-time TypeScript module).**

- Layout surfaces (utility bar, mega menu, mobile drawer, and any consumers importing this module) continue to use **only** this compiler output pattern.
- There is **no** parallel Astro **`nav`** content collection in MVP; introducing one without a single compilation target would **violate** **05 §2.3** and recreate Appendix B.4 drift.

---

## 3. Triggers to introduce a `nav` collection or external exporter

Advance to a **`nav` collection** (or CMS export) **only when at least one** of the following is true and approved in story / architect gate:

1. **Editorial ownership:** non-engineering roles must change IA labels, order, or visibility **without** TypeScript PRs (governed editorial workflow).
2. **Volume / reuse:** multiple branded outputs or locales must consume the **same** nav graph with different presentation skins (still one logical graph).
3. **CMS contract:** a headless or Git-backed CMS provides nav as structured data and a **signed** ingest path exists per **05 §15** and **`04_architecture.md`** ADR posture (no silent runtime divergence).

**Non-negotiable on introduction:** any `nav` collection or exporter MUST compile or validate into the **existing typed exports** consumed by the app (or a deliberately migrated successor type with a **single** import surface and a migration story). **Two competing sources of truth** for public `href`s or `routeLive` are **out of scope** without a new ADR amending **05**.

---

## 4. Consequences

| Area | Effect |
| --- | --- |
| **IA changes** | Remain PR-reviewed edits to `navigation.ts` until triggers fire. |
| **Search / static build** | Unchanged: no new collection, no Pagefind or `index_behavior` surface for nav. |
| **Department mini-sites** | Unchanged: reuse the same module; do not fork IA lists per department. |
| **Governance** | E2-S08 architect gate and QA checklists cite this file plus **05** for navigation contract traceability. |

---

## 5. Traceability

| Artefact | Link |
| --- | --- |
| Baseline rules | `docs/03_architecture/05_content_architecture_and_cms_strategy.md` §2.3, §4, Appendix B.4, §15, §20 |
| Audit | `docs/05_qa/retroactive_content_architecture_validation_report.md` (navigation / Appendix B) |
| Plan | `docs/06_delivery/content_architecture_remediation_execution_plan.md` — **REM-CARCH-007** |
| Implementation | `src/data/navigation.ts` |
| Story gate | `docs/stories/E2-S08-navigation-data-single-source.yml` |

---

*Human architect named sign-off remains recommended before treating **E2-S08** as fully closed; this document satisfies the **REM-CARCH-007** written decision record.*
