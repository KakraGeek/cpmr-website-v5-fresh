# Product Requirements Document — CPMR Institutional Website (Fresh Build)

**Product:** Centre for Plant Medicine Research (CPMR) institutional website  
**Repository:** `cpmr-website-v5-fresh`  
**Document type:** BMAD Planning artifact (`2-planning`)  
**Status:** Draft for stakeholder and architecture review  
**Authoritative inputs:**  
`docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`,  
`docs/01_planning/01_analysis.md`,  
`docs/03_architecture/06_project_context.md`  
**Live references (patterns only, not brand copy):** [CPMR current site](https://cpmr.org.gh/), [University of Ghana](https://www.ug.edu.gh/)  
**Locked stack:** Astro, TypeScript, Tailwind CSS v4  
**Locked deployment:** Static `dist/` output suitable for shared hosting (no Node.js on server for core public pages)  
**Date:** 2026-05-12  

---

## 1. Product overview

CPMR requires a **greenfield institutional web platform** that presents the organisation as Ghana’s authoritative national centre for plant medicine research and related services. The product is a **public, content-rich, accessibility-aware static site** that prioritises **service clarity** (especially Clinic and Drug Analysis Unit), **research discoverability** (departments, projects, publications, people), and **governance** (verified content, review cadence, no “thin” launch).

This PRD treats the site as an **institutional knowledge, service, and research portal**—not a generic brochure, undifferentiated corporate site, or e-commerce storefront unless explicitly approved later.

**Implementation constitution alignment:** The binding rules in `docs/03_architecture/06_project_context.md` require **`output: 'static'`**, **`dist/`** deployment to **generic static hosting**, and **no runtime CMS/database** on the public host for this deployment model. The Initial Brief simultaneously expects **CMS-class editorial behaviour** (roles, drafts, workflows). This PRD records that gap as a **program decision**: MVP satisfies editorial intent through **governed files** under `src/content/` and `src/data/` plus an agreed **human editorial process** (see Section 29). Any move toward runtime CMS, SSR, or databases is **out of MVP** unless the constitution is formally revised.

---

## 2. Goals

1. **Authority & credibility:** Position CPMR as the national reference institution for plant medicine research with calm, evidence-aligned tone.  
2. **Full value chain visibility:** Surface conservation, cultivation, research, laboratories, clinic, drug analysis, products, training, education, and partnerships.  
3. **Structured institution:** Deliver **department mini-sites** as the primary navigational and content pattern—not shallow department blurbs.  
4. **Service discovery:** Make **Clinic** and **Drug Analysis Unit** reachable and understandable with operational detail (hours, fees, process, contact).  
5. **Research portal:** Enable journeys from research overview → departments → projects → publications → people.  
6. **Sustainable operations:** Keep institutional copy and structured data out of “hidden” component strings; use governed content locations per constitution.  
7. **Verified migration:** No blind copy-paste from legacy; inventory, rewrite, and approval before publication.  
8. **Inclusive access:** Semantic markup, keyboard use, readable tables on mobile, performance suited to low–mid-range devices in Ghana.  
9. **Static-first delivery:** Ship a **`dist/`** artefact that runs on **shared hosting** without server-side runtime for core pages.  
10. **Deterministic delivery discipline:** Enable UX → architecture → epics/stories → implementation readiness without skipping BMAD gates.

---

## 3. Non-goals

1. **MVP is not a Next.js-first or SSR-default product** for public pages; server adapters and SSR-only features are excluded from MVP public delivery.  
2. **MVP is not a runtime WordPress/headless CMS on the production host** per locked constitution; “CMS” behaviour is satisfied through governed files + process unless governance approves a change.  
3. **Not an e-commerce launch:** no cart, payment capture, or fulfilment on primary institutional MVP unless explicitly rescoped.  
4. **Not visual imitation** of the University of Ghana or any peer site—reference sites inform **information hierarchy** only.  
5. **Not a promise of complete legacy archive** at launch without verified content and static-compatible delivery plans.  
6. **Not developer-owned operational truth:** fees, hours, contacts, and leadership facts must not live only in code long-term.

---

## 4. Audience segments

| Segment | Primary needs | Product response |
| --- | --- | --- |
| Patients & public | Clinic hours, fees, location, products, contact | Homepage quick access, Clinic detail, contact routes, clear service pages |
| Herbal manufacturers | DAU requirements, fees, samples, timelines | Dedicated DAU section, FAQs, downloadable forms, step-by-step flow |
| Researchers & academics | Departments, projects, publications, expertise | Department mini-sites, research hub, publications library, profiles |
| Government stakeholders | Mandate, governance, reports, impact | About/institutional depth, news/archive, downloadable reports |
| International partners & NGOs | Capacity, collaborations, credibility | Partnerships/affiliations, research highlights, official contacts |
| Media & PR | News, statements, leadership, assets | News, announcements, gallery, press-oriented resources |
| Students & trainees | Careers, attachments, NS, library cues | Careers & opportunities section with explicit instructions |
| CPMR editors | Sustainable updates | Governed content files, documented roles/process, review cadence (Section 29) |

---

## 5. Functional requirements

**F1 — Navigation & IA:** Implement the Brief’s top-level IA (Home, About, Research, Departments, Services, Products, News & Events, Resources, Careers, Contact) with **utility navigation** (Clinic, DAU, Downloads, Publications, Contact, Search).  

**F2 — Department mini-sites:** Each verified department has a **durable URL subtree** with listing and detail patterns for staff, projects, publications, services, news, downloads, and contact as applicable.  

**F3 — Content types:** Support structured presentation for pages, departments, staff, services (including Clinic & DAU), research projects, publications, products by category, news, events, announcements, downloads, media gallery, and global settings (navigation/footer/contact surfaces).  

**F4 — Relationships:** Department-centric views must surface **linked** staff, projects, publications, services, events, news, downloads, and gallery items when data exists—implemented as **static generation from structured data**, not runtime joins.  

**F5 — Forms:** Contact and service enquiry paths exist; **submission handling** must not assume server-side code on static hosting (e.g. third-party form endpoints, mailto patterns, or approved automation)—exact mechanism is an architecture decision.  

**F6 — Search:** Site-wide **static-compatible** search covering core types (see Section 23).  

**F7 — Media:** Image optimisation pipeline compatible with Astro static build; alt text and captions required in content model.  

**F8 — Governance signals:** Content supports **last reviewed** metadata and editorial status where specified in architecture/content strategy.  

**F9 — No public placeholder pages** at stakeholder-ready launch (per Brief definition of done—applied per phased scope).

---

## 6. Non-functional requirements

**NFR1 — Stack compliance:** Astro ^6.x, TypeScript, Tailwind CSS v4 via project-standard Vite plugin; **`npm run validate` passes**.  

**NFR2 — Static output:** `astro.config.mjs` maintains **`output: 'static'`**; build produces deployable **`dist/`**.  

**NFR3 — Hosting fit:** No reliance on Node.js, databases, or server-side secrets on the **production host** for core pages.  

**NFR4 — Security & privacy:** Forms and external services comply with agreed data-handling policy (human decision—see risks).  

**NFR5 — Maintainability:** Institutional copy and structured entities live under **`src/content/`** or **`src/data/`** per constitution.  

**NFR6 — Observability:** Analytics hook optional; must not violate static hosting assumptions (client-side tags acceptable if approved).  

**NFR7 — Documentation:** Editorial workflow and build/deploy steps documented for handover.

---

## 7. Content requirements

**C1 — Tone:** Formal, calm, institutional; authoritative but approachable; Ghanaian identity with international credibility; avoid hype and unverified therapeutic claims.  

**C2 — Verification:** All migrated legacy material passes **inventory → rewrite → approval** before publication.  

**C3 — Priority filling order (MoSCoW alignment):** Clinic, DAU, Contact, Leadership, Departments, Research projects, Products, Vision/Mission, Footer first; then news, events, gallery, publications, downloads as content allows.  

**C4 — Assets:** Images with alt text; documents with titles, types, and ownership metadata; consistent citation fields for publications.  

**C5 — Review cadence (editorial policy):** Fees/contact quarterly; departments/staff semi-annual; static institutional pages annual; products semi-annual or as directed—**tracked in content metadata** and operational checklist even if automation is minimal in MVP.  

**C6 — Repo gaps:** `content_inventory.md` and `client_feedback_register.md` are **empty** at analysis time; PRD treats population of these as **blocking** for claiming migration completeness.

---

## 8. Homepage requirements

**H1 — Hero:** Institutional positioning statement and primary visual aligned with eventual `DESIGN.md` (not placeholder-polished until UX contract applies).  

**H2 — Quick access:** One-click prominence for **Clinic**, **Drug Analysis Unit**, **Departments**, **Publications**, **Products**, **Contact** (card or equivalent pattern).  

**H3 — Announcements strip:** Supports urgent/time-bound notices with governed fields (priority, date range, optional homepage visibility).  

**H4 — Mandate snapshot:** Short About/mandate block linking to About section.  

**H5 — Research highlights:** Curated or rule-based surfacing of projects/themes.  

**H6 — Department preview:** Entry into department index / featured departments.  

**H7 — Services preview:** Entry to Clinic, DAU, and other priority services.  

**H8 — Product categories preview:** Category tiles linking to Products section.  

**H9 — News & events:** Recent items with dates and links to archives.  

**H10 — Publications/resources teaser:** Link into publications or downloads as appropriate.  

**H11 — Partners & affiliations:** Logo row or list with outbound policy compliance.  

**H12 — Deep footer:** See Section 24.  

**H13 — CTA discipline:** Avoid noisy competing CTAs; prioritise Brief journeys.

---

## 9. About and institutional page requirements

**A1 — Coverage:** Overview, History, Mandate, Vision & Mission, Leadership, Board Members, Management Team, Organisational Structure, Awards & Recognition, Partners & Affiliations—as scoped per MVP vs phases.  

**A2 — Governance clarity:** Separately identifiable leadership bios, board listings, and management roles with **verified** names/titles.  

**A3 — Evidence & reports:** Pathways to annual reports and key institutional PDFs via Resources/Downloads when available.  

**A4 — Editorial accuracy:** No speculative statistics; cite sources where claims are quantitative.

---

## 10. Department mini-site requirements

**D1 — Definition:** A mini-site is a **structured route subtree** under `/departments/[slug]/…`, not a single paragraph on a hub page.  

**D2 — Minimum pages (per department as content allows):** Department home, overview/mandate, functions, head of department, staff listing, research/operations focus, related projects, related publications, facilities/labs, department news, downloads/forms, contact.  

**D3 — URL pattern (baseline):** `/departments/[department-slug]/` with logical children such as `staff/`, `projects/`, `publications/`, `services/`, `news/`—exact routing finalized in architecture/UX.  

**D4 — Relationships:** Lists on department pages pull from shared structured sources (staff, projects, publications, etc.).  

**D5 — Rollout list:** Priority departments from Brief (Clinical Research, Scientific & Technical Services, Pharmacology & Toxicology, Phytochemistry, Microbiology, Pharmaceutics, Plant Development & Production, production-related units, admin as applicable) are **candidates** until verified with CPMR.

---

## 11. Research project requirements

**R1 — Index & detail:** Research overview and themed entry points; each project has a detail template.  

**R2 — Project fields:** Title, therapeutic/research area, summary, background, objectives, activities, team, partners, outputs, linked publications, status, contact.  

**R3 — Cross-linking:** Projects link to departments and staff; reverse links from department mini-sites.  

**R4 — Static generation:** All project pages pre-rendered at build from structured content.

---

## 12. Publications library requirements

**P1 — Repository behaviours:** Listing with title, authors, year, abstract/excerpt, DOI/external link, optional PDF when permitted.  

**P2 — Discovery aids:** Filters compatible with static delivery—year, department, author, research area—implemented via client-side filtering of a **build-generated index** or paginated static lists per architecture.  

**P3 — Relationships:** Link to staff and departments; avoid orphan publication pages.  

**P4 — Legal/compliance:** PDF hosting only when rights verified.

---

## 13. Staff and leadership profile requirements

**S1 — Types:** Leadership, researchers, department staff, service leads—as data permits.  

**S2 — Profile fields:** Name, role/title, department affiliation, photo (with alt text), biography, expertise tags, related projects/publications, contact pattern approved by institution.  

**S3 — Directory/listing:** Browseable listing with filters (department, role) consistent with static strategies.  

**S4 — Separation:** Leadership/governance pages remain institutionally prominent vs generic staff directory.

---

## 14. Services requirements

**SV1 — Template consistency:** Non-Clinic services follow shared template: overview, eligibility/audience, requirements, procedure, fees if applicable, hours, FAQs, documents, contact.  

**SV2 — Priority:** Clinic and DAU exceed generic depth requirements (see Sections 15–16).  

**SV3 — Fees:** Fee tables are content-owned, accessible tables—not images of tables—with mobile readability.  

**SV4 — Cross-links:** Services appear from homepage, Services hub, and relevant departments.

---

## 15. Clinic detail requirements

**CL1 — Operational completeness:** Overview, who is served, hours, consultation flow, fee tables, lab services, insurance notes if applicable, visit instructions, FAQs, downloads, location guidance, contact channels.  

**CL2 — Homepage journey:** Reach Clinic intent from homepage **within one click** from quick access (Brief §7.1).  

**CL3 — Accuracy gates:** Fees and hours carry review metadata; changes follow editorial policy.  

**CL4 — Accessibility:** Forms for enquiries meet WCAG-oriented requirements in Section 25.

---

## 16. Drug Analysis Unit requirements

**DAU1 — Manufacturer journey:** Clear step-by-step for sample submission, analysis types, turnaround, fees, reporting/collection, regulatory context **only** when verified by CPMR.  

**DAU2 — Artefacts:** Downloadable submission forms and PDFs as governed assets.  

**DAU3 — FAQs:** Address common failure modes (sample rejection, timing, payment).  

**DAU4 — Contact:** Distinct contact pathway from general contact where appropriate.

---

## 17. Products requirements

**PR1 — Category taxonomy:** Capsules, decoctions, ointments, powders, roots, teas—expand only with stakeholder approval.  

**PR2 — Presentation:** Institutional, responsible-use framing; disclaimers as required by policy—not a consumer retail experience in MVP.  

**PR3 — Product detail:** Image, description, responsible use note, enquiry route (no checkout in MVP unless scope changes).  

**PR4 — Tone guardrails:** Avoid exaggerated marketing claims; align with Brief §14.

---

## 18. News requirements

**N1 — Fields:** Title, date, category, featured image (alt text), excerpt, body, optional related department/project, author/editor attribution if used.  

**N2 — Listing & RSS:** Index pages and stable URLs; optional RSS/sitemap inclusion per Section 26.  

**N3 — Archive:** Date-aware listing with pagination strategy compatible with static generation.

---

## 19. Announcements requirements

**AN1 — Distinction:** Separate from news—short-lived or high-priority notices.  

**AN2 — Fields:** Priority, date range, audience tags if needed, optional homepage surfacing, optional CTA link.  

**AN3 — Conflict rules:** Architecture defines precedence vs homepage hero and news (avoid clutter).

---

## 20. Events requirements

**E1 — Fields:** Title, date/time, venue, status, description, registration link if applicable, organiser, related department.  

**E2 — Calendar UX:** Month/list views compatible with static approaches (pre-rendered ranges or client enhancement per architecture).  

**E3 — Past events:** Archived access for institutional record.

---

## 21. Media gallery requirements

**G1 — Albums:** Grouped albums with captions and alt text.  

**G2 — Relationships:** Optional links to events and departments.  

**G3 — Video:** Embeds only when allowed by privacy/load policies; lazy loading for performance.  

**G4 — Performance:** Optimised images; avoid massive uncropped uploads on listing pages.

---

## 22. Downloads/document centre requirements

**DL1 — Repository:** Central downloads hub with categories (annual reports, forms, brochures, policies, service documents, etc.).  

**DL2 — Metadata:** Title, description, document type, date, owning unit, file size/format surfaced accessibly.  

**DL3 — Filters:** Category and date filters via static-compatible mechanisms.  

**DL4 — Integrity:** Version updates replace files through governed process with changelog notes for editors.

---

## 23. Static search requirements

**SR1 — Coverage:** Pages, departments, staff, services, publications, projects, downloads, products, news, events—scope may phase by MVP bandwidth but intent is site-wide.  

**SR2 — Implementation constraint:** Must not depend on SSR or hosted DB; acceptable patterns include **client-side index** loaded with the site, **prebuilt JSON index** in `dist/`, or approved **third-party search**—pick in architecture ADR.  

**SR3 — UX:** Query UI, results grouped by type with filters as feasible.  

**SR4 — Honesty:** If MVP ships reduced coverage, banner/limitation is **not** acceptable for production without explicit phase tag—prefer minimal viable index over silent gaps.

---

## 24. Footer requirements

**FTR1 — Depth:** Multi-column institutional navigation mirroring priority IA and utility links.  

**FTR2 — Contact surfacing:** Address, phone, email patterns, hours pointers, map link if available.  

**FTR3 — Legal/compliance slots:** Space for policies as provided (privacy, terms if applicable).  

**FTR4 — Stability:** Footer content sourced from governed settings/content, not scattered literals.

---

## 25. Accessibility requirements

**AC1 — Baseline:** Semantic HTML, logical heading order, keyboard operability, visible focus, skip link, form labels/errors, alt text, sufficient contrast.  

**AC2 — Motion:** Respect `prefers-reduced-motion` for animations if/when added.  

**AC3 — Tables:** Fee and data tables remain usable on small screens (responsive patterns, stacked presentation where needed).  

**AC4 — Touch targets:** Adequate size/spacing for primary navigation on mobile.  

**AC5 — Target:** Specific WCAG level (e.g. 2.1 AA) is **not fixed in Brief**—record as **open decision**; MVP commits to “accessibility basics” with path to formal conformance testing in Phase 2 if required.

---

## 26. SEO and metadata requirements

**SEO1 — Per-page metadata:** Title/description patterns per template; Open Graph/Twitter fields where architecture specifies.  

**SEO2 — URLs:** Clean, stable slugs; documented slug policy for departments and documents.  

**SEO3 — Sitemap & robots:** Generated static `sitemap.xml` and `robots.txt` behaviour aligned with hosting.  

**SEO4 — Redirects:** Legacy URL migration needs **301 strategy** compatible with host (see risks).  

**SEO5 — Canonical:** Avoid duplicate content across filtered views; canonical rules defined in architecture.

---

## 27. Performance requirements

**PF1 — Static asset discipline:** Lean JS by default; islands only where justified by stories.  

**PF2 — Images:** Appropriate formats/sizes; lazy loading for below-fold galleries.  

**PF3 — Core pathways:** Clinic and DAU pages remain fast on mid-tier Android devices (representative testing).  

**PF4 — Budgets:** Architecture may define perf budgets; Lighthouse/metrics as QA gates optional but recommended.

---

## 28. Shared-hosting deployment requirements

**SH1 — Artefact:** Upload **`dist/`** or host-equivalent static root; **no Node** requirement on server.  

**SH2 — Paths:** Prefer architecture guidance for **subdirectory deployment** compatibility—relative asset paths where needed.  

**SH3 — Environment:** No server secrets for core page rendering; client-side public keys only where applicable and reviewed.  

**SH4 — CDN/static:** Compatible with GitHub Pages–class or generic Apache/nginx static roots.

---

## 29. CMS / content editing requirements

This section **reconciles** the Initial Brief’s CMS-first operational model with the constitution’s **no runtime CMS/database** on the static host.

**CM1 — Editorial source of truth (MVP):** Structured Markdown/MDX/YAML/JSON (or similar) under **`src/content/`** and **`src/data/`**, consumed at **build time** to generate static pages.  

**CM2 — Roles & workflow (process):** Super Admin, Content Administrator, Department Editor, Service Editor, Media Editor, Reviewer, Publisher roles from Brief map to **human responsibilities**—implemented as **documented workflow** (e.g. PR approvals, sign-off checklist) unless/until tooling changes.  

**CM3 — Draft vs published:** Branch/PR drafts or duplicate staging files per architecture/content strategy—**no runtime preview server** assumed on MVP hosting; local preview via `npm run dev` / `astro preview`.  

**CM4 — Scheduled publishing:** MVP uses **build & deploy cadence** (e.g. weekly release) rather than server timers unless external CI/CD provides scheduling.  

**CM5 — Media library:** Files live under repo-managed asset paths with governance in editorial docs; optimisation via build pipeline.  

**CM6 — Future optionality:** A **headless CMS → build** pipeline or **Next.js/Supabase** app layer may appear **only** as a **Phase 2+** initiative with explicit ADR and constitution review—not MVP defaults.

---

## 30. MVP scope

**MVP includes:**

- Astro static site with locked stack; **`npm run validate` green**.  
- Homepage meeting Section 8 (within content availability).  
- Core About subset: Overview, Mandate, Vision & Mission, Leadership (as verified), Partners/Affiliations minimal viable.  
- Department **index** plus **at least N** fully populated mini-sites where **N** is agreed with CPMR (minimum **three** research-facing departments if content supports—exact **N** decided in sprint planning).  
- Clinic and DAU pages to Sections 15–16 completeness **for verified content**.  
- Research overview + project templates populated for **initial** project set.  
- Publications library **skeleton** with **initial** populated entries if sources exist; otherwise phased with explicit banner only if stakeholders accept (prefer deferring launch of empty library section navigation).  
- Staff/leadership profiles for **available** verified individuals.  
- Products section at category level with representative items **if** approved assets exist.  
- News & announcements with **at least** listing templates and seed items from verified sources.  
- Events listing with near-term events **or** honest empty-state hidden from nav until ready—pick in UX.  
- Downloads centre with **priority** forms (Clinic/DAU/general).  
- Footer depth **aligned** to realistic content (no fake links).  
- **Static search** minimum: core pages + departments + primary services (expand per Section 23 roadmap).  
- Accessibility basics (Section 25); SEO foundations (Section 26).

---

## 31. Phase 2 scope

- Expand department mini-sites to full verified roster.  
- Publications corpus growth; advanced filters; potential bulk import tooling.  
- Media gallery at scale with editorial workflow refinements.  
- Formal WCAG audit/remediation if required.  
- Enhanced search index coverage and ranking tweaks.  
- Analytics integration package.  
- Newsletter capture **if** policy-approved.  
- Optional **headless CMS build pipeline** evaluation (still producing static `dist/`).  
- Redirect campaign completion for legacy URLs once inventory exists.

---

## 32. Phase 3 scope

- **Optional application layer** (e.g. authenticated tools, Next.js/Supabase) **only** if institution approves non-static needs—must not break public static deployment assumptions without ADR.  
- Multilingual content **if** mandated.  
- Advanced research dashboards/visualisations.  
- Chatbot / guided intake **if** justified.  
- E-commerce or payments **only** after legal/commercial approval.

---

## 33. Acceptance criteria by feature

| Feature area | Acceptance criteria |
| --- | --- |
| Build & deploy | `npm run validate` passes; `dist/` deploys on target static host without Node |
| Homepage | Quick access includes Clinic & DAU; mandate snapshot; pathways to departments/research/services/news |
| About | Published pages contain **verified** leadership facts; no placeholder names |
| Departments | Each launched mini-site includes mandated sections **or** explicit UX-approved deferrals documented |
| Clinic | Hours/fees/contact accurate per signed-off source; downloadable forms present if promised |
| DAU | Submission process & fees documented; FAQs cover top risks |
| Research projects | Template fields render; linked departments/staff when data exists |
| Publications | List + detail; filters work per chosen static mechanism |
| Staff | Profiles render from data; images have alt text |
| Products | Categories navigable; disclaimers/enquiry path visible |
| News/Events/Announcements | Distinct templates; dates correct; archive pages exist |
| Gallery | Album pages accessible; keyboard navigable carousels if used |
| Downloads | Files download; metadata displayed; no broken links in MVP set |
| Search | User can find Clinic, DAU, at least one department, one staff profile via search MVP |
| Footer | Contact info accurate; links work or are absent—not broken |
| Accessibility | Keyboard-only usable main flows; no critical axe blockers on representative pages |
| SEO | Unique titles/descriptions; sitemap publishes |

---

## 34. Out-of-scope items

1. Runtime SSR/API routes on production for public MVP.  
2. Database-backed public site in MVP.  
3. Authenticated CMS on production host in MVP (constitution).  
4. Full e-commerce.  
5. Large-scale blind migration from legacy.  
6. Visual plagiarism of peer institutions.  
7. Medical claims beyond verified institutional statements.

---

## 35. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| **Brief vs constitution (CMS/runtime)** | Encode MVP as file-based governance + human workflow; ADR fork for future headless CMS build pipeline |
| **Thin launch** | Prioritise Clinic/DAU/department depth; gate launch readiness on verified facts |
| **Empty inventory files** | Populate `content_inventory.md` & feedback register before migration claims |
| **Search complexity** | Phase SR requirements; choose index strategy in architecture |
| **Forms on static host** | Select vendor/email workflow with privacy review |
| **Legacy redirects** | Inventory URLs; implement host-level 301 where supported |
| **Accessibility certification** | Decide WCAG target; schedule audit if legally required |
| **Performance on low-end devices** | Image discipline; minimal JS; test on representative hardware |

---

## 36. Handoff notes for UX, architecture, epics, stories, and deterministic execution

**UX (`docs/02_design/`):** Produce `03_ux_blueprint.md` and evolve `DESIGN.md` as the UI contract; model Initial Brief user journeys (Brief §7); mini-sites first-class; homepage quick-access parity with Section 8; use UG site only for hierarchy patterns; mobile-first and accessible layouts per Section 25.

**Architecture (`docs/03_architecture/`):** Maintain `output: 'static'`; document content schema for `src/content` / `src/data`; ADR on search, forms, images, SEO; explicit resolution path for **Brief CMS expectations** vs **static constitution**; define department URL scheme and relationship IDs; note optional Phase 2 headless CMS **without** implying MVP runtime.

**Epics & stories:** Derive from this PRD + architecture; ensure department mini-sites, governance, and static constraints appear as explicit backlog objects; **no story YAML in this PRD**.

**Implementation readiness:** Run `bmad-check-implementation-readiness` after architecture + epics exist.

**Deterministic execution:** One story per development cycle unless humans override (`06_project_context.md` §9); **`bmad-help`** for routing; fresh chats per major BMAD step when practical.

---

*End of PRD.*
