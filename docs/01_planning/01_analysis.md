# CPMR Institutional Website — Analysis

**Document type:** BMAD Analysis phase output (Analyst)  
**Project:** `cpmr-website-v5-fresh` — greenfield institutional website build  
**Authoritative inputs:** `docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`, `docs/00_source/content_inventory.md`, `docs/00_source/client_feedback_register.md`, `docs/03_architecture/06_project_context.md`, live references `https://cpmr.org.gh/`, `https://www.ug.edu.gh/`  
**Stack/deployment constraints (locked):** Astro + TypeScript + Tailwind CSS v4; static `dist/` suitable for shared hosting (per project constitution and task briefing)  
**Date:** 2026-05-12  

---

## 1. Analysis overview

This analysis consolidates the **Initial Brief** with the **implementation constitution** (`docs/03_architecture/06_project_context.md`) and a lightweight review of the **current public site** and **reference institutional site**. Its purpose is to ground downstream BMAD work—especially PRD, UX, and architecture—without replacing those artifacts.

**BMAD Method runtime orientation** (from `bmad-help` / `_bmad/_config/bmad-help.csv` and `06_project_context.md`): analysis-phase research and briefing activities sit in **`1-analysis`**; **`Create PRD`** (`bmad-create-prd`) is **required** in **`2-planning`** before treating planning as complete. **Solutioning** requires architecture, epics/stories, and implementation readiness in order. **Implementation** requires sprint planning before sequential story execution. Pipeline discipline: **do not treat PRD as grounded if stakeholder-facing analysis inputs are missing or bypassed** where the project expects them.

**Material gaps in repo inputs:** `docs/00_source/content_inventory.md` and `docs/00_source/client_feedback_register.md` are **empty** at analysis time. The Initial Brief itself states that the client has **not** supplied a full verified content package. Analysis therefore **does not** enumerate inventory rows or feedback tickets; it records that condition and defers specifics to human-led inventory and client confirmation.

**Explicit cross-document tension (must be resolved in PM/architecture, not ignored):** the Initial Brief treats a **CMS-first**, editorially rich operational model as central. The project constitution states **no runtime CMS/database** for the locked static deployment model, with governed content in **`src/content/`** or **`src/data/`**. This is not a small styling disagreement—it affects product definition, editorial workflow, and technical architecture. Section 15–16 surface this for decision-makers.

---

## 2. Initial Brief interpretation

The Initial Brief defines a **greenfield institutional platform**, not a cosmetic refresh. Success is framed as **depth, governance, and maintainability**, not visual modernization alone.

Interpretive anchors taken directly from the Brief:

- **Institutional knowledge and service portal:** not a brochure, generic corporate site, or product catalogue by default.
- **Astro-first:** institutional publishing, structured content, static-first or aggressively cached pages; interactivity only where it improves UX (preview, search, forms, filters, events, galleries—per Brief §2.2).
- **Department mini-sites:** mandatory pattern—structured sections per department, not a single shallow page.
- **CMS-first content operations:** staff must update routine content without developer intervention; workflows, roles, and review intervals are mandatory expectations in the Brief.
- **Migration with verification:** legacy content is useful but uneven; **no blind copy-paste**; inventory, rewrite, verification, and structured content types are required.
- **Priority user journeys:** Clinic; Drug Analysis Unit; research discovery; department mini-sites; editor journey (draft → review → publish → reminders).
- **Recommended IA:** top-level sitemap and utility nav are specified (Brief §8).
- **MoSCoW:** “Must have” includes Astro, CMS-managed core content, department mini-sites, Clinic and DAU pages, leadership/governance, research projects, product categories, contact, deep footer, responsive design, accessibility basics, CMS roles/workflows (Brief §22).

The Brief explicitly instructs BMAD roles on focus areas (Analyst validation, PM framing CMS and governance as core, UX journeys and templates, Architect Astro/CMS/search/forms—Brief §24). This analysis aligns with those role hints but **does not** produce PRD, UX, architecture, or backlog items.

---

## 3. Institutional goals and constraints

**Goals** (from Brief §3, §5, §25):

- Position CPMR as Ghana’s authoritative national plant medicine research institution.
- Communicate scientific credibility, mandate, public service relevance, and research depth.
- Present the full value chain (conservation through training, partnerships, and public education).
- Deliver department mini-sites as the central structural pattern.
- Make **Clinic** and **Drug Analysis Unit** easy to find and operationally clear.
- Enable staff-led updates (text, images, profiles, events, news, downloads, services, products, publications).
- Preserve legacy value **only** after verification and restructuring.
- Support post-launch expansion; improve accessibility, mobile experience, search, SEO, and governance.
- Avoid an institutionally “thin” launch despite modern visuals.

**Tone and positioning** (Brief §5): authoritative but approachable; scientific but accessible; Ghanaian identity with international credibility; formal, calm, institutional; avoid exaggerated marketing, unverified claims, or overly commercial product positioning.

**Locked technical constraints** (task briefing + `06_project_context.md`):

- **Astro**, **TypeScript**, **Tailwind CSS v4**, **`output: 'static'`**, **`dist/`** deployment to **shared/static hosting** (no reliance on Node.js on the server for core pages).
- **Build gate:** `npm run validate` / `astro build` must pass.
- **Governance:** editable institutional copy and structured data should live under **`src/content/`** or **`src/data/`** per constitution—not embedded as permanent hardcoded marketing truth in components.

**Constitutional constraint vs Brief:** the constitution currently rules out **runtime** WordPress, headless CMS APIs, and databases on the public site. The Brief requires **CMS-like** editorial capability. The program must either (a) reconcile these via an approved content pipeline (e.g., git-based editorial workflows, build-time ingestion with human-approved tooling), or (b) formally change deployment/architecture assumptions with human approval. Section 15 treats this as a primary risk.

---

## 4. Stakeholder groups and user needs

The Brief’s audience table (Brief §6) is the authoritative breakdown. Summary by group and **stated** need:

| Stakeholder group | Primary need (per Brief) | Website response required (per Brief) |
| --- | --- | --- |
| Patients and general public | Clinic services, fees, hours, location, products, contact | Clear service pages, quick access, contact routes, clinic detail |
| Herbal product manufacturers | Drug analysis requirements, fees, samples, timelines, submission process | Detailed DAU page with forms, FAQs, workflow |
| Researchers and academics | Departments, projects, publications, staff, collaboration | Research hub, department mini-sites, publications, profiles |
| Government stakeholders | Mandate, governance, achievements, reports, impact | About, governance, reports, news archive |
| International partners and NGOs | Capacity, collaborations, credibility, contacts | Partnership pages, research highlights, departments, official contacts |
| Media and PR | News, statements, leadership bios, images, contacts | Media centre, announcements, gallery, press resources |
| Students, interns, trainees | Training, attachment, internship, library, careers | Careers & opportunities with clear instructions |
| CPMR staff editors | Simple update process | CMS dashboard, roles, structured forms, approval workflow |

**Observation:** editor stakeholders are defined at length in the Brief (roles, workflow, review intervals—Brief §10). Satisfying those stakeholders **within** static hosting and the constitution requires explicit workflow design—not assumption of a traditional logged-in CMS on the production host.

---

## 5. Existing website pain points

**Source basis:** Initial Brief §1, §20 (content gaps, uneven legacy material); live snapshot of `https://cpmr.org.gh/` (content retrieved for analysis, not a full crawl).

**From the Brief (explicit):**

- Prior migration attempt showed **visual modernization alone is insufficient**.
- **Incomplete client-supplied package:** text, images, leadership, departments, services, products, research assets not fully verified.
- Legacy site has **depth but uneven quality**; **unsuitable for direct migration** without verification.

**From live homepage observation (non-exhaustive, descriptive only):**

- **Institutional narrative is present** (history, vision, mission, endorsement framing) but **prioritized pathways** called out in the Brief (e.g., one-click Clinic access from homepage—Brief §7.1) are **not evidenced** in the fetched homepage excerpt in the same structured way the Brief prescribes for the redesign.
- **News listing** appears active; at least one listing shows a **date typo** (“20260”), suggesting **editorial QA** and **governance** gaps consistent with the Brief’s emphasis on governance.
- Some **promotional-style headings** appear on the fetched page (e.g., phrasing suggesting generic marketing angles). The Brief directs a **restrained institutional** tone and warns against brochure-like positioning—useful **UX/copy** guidance for the redesign, sourced from Brief §5 and §17.

No conclusion is drawn here about backend technology or performance of the current site; the Brief already establishes the strategic direction (Astro greenfield).

---

## 6. Content migration observations

**Recorded repo state:** `docs/00_source/content_inventory.md` is **empty**—no line-by-line migration matrix is available in-repo at analysis time.

**Brief-mandated approach** (Brief §20):

- Inventory old pages, partial new-site pages, feedback docs, images, reports, forms, products, departments, leadership.
- Assign each item a **status** (migrate after rewrite, verify with client, archive, create new, pending media, pending approval).
- **Priorities:** highest—Clinic, DAU, contact, leadership, departments, research projects, products, vision/mission, footer; medium—news, events, gallery, publications, downloads (Brief §20.3).

**Implication for PM/architecture:** migration scope **cannot** be quantified from this repository alone until inventory and client verification exist. The Brief already elevates **verification over volume**.

---

## 7. Information architecture observations

The Brief proposes a **top-level sitemap** (Brief §8): Home, About CPMR, Research, Departments, Services, Products, News & Events, Resources, Careers & Opportunities, Contact.

**Utility navigation** (Brief §8.1): Clinic, Drug Analysis Unit, Downloads, Publications, Contact, Search.

**Main navigation groupings** are specified at depth (About, Research, Departments, Services, Products, News & Events, Resources, Careers, Contact—Brief §8.2).

**Observation:** this IA is **coherent with** an institutional research-and-services portal and matches the Brief’s priority journeys (Clinic, DAU, research, departments). **Validation work** remains: exact labels, depth of mega-menus, and mobile nav patterns belong to UX—not presumed here.

**Alignment with constitution:** static routing under Astro (`src/pages/`) can express department slug patterns the Brief recommends (Brief §9.3); URL strategy finalization belongs to architecture/UX.

---

## 8. Homepage discovery observations

**Brief requirements** (Brief §11): hero with institutional positioning; quick access cards (Clinic, DAU, Departments, Publications, Products, Contact); announcement strip; mandate snapshot; research highlights; department preview; services preview; product category preview; news/events; publications/resources highlight; partners; deep footer; avoid CTA overload.

**Current site (fetched homepage excerpt):** institutional story, vision/mission, news/events block, and department-area labels appear. **Gap vs Brief:** the fetched excerpt does **not** demonstrate the Brief’s **explicit quick-access card model** and **structured announcement/governance** patterns at the level specified for the redesign.

**Reference site (`https://www.ug.edu.gh/`):** prominent **announcements/admissions** strips, **news**, **events**, and **featured links**—useful **patterns** for institutional prioritization of timely information. The Brief warns against copying another institution’s **brand identity** (Brief §22 “Should Not Do Now”); reference value is **information hierarchy**, not visual imitation.

---

## 9. Department mini-site discovery observations

**Brief requirement:** department mini-sites are **central**—each major department gets a structured sub-site with minimum sections (homepage, mandate, functions, head, staff, projects, publications, facilities, news, downloads, contact—Brief §9.2) and CMS-driven **relationships** (staff, projects, publications, services, events, news, downloads, gallery—Brief §9.4).

**Current site (fetched excerpt):** department labels appear (e.g., Clinical Research, Pharmacology/Toxicology, Plant Development, Pharmaceutics, Production). This supports **real departmental structure** as content input but **does not** establish that the current site implements full mini-site depth per Brief §9.

**Priority departments** for initial rollout are listed in the Brief (Brief §9.5) with an explicit note: **exact list must be verified with CPMR before launch**.

---

## 10. Research, publications, staff, services, products, news, events, gallery, downloads, and search observations

All bullets below trace to the **Initial Brief** unless labeled “constitution.”

- **Research:** Brief requires research overview, themes, department links, project pages, publications, researcher profiles, facilities, collaboration pathways (Brief §13); project template fields are specified (Brief §13.1).
- **Publications:** repository should support search, filters (year, department, author, area), abstracts, DOI/links, uploads where permitted, citations, related links (Brief §13.2).
- **Staff:** staff profiles and researcher profiles appear in IA and CMS types (Brief §8, §10.3).
- **Services:** Clinic and DAU are **highest operational priority**; service page templates include fees, hours, FAQs, downloads (Brief §12).
- **Products:** category structure (capsules, decoctions, ointments, powders, roots, teas); institutional presentation; Brief explicitly discourages behaving like a generic online shop unless e-commerce is approved later (Brief §14).
- **News, events, announcements:** separated concepts with distinct fields (Brief §15).
- **Gallery:** albums, captions, alt text, relationships to events/departments, video embeds (Brief §15.4).
- **Downloads / resources:** central document centre; filter by category, date, owner, type (Brief §16).
- **Site-wide search:** should cover pages, departments, staff, services, publications, projects, downloads, products, news, events; filterable results (Brief §19).

**Constitution observation:** global search spanning many types on a **fully static** deployment typically implies **client-side/bundled index**, **build-time generation**, or an **external search service**—none of which are selected in this analysis document. This is a **handoff item for Architect** (Section 19).

---

## 11. Accessibility observations

**Brief requirements** (Brief §18): semantic HTML; heading hierarchy; keyboard navigation; visible focus; alt text; accessible forms; colour contrast; skip link; reduced motion; readable tables on mobile; large tap targets; optimized mobile navigation; performance testing on low-to-mid-range Android devices.

**Constitution:** accessibility basics and **not** shipping final polished UI from a placeholder `DESIGN.md` (see `06_project_context.md` §7).

**Observation:** acceptance criteria for accessibility should be **explicit in PRD and QA**, including whether formal WCAG target level is required—**not stated** in the Brief excerpts used here beyond “accessibility basics” in MoSCoW (Brief §22).

---

## 12. SEO observations

**Brief:** CMS should support SEO metadata (Brief §10.2); institutional publishing implies legitimate **structured pages**, **clean URLs**, and **metadata** per content type.

**Live observation:** reference institutional sites often expose **clear news URLs** and dated content; the redesign should plan **stable URLs**, **meta discipline**, and **sitemap** behavior—details belong to architecture/PRD.

**Risk:** large-scale URL changes from legacy to new slug patterns imply **redirect strategy** on the hosting platform. The constitution emphasizes static hosting; redirect mechanics depend on host capabilities—**open question** for operators (Section 16).

---

## 13. Shared-hosting and static-output constraints

From `06_project_context.md` §4 and §8 (and task briefing):

- **Output:** HTML, CSS, JS, static assets only; **no Node.js** on the server for core pages.
- **Paths:** prefer patterns compatible with **subdirectory deployment** when applicable.
- **No** server-side secrets, sessions, or databases on the host for core pages.
- **Performance:** keep bundles reasonable; lazy-load heavy islands only when introduced with explicit stories.

**Implication:** features that imply **per-request server logic** (traditional CMS preview on demand, session-based admin on the same origin, server-rendered search) conflict with the **locked** static model unless the project boundary changes.

---

## 14. Editorial/content governance observations

The Brief defines **roles**, **workflow**, and **review intervals** (Brief §10.4–10.6)—e.g., fees/contact quarterly; departments and staff semi-annually; static institutional annually; products semi-annual or as determined.

The constitution defines **governance** for this repo: content/data under **`src/content/`** or **`src/data/`**; **no runtime CMS** assumed; placeholders acceptable only when stories allow and must be replaced.

**Observation:** meeting Brief §10 **literally** while honoring §6 **literally** requires a **deliberate editorial model**—for example **git-based publishing** with trained editors, **scheduled builds**, or an **externally hosted** headless CMS that feeds **build-time** static generation—**only** if approved and documented. This analysis **does not** pick a solution.

---

## 15. Risks and mitigations

| Risk | Basis | Mitigation direction (for downstream docs; not solutions) |
| --- | --- | --- |
| **CMS–static deployment contradiction** | Brief §4.3, §10 vs `06_project_context.md` §6, §11 | Human decision: reconcile via approved content pipeline and architecture, or adjust constitution/deployment with explicit change control |
| **Thin launch** | Brief §3.10, §25 | Prioritize verified depth for Clinic, DAU, departments, governance pages per MoSCoW |
| **Unverified migration** | Brief §4.5, §20 | Enforce inventory + rewrite + approval gates; block blind paste |
| **Operational inaccuracy (fees, hours, contacts)** | Brief §12, §10.6 | MoSCoW “Must have” includes service pages; tie updates to review intervals in governance |
| **Search complexity on static hosting** | Brief §19 vs §13 static rules | Architect search approach compatible with static output; scope filters realistically |
| **Forms without server** | Brief §12 (forms), constitution static host | PRD/architecture: form handling strategy (vendor, email gateway, external service)—**not prescribed here** |
| **Empty inventory / feedback files** | Repo state | Produce and maintain inventory and feedback register before claiming migration completeness |
| **Brand/tone drift** | Brief §5, §17 | UX/copy standards tied to institutional tone; reviewer role in workflow |

---

## 16. Open questions for the human operator

1. **Editorial system:** Will CPMR adopt **git-based** editorial workflows, a **build-time** CMS integration, or should the **constitution** change to allow runtime CMS—given Brief §10?
2. **Department list:** What is the **verified** department roster and slug scheme for launch (Brief §9.5)?
3. **Inventory and feedback:** When will **`content_inventory.md`** and **`client_feedback_register.md`** be populated so migration scope is evidence-based?
4. **Forms:** What are acceptable **data-handling** and **privacy** constraints for Clinic/DAU enquiries (Ghana context)—impacts PRD and implementation?
5. **Search:** Is **client-only** search acceptable for v1, or is **external** search/index mandatory—budget and privacy implications?
6. **Redirects:** What is the **legacy URL** landscape and **301** capability on the target host?
7. **Accessibility:** Is a specific **WCAG** conformance target required for launch?
8. **Products:** Confirm **no e-commerce** at launch (Brief §14, §22)—any exceptions?

---

## 17. Required handoff guidance for PM

- Treat **`Create PRD`** as the next **required** planning gate after this analysis (`bmad-help` / BMad Method CSV).
- Encode **CMS + department mini-sites + governance** as **core product scope**, not optional trim (Brief §4, §10, §24)—while **explicitly resolving** the **static-hosting / no-runtime-CMS** rule in `06_project_context.md` via **recorded** decisions (update PRD or constitution consistently).
- Maintain **MoSCoW** alignment (Brief §22); ensure **Clinic** and **DAU** journeys are **measurable** acceptance paths.
- Do **not** promise full publications archive or advanced features without confirming **content readiness** and **static-compatible** delivery strategy.
- Ensure **pipeline order**: analysis grounded → PRD → UX (recommended for UI-primary) per `06_project_context.md` §3.

---

## 18. Required handoff guidance for UX

- Design **institutional journeys** (Brief §7) with **mobile-first**, accessible layouts (Brief §18).
- Model **department mini-sites** as **first-class** navigation and page systems (Brief §9)—not shallow hub pages.
- Align homepage modules with Brief §11; validate **quick access** patterns against **one-click** Clinic objective (Brief §7.1).
- Treat **`DESIGN.md`** as the eventual UI contract (`06_project_context.md` §7); until replaced, avoid **final** polished marketing UI tied to placeholder guidance.
- Use **University of Ghana** only as **information architecture** reference, not visual identity (Brief §22).

---

## 19. Required handoff guidance for Architect

- Preserve **`output: 'static'`** and shared-hosting fit (`06_project_context.md` §4, §8; task briefing).
- Produce **search**, **forms**, **media**, and **performance** strategies **compatible** with static output; flag any Brief ambition that **implies** SSR/API routes early (Brief §2.3, §19).
- Define **content ingestion** consistent with constitution: **`src/content/`** / **`src/data/`** as sources of truth for institutional copy.
- Map **department URL patterns** (Brief §9.3) to Astro routing; define **relationship model** between entities (Brief §9.4) in **architecture** outputs—not in this analysis.
- Resolve **CMS-first Brief** vs **no-runtime-CMS constitution** with explicit ADRs or equivalent—this is the **primary** architectural fork.

---

## 20. Required handoff guidance for Scrum Master, Developer, and QA

- **Scrum Master:** Do not generate epics/stories until **PRD** and **architecture** exist and **implementation readiness** passes (`06_project_context.md` §3). Ensure backlog reflects **department mini-sites**, **governance**, and **static** constraints explicitly.
- **Developer:** Implement Astro/Tailwind foundations per locked stack; avoid **hardcoding** operational content that belongs in governed content layers (`06_project_context.md` §6); **one story at a time** unless humans override (`06_project_context.md` §9).
- **QA:** Test **accessibility**, **responsive** behavior, **search** (once defined), **critical journeys** (Clinic, DAU, department discovery), and **build gate** (`npm run validate`). Validate **no placeholder public pages** at stakeholder-ready launch (Brief §23)—when PRD defines Done.

---

*End of analysis document.*
