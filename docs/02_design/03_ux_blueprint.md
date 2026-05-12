# CPMR UX Blueprint — Institutional Research Website

**Document type:** Design-phase UX specification (`docs/02_design/`)  
**Project:** Centre for Plant Medicine Research (CPMR) — greenfield Astro static site  
**Status:** Draft for architecture, visual design (`DESIGN.md`), and story breakdown  
**Authoritative inputs:**  
`docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`,  
`docs/01_planning/01_analysis.md`,  
`docs/01_planning/02_prd.md`,  
`docs/03_architecture/06_project_context.md`  
**Live references (patterns only, not brand/visual copy):** [CPMR](https://cpmr.org.gh/), [University of Ghana](https://www.ug.edu.gh/)  
**Locked delivery model:** `output: 'static'`, `dist/` on generic static hosting; governed content in `src/content/` and `src/data/` (no runtime CMS on production host for MVP per PRD §29)  
**Date:** 2026-05-12  

---

## 1. UX principles for CPMR

These principles govern layout, interaction, copy tone, and prioritisation. They intentionally favour **institutional clarity** over marketing spectacle.

| Principle | Meaning for UX |
| --- | --- |
| **Institutional first** | Every screen answers: who CPMR is, what it is authorised to do, and how to proceed safely and legally. Avoid brochure hype and undifferentiated “startup” patterns. |
| **Research-grade** | Dense information (fees, methods, citations) is **scannable**: hierarchy, tables, definition lists, and anchors—not walls of prose. |
| **Credible** | Claims are tied to verifiable sources where quantitative; no placeholder leadership or invented statistics. Empty or unknown content uses honest empty states (Section 26), not filler. |
| **Calm** | Restrained motion; generous whitespace; limited accent colour; no competing primary CTAs on the homepage (PRD §8 H13). |
| **Accessible by default** | Keyboard paths, focus visibility, semantic regions, and readable tables on small screens are **non-negotiable** behaviours (Section 24). |
| **Ghana-rooted, clutter-free** | Identity through typography, colour discipline, and photography of **real** CPMR context—not decorative “tourism” motifs or stock clichés. |
| **Not generic SaaS** | Avoid dashboard cards, gradient blobs, and interchangeable icon grids that could belong to any product. Prefer **document-like** clarity and **public-sector** navigation depth. |
| **Service and research parity** | Clinic and Drug Analysis Unit (DAU) are **equal citizens** with research: discoverable in one interaction from home (Brief §7.1–7.2; PRD §8 H2). |
| **Department mini-sites as places** | A department is a **persistent place** in IA (URL subtree + local navigation), not a paragraph on a hub page (Brief §9). |
| **Static-honest UX** | Features that imply per-request server logic (live CMS preview on host, session-based personalization) are **out of scope** for MVP; editorial preview is **local/build** (PRD §29 CM3). |

**Design direction (visual handoff):** medicinal-plant-inspired greens and neutrals, warm accents **sparingly**, strong type hierarchy, consistent cards/blocks—without excessive animation (Brief §17.1). Final tokens live in `DESIGN.md` once it replaces the placeholder.

---

## 2. Audience needs and priority tasks

Authoritative audience table: Brief §6 / PRD §4. Below: **priority tasks** (what users try to accomplish) ranked for **navigation and homepage** prominence.

| Audience | Priority tasks (MVP) | UX success signals |
| --- | --- | --- |
| **Patients & public** | Find Clinic hours, fees, how to visit; find general contact; browse products responsibly | Clinic reachable in **one click** from home; fee tables readable on phone; clear “how to visit” strip |
| **Herbal manufacturers** | Understand DAU submission steps, turnaround, fees; download forms | Stepper or numbered process; FAQ covers rejection/timing/payment (PRD §16 DAU3) |
| **Researchers & academics** | Discover departments → projects → publications → people; find collaboration route | Breadcrumb depth predictable; cross-links from projects to departments/staff |
| **Government stakeholders** | Find mandate, governance, reports, impact narrative | About depth and Resources/Reports pathways obvious in mega menu and footer |
| **International partners & NGOs** | Assess capacity, partnerships, official contacts | Partners page + research overview + stable contact patterns |
| **Media & PR** | Find news, announcements, gallery, leadership bios | Distinct News vs Announcements; press-oriented entry in News & Events cluster |
| **Students & trainees** | Find careers, internships, attachments, National Service | Careers hub with plain-language steps |
| **Editors (operational)** | Update governed files; run review cadence | Out of end-user UX—documented editorial process (PRD §29); UX supports **last reviewed** surfacing where architecture provides fields |

**Homepage priority surface:** Quick access must foreground **Clinic**, **DAU**, **Departments**, **Publications**, **Products**, **Contact** (Brief §11; PRD §8 H2). Secondary surfaces: announcement strip, mandate snapshot, research highlights.

---

## 3. Information architecture

### 3.1 Top-level primary IA (persistent main nav)

Aligned to Brief §8 and PRD §5 F1:

1. **Home**  
2. **About CPMR**  
3. **Research**  
4. **Departments**  
5. **Services**  
6. **Products**  
7. **News & Events**  
8. **Resources**  
9. **Careers & Opportunities**  
10. **Contact**

### 3.2 Secondary “always findable” destinations

These appear in **utility nav** and/or **footer** (Sections 4, 23): Clinic, DAU, Downloads, Publications, Contact, Search.

### 3.3 URL philosophy

- **Stable slugs** for departments, services, and major institutional pages (PRD §26 SEO2).  
- **Department subtree** baseline: `/departments/[department-slug]/…` (Brief §9.3; PRD §10 D3).  
- **No navigational links** to routes without approved content (PRD §30 MVP footer rule—prefer absence over broken links).

### 3.4 Content-type ↔ IA mapping (UX-level)

| User mental model | Primary IA home | Notes |
| --- | --- | --- |
| “What is CPMR?” | About | Overview + Mandate + Vision/Mission |
| “What research happens here?” | Research → Departments / Projects / Publications | Research hub bridges institution-wide and departmental views |
| “Which unit do I visit?” | Departments | Index + mini-sites |
| “What services can I use?” | Services | Clinic & DAU duplicated in utility for speed |
| “What can I buy / request?” | Products | Institutional framing, not retail checkout (PRD §17) |
| “What’s new?” | News & Events | Separate templates for news, events, announcements |
| “Where are PDFs?” | Resources / Downloads | Document centre is a **mode** of discovery as well as a destination |

---

## 4. Utility navigation model

**Purpose:** One-click access to **high-frequency operational** and **document** destinations without opening the mega menu.

### 4.1 Composition (Brief §8.1)

| Item | Default target | Behaviour |
| --- | --- | --- |
| **Clinic** | `/services/clinic/` (or architecture-approved path) | Always visible on desktop/tablet utility bar |
| **Drug Analysis Unit** | `/services/drug-analysis-unit/` | Always visible |
| **Downloads** | `/resources/downloads/` (or `/downloads/` if IA flattens—align with architecture) | Opens document centre hub |
| **Publications** | `/research/publications/` | Distinct from “News”; emphasises scholarly repository |
| **Contact** | `/contact/` | May scroll to `#hours` on same page if architecture consolidates |
| **Search** | Opens search **overlay/panel** (preferred) or `/search/` | Keyboard shortcut optional (document in architecture); must not rely on server |

### 4.2 Placement and visibility

- **Desktop (lg+):** Full utility row **above** primary header; compact text links + icons only where they add recognition (avoid icon-only without labels).  
- **Tablet:** Collapse to **overflow menu** labelled “Quick links” **or** horizontal scroll with visible fade—**never** rely on hover-only.  
- **Mobile:** Utility items fold into **primary mobile menu** under a “Quick links” section **above** mega-sections (Section 6).

### 4.3 Interaction rules

- Utility links are **real `<a href>`** navigation for progressive enhancement.  
- Current page: **visible** state in utility (underline + `aria-current="page"`).  
- Search: focus moves to query field on open; **Escape** closes; focus trap only while open.

---

## 5. Main mega navigation model

**Purpose:** Expose **depth** (research institution) without overwhelming first-time visitors. Reference [UG](https://www.ug.edu.gh/) **only** for **information hierarchy** patterns (timely strips, deep sections)—not visual identity (Brief §22; Analysis §8).

### 5.1 Desktop (lg+) layout

- **Trigger:** Top-level items are **buttons** with `aria-expanded` controlling a **full-width mega panel** below the header.  
- **Panel structure:** 3–4 columns max; each column = **group title** (non-link) + links.  
- **Right rail (optional):** “Featured” institutional link (e.g., current annual report) **governed** by content flags—not hardcoded marketing.  
- **Keyboard:** `Tab` moves through triggers; `Enter`/`Space` opens; arrow keys **optional**; `Escape` closes panel and returns focus to trigger.

### 5.2 Column groupings (content map from Brief §8.2)

**About CPMR:** Overview, History, Mandate, Vision & Mission, Leadership, Board Members, Management Team, Organisational Structure, Awards & Recognition, Partners & Affiliations.

**Research:** Research Overview, Research Themes, Research Projects, Publications, Researcher Profiles, Research Facilities, Collaboration.

**Departments:** Department Index, Research Departments, Service Departments, Administrative Departments, Department Contacts.

**Services:** Clinic, Drug Analysis Unit, Animal Experimentation Unit, Nursery / Seedlings, Library, Industry Services, Service Fees, FAQs.

**Products:** Product Overview, Capsules, Decoctions, Ointments, Powders, Roots, Teas, Product Enquiries.

**News & Events:** Latest News, Announcements, Events Calendar, Media Gallery, Videos, Press Resources.

**Resources:** Downloads, Annual Reports, Forms, Brochures, Policies, FAQs, Publications Archive.

**Careers & Opportunities:** Jobs, Internships, Attachments, National Service, Procurement / Tenders.

**Contact:** General Contact, Department Contacts, Clinic Contact, DAU Contact, Location Map, Office Hours.

### 5.3 Progressive disclosure inside mega

- If a group exceeds ~7 links, provide **“View all in section”** link to the hub page rather than infinite lists.  
- **No duplicate visual systems:** mega links mirror footer clusters (Section 23) but mega prioritises **tasks**; footer prioritises **institutional completeness**.

---

## 6. Mobile navigation model

**Breakpoint behaviour:** See Section 25; navigation **behaviour** summary here.

### 6.1 Pattern

- **Hamburger** opens a **full-height drawer** with scroll.  
- **Order inside drawer:**  
  1. **Quick links** (utility set: Clinic, DAU, Downloads, Publications, Contact, Search)  
  2. **Primary IA** as **accordion** sections (one open at a time by default to reduce scroll fatigue)  
  3. **Secondary:** language toggle (Phase 3 only if mandated), accessibility statement link when available  

### 6.2 Accordion rules

- Section headers are **`<button>`** with `aria-expanded`.  
- Nested links are flat lists (no third-level flyouts on mobile).  
- **Deep links** (e.g., Board Members) remain reachable via parent section accordion + in-page hub on desktop.

### 6.3 Search on mobile

- Prominent **search row** at top of drawer **or** icon in header opening overlay—choose one pattern per `DESIGN.md`; either way: **44×44px** minimum touch target.

### 6.4 Sticky header

- After scroll threshold, **condense** header: logo + Menu + Search + optional “Clinic” text link (if user research shows demand); avoid hiding the only menu affordance.

---

## 7. Homepage section blueprint

Order and intent from Brief §11 and PRD §8. Each section is a **content-owned module** (YAML/MDX/frontmatter) feeding Astro layouts.

| # | Section | User job | Key UX elements |
| --- | --- | --- | --- |
| H1 | **Hero** | Understand institution in seconds | Headline + subhead (calm, formal); single optional primary link (“About CPMR” or “Our mandate”); background image with alt text |
| H2 | **Quick access** | Jump to top tasks | **Six** tiles/cards: Clinic, DAU, Departments, Publications, Products, Contact; each is real route |
| H3 | **Announcements strip** | See urgent/time-bound notices | High-contrast strip; max 1–2 concurrent; dismiss only if policy allows—default **non-dismissible** for critical governance |
| H4 | **Mandate snapshot** | Grasp legal/social role | 2–3 sentences + link to Mandate / About |
| H5 | **Research highlights** | See scientific momentum | 3–6 cards: projects or themes; link to Research |
| H6 | **Department preview** | Enter departmental “places” | Carousel **or** static grid; keyboard-operable if carousel |
| H7 | **Services preview** | Discover non-Clinic services | Subset with “View all services” |
| H8 | **Product categories** | Browse institutional products responsibly | Category tiles + disclaimer microcopy |
| H9 | **News & events** | See recency | Split row: latest news + next events (or tabs if space constrained) |
| H10 | **Publications / resources teaser** | Find evidence | Latest publications OR priority download (editorial choice) |
| H11 | **Partners & affiliations** | Assess credibility | Logo strip with accessible names (not logo-only tooltips) |
| H12 | **Deep footer** | Navigate institutionally when lost | Section 23 |

**Anti-patterns:** multiple competing “Apply now” / “Donate” / chat widgets; autoplay video hero; unreadable image-only text.

---

## 8. About section blueprint

**Goal:** Government and public audiences find **governance, history, and leadership** without marketing fluff (PRD §9).

### 8.1 Hub page: `/about/`

- **Intro block** + **side navigation** (desktop) listing all About subpages.  
- **Mobile:** skip-nav to content; subpages linked from accordion list at top **or** bottom “In this section”.

### 8.2 Subpage patterns

| Route (example) | Primary content | UX notes |
| --- | --- | --- |
| Overview | Narrative + timeline teaser | Link to History |
| History | Long-form + milestone timeline | Timeline keyboard-focusable |
| Mandate | Legal/institutional framing | Pull quote styling **only** if `DESIGN.md` allows |
| Vision & Mission | Short paired statements | Side-by-side on desktop; stacked on mobile |
| Leadership | Cards → profile detail | Photos with alt; **no** placeholder names at launch |
| Board / Management | Tables or definition lists | Accessible tables (Section 24) |
| Organisational structure | Diagram + accessible text alternative | Provide **linearised** outline for screen readers |
| Awards | List/grid | Date + awarding body |
| Partners & Affiliations | Logo grid + narrative | Outbound link policy text where needed |

### 8.3 Cross-links

- Mandate → Research overview.  
- Leadership → News (official statements).  
- Partners → Collaboration (Research).

---

## 9. Research section blueprint

**Goal:** Support **Research discovery journey** (Brief §7.3): Research → Departments → Projects / Publications / Staff.

### 9.1 Hub: `/research/`

- **Research overview** narrative.  
- **Themes** as tag-like entry points (filters projects/publications when data exists).  
- **Facilities** teaser.  
- **Calls to action:** “Explore departments”, “Browse publications”, “Meet researchers” (max three).

### 9.2 Child areas

| Area | Purpose | UX pattern |
| --- | --- | --- |
| Themes | Thematic entry | Grid of theme cards with exemplar projects |
| Projects | Deep science stories | Filterable listing (client-side index per PRD §12 P2) |
| Publications | Scholarly discovery | Listing + filters; link to department context |
| Researcher profiles | People discovery | Directory + profile |
| Facilities | Infrastructure credibility | Photo + specs + safety/public notes |
| Collaboration | Partner pathway | Clear contact + partnership process |

### 9.3 Breadcrumbs

Always: `Home > Research > …` and when navigated from department mini-site, show **department context** in related rails, not duplicated breadcrumb trees.

---

## 10. Department mini-site UX model

**Definition:** A **route subtree** with **local context**: department name, mandate, and **local subnav** persistent across mini-site pages (Brief §9; PRD §10).

### 10.1 Entry points

- Homepage preview, Research hub, Departments index, search results, publication/staff “related department” links.

### 10.2 Local navigation (department chrome)

Horizontal **tab-like** subnav under department title (desktop); **submenu accordion** inside mobile drawer **scoped** to department when user arrived via department URL (advanced pattern—MVP may use repeated “In this department” block on each page instead).

**Minimum destinations (when content exists):** Home, Mandate/Overview, Staff, Projects, Publications, Services, News, Downloads, Contact (Brief §9.2).

### 10.3 Relationship surfacing

Each listing page shows **empty state** when no linked items (Section 26)—do not hide section headings without editorial decision.

### 10.4 Rollout honesty

Department list is **candidate** until verified (Brief §9.5). UX: **Department index** may show “Coming soon” only if PRD/stakeholders approve; default preference is **omit** unverified departments from public nav.

---

## 11. Department landing layout

**Route:** `/departments/[slug]/`

### 11.1 Above the fold

- H1: Department name  
- Lede: 1–2 sentences (who they are / what they do)  
- **Head of department** card (photo, name, title, “Message” optional)  
- **Primary actions:** Contact, Downloads (if any), “Our staff”, “Our projects”

### 11.2 Body modules (scroll)

1. **Mandate & functions** (split columns desktop / stacked mobile)  
2. **Research / operational focus** (bullet list + narrative)  
3. **Featured projects** (2–3 cards + “All projects”)  
4. **Featured publications** (3–5 rows + “Repository”)  
5. **Services offered** (internal department services)  
6. **News** (latest 3)  
7. **Facilities / labs** (optional gallery strip)

### 11.3 Sidebar / rail (lg+)

- Quick facts: location, email, phone, office hours **if** distinct from global  
- **Related** downloads  
- Jump links (anchor menu) for long departments

---

## 12. Department staff layout

**Route:** `/departments/[slug]/staff/`

- **Filters:** role (PI, technologist, admin), name A–Z (client-side).  
- **Card:** photo, name, title, expertise tags, “Profile” link.  
- **Profile detail:** biography, expertise, related projects & publications, contact pattern **approved by institution** (no personal phones without policy).  
- **Print-friendly** optional Phase 2.

---

## 13. Department publications layout

**Route:** `/departments/[slug]/publications/`

- Inherits global publication **list item** pattern (title, authors, year, excerpt, DOI link).  
- **Default filter:** department = current slug (pre-selected).  
- **Empty state:** explain that publications are being curated; link to institution-wide repository.

---

## 14. Department news layout

**Route:** `/departments/[slug]/news/`

- Uses **news card** pattern filtered to department.  
- **Pinned** item optional for chair statements.  
- Clear **date** and **category**.  
- RSS link optional (PRD §18 N2).

---

## 15. Services UX model

**Goal:** Operational clarity and **template consistency** (Brief §12.3; PRD §14 SV1).

### 15.1 Services hub: `/services/`

- Intro + **grouped links**: Clinical services, Analytical services, Support services, Industry services.  
- **Promoted tiles:** Clinic, DAU always first.  
- **Service Fees** hub: explain that fees are authoritative only when dated; link to PDF downloads if used.

### 15.2 Service detail template blocks

1. Overview  
2. Who it serves / eligibility  
3. Requirements & preparation  
4. Procedure (step list)  
5. Fees (accessible table)  
6. Hours / turnaround  
7. FAQs (accordion)  
8. Downloads/forms  
9. Contact + location  
10. **Related departments** (chips)

### 15.3 Fee tables (cross-cutting)

- Never image-only scans.  
- Mobile: **stacked** row cards or horizontal scroll **with** visible scroll affordance + first column sticky—pick one in `DESIGN.md`.  
- Show **“Last updated”** from content metadata (PRD §7 C5).

---

## 16. Clinic page UX model

**Route:** `/services/clinic/` (final slug per architecture)

### 16.1 Above the fold

- H1 + reassurance line (“Public outpatient services …”)  
- **Hours today** highlight (if data supports single source of truth)  
- **Buttons:** Call, Email, Directions (tel/mailto/maps links)

### 16.2 Page sections (Brief §12.1; PRD §15)

| Block | UX intent |
| --- | --- |
| Who we serve | Plain language eligibility |
| Consultation flow | Numbered journey from arrival → consultation → payment |
| Fee tables | Consultation + lab bundles; footnotes for edge cases |
| Laboratory services | What tests exist (non-diagnostic disclaimers as required) |
| Insurance | Conditional section—hidden if not verified |
| Visit instructions | Parking, gate, ID requirements |
| FAQs | Top 10 manufacturer/patient questions |
| Downloads | Consent forms, brochures |
| Location | Embedded map only if privacy-approved; always offer textual address |

### 16.3 Utility and home parity

- Clinic must appear in **utility nav** and **home quick access** (Brief §8.1, §11).

---

## 17. Drug Analysis Unit UX model

**Route:** `/services/drug-analysis-unit/`

### 17.1 Manufacturer-oriented flow

- **Stepper:** Submit → Pay → Deliver sample → Receive report (labels adjusted to CPMR process).  
- **Side-by-side:** types of analysis vs typical turnaround.  
- **Sample requirements:** icon + text list + “Download packing guidelines”.

### 17.2 Risk reduction content

- **“Common rejection reasons”** callout (DAU3).  
- **Regulatory context** paragraph only if legally verified (PRD §16 DAU1).

### 17.3 Forms

- Prominent **primary download** for submission form; secondary links grouped.

---

## 18. Products UX model

**Principle:** Institutional **responsible use** framing; no checkout (PRD §17 PR3).

### 18.1 Hub: `/products/`

- Category grid (7 categories).  
- **Disclaimer band** below hero: not medical advice; use under guidance; availability varies.

### 18.2 Category page

- Category description + **responsible use** note.  
- Product cards: image, name, short description, “Enquire” (mailto/form/deep link per architecture).  
- No **fake** “Add to cart”.

### 18.3 Product detail

- Image gallery with keyboard support; ingredients/highlights as **definition list**; **enquiry CTA**; related downloads (e.g., product leaflet).

---

## 19. News/events discovery model

**Separation is mandatory** (Brief §15; PRD §§18–20).

### 19.1 News

- **Listing:** `/news/` — filter by category, year; cards show date prominently (avoid typographic errors—editorial QA).  
- **Detail:** title, date, category, featured image, body, related department/project.

### 19.2 Announcements

- **Distinct visual pattern:** alert styling, shorter body, date range visible.  
- **Archive:** `/announcements/` (or combined hub with tabs **News | Announcements** if IA prefers—document choice in architecture).

### 19.3 Events

- **Hub:** `/events/` — upcoming default tab; past events secondary.  
- **Calendar vs list:** MVP accepts **list-first** calendar (PRD §20 E2); month grid optional Phase 2.  
- **Event detail:** datetime in local timezone statement, venue map link, registration outbound with icon marking external link.

### 19.4 Editorial conflict rules

- Homepage: **Announcement strip** takes precedence over **non-critical** hero promo.  
- Max **one** hero banner + **one** announcement strip + quick access (PRD §19 AN3).

### 19.5 Nav gating for empty content

- If no upcoming events: either **hide** Events from primary nav until ready **or** show Events hub with **honest empty state**—pick per stakeholder preference (PRD §30); UX default: **hide top-level Events** if zero upcoming **and** no past archive **and** no editorial approval to show placeholder hub.

---

## 20. Media gallery model

**Goals:** Credibility and storytelling without performance collapse (Brief §15.4; PRD §21).

### 20.1 Album index

- `/media-gallery/` — grid of albums with cover image, title, image count, date.

### 20.2 Album detail

- **Masonry optional**—prefer **CSS grid** for predictability.  
- Lightbox: keyboard (`←` `→` `Esc`), focus trap, visible close button.  
- **Captions** visible (not hover-only).  
- Videos: consent banner if embed loads third-party cookies—architecture decision.

### 20.3 Relationships

- Filter chips: related department, related event.

---

## 21. Static search flow and no-results state

**Constraints:** No SSR/DB; index strategy per architecture ADR (PRD §23 SR2).

### 21.1 Entry

- Utility **Search** opens overlay or navigates to `/search/`.  
- **Live suggestions optional** if client bundle allows; otherwise submit-to-results.

### 21.2 Results page layout

- Query echoed as H1 visually hidden for SR? Use visible “Results for …” heading.  
- **Grouped results** by content type (Pages, Departments, Staff, Services, Publications, Projects, Downloads, Products, News, Events).  
- **Type filter chips** toggle visibility of groups.  
- **Snippet:** title + 1-line excerpt + breadcrumb path.

### 21.3 No-results UX

- Message: “No matches for **{query}**.”  
- Suggestions: check spelling; try generic terms; browse **Clinic**, **DAU**, **Departments** quick links.  
- **Do not** show “Try these products” unrelated promos.

### 21.4 Coverage honesty

- If MVP ships reduced index, architecture must expose **which types** are included—UX shows **consistent** results; avoid silent omission (PRD §23 SR4). Recommended: **type filter only lists types present in index build**.

---

## 22. Downloads/document centre flow

**Hub:** `/resources/downloads/` (or `/downloads/`—match architecture).

### 22.1 Discovery

- **Category** tiles (Annual reports, Forms, Brochures, Policies, Service documents, etc.).  
- **Faceted filters:** category, year, owning unit, file type (Brief §16; PRD §22 DL3).

### 22.2 List items

- Title, short description, file type, size, date, owning unit, **download** action (direct `.pdf` link with size warning if large).

### 22.3 Detail page (optional)

- For complex documents: version history, changelog per PRD §22 DL4.

### 22.4 Integrity UX

- If file missing in build, **build should fail** (preferred) or show unavailable state—never 404 silently in nav.

---

## 23. Footer information architecture

**Deep footer** (Brief §11.12; PRD §24).

### 23.1 Column model (example—adjust to content)

| Column | Contents |
| --- | --- |
| **About** | Overview, Mandate, Leadership, Partners |
| **Services** | Clinic, DAU, Service Fees, FAQs |
| **Research** | Projects, Publications, Facilities |
| **Resources** | Downloads, Annual Reports, Policies |
| **News & media** | News, Events, Gallery, Press |
| **Careers** | Jobs, Internships, National Service |
| **Contact** | Address, phone, email, map, hours |

### 23.2 Meta row

- © year, legal links (privacy/terms when available), **Accessibility** statement link, **Sitemap**.  
- Social icons **only** if official accounts exist—otherwise omit row.

### 23.3 Consistency rule

- Footer mirrors mega clusters but **never** introduces links absent from IA approval.

---

## 24. Accessibility behavior

Baseline: Brief §18; PRD §25; constitution §7.

| Area | Required behaviour |
| --- | --- |
| **Structure** | `header`, `nav`, `main`, `footer`; one `h1` per view; logical heading steps |
| **Skip link** | “Skip to main content” first focusable |
| **Keyboard** | All menus, carousels, tabs, accordions operable without pointer |
| **Focus** | `:focus-visible` clearly visible; no `outline: none` without replacement |
| **Forms** | Labels, instructions, `aria-describedby` for errors; error summary at top on submit |
| **Images** | Meaningful `alt`; decorative `alt=""` |
| **Colour** | Text/background pairs meet chosen contrast target once `DESIGN.md` sets tokens |
| **Motion** | `prefers-reduced-motion` reduces carousel auto-advance and parallax |
| **Tables** | `<th scope>`; responsive patterns per Section 15.3 / 25 |
| **Touch** | Minimum **44×44px** interactive targets on mobile nav |

**WCAG level:** treat **2.1 AA** as **design target** unless stakeholders formally choose looser “basics”; formal audit Phase 2 (PRD §31).

---

## 25. Responsive behavior by breakpoint

Assume Tailwind-like breakpoints for communication with devs (`DESIGN.md` will codify exact numbers).

| Breakpoint | Approx width | Navigation | Layout |
| --- | --- | --- | --- |
| **Default (xs)** | <640px | Hamburger drawer; stacked sections | Single column; tables become cards |
| **sm** | ≥640px | Same as xs unless usability test warrants utility peek | Optional 2-col for cards |
| **md** | ≥768px | Consider **compact utility** row if horizontal space | 2-col content + optional sidebar for hubs |
| **lg** | ≥1024px | Full utility row + mega menu | Hub pages: sidebar nav; department rails |
| **xl** | ≥1280px | Mega columns widen; max content width **capped** for readability (~70–75ch) |
| **2xl** | ≥1536px | Additional whitespace; **no** ultra-wide text lines |

**Images:** `srcset` + Astro image pipeline; art direction for hero if needed.

---

## 26. Empty states

| Context | UX copy direction | Actions |
| --- | --- | --- |
| Department publications/projects empty | “We are updating this section.” | Link to institutional Publications / Research |
| Events none upcoming | Prefer **hide** nav OR show hub empty state | Subscribe / contact comms **only** if real endpoints exist |
| Search no results | Section 21.3 | Quick links |
| Gallery empty | Omit album or hide Gallery nav | — |
| Staff profile photo missing | Show initials placeholder **with** `aria-label` | Do not use random stock |

**Editorial:** empty states should carry **last reviewed** or “contact web team” only if process exists—avoid orphan emails.

---

## 27. Error states

| Scenario | UX treatment |
| --- | --- |
| **404** | Clear heading, search field, links to Clinic/DAU/Contact, sitemap link |
| **500 (host/CDN)** | Static branded page if host supports; otherwise generic with retry guidance |
| **Form submission failure** | Inline error + preserve user input; provide alternative contact (phone) |
| **Broken download** | Inline message “This file is temporarily unavailable” + report link if defined |
| **External map/embed blocked** | Fallback text address + “Open in Google Maps” link |

---

## 28. Component inventory

Components align to Brief §17.2 and PRD templates. **Naming** is indicative for architecture/stories.

**Global:** `SiteHeader`, `UtilityNav`, `MainNavMega`, `MobileNavDrawer`, `SearchPanel`, `Breadcrumbs`, `SkipToContent`, `FooterMultiColumn`, `FooterMeta`, `AnnouncementStrip`, `CookieConsent` (if legal requires).

**Home:** `HeroInstitutional`, `QuickAccessGrid`, `MandateSnapshot`, `HighlightCarousel`, `DepartmentPreview`, `ServicePreview`, `ProductCategoryGrid`, `NewsEventsSplit`, `PartnerLogoRow`.

**Content:** `PageHero`, `ProseBlock`, `SidebarNav`, `DefinitionList`, `AccordionFAQ`, `FeeTableResponsive`, `Stepper`, `Timeline`, `StaffCard`, `StaffDirectoryFilters`, `ProjectCard`, `PublicationListItem`, `NewsCard`, `EventCard`, `AnnouncementBanner`, `DownloadListItem`, `TagChip`, `RelatedLinksRail`, `EmptyState`, `ErrorSummary`, `ExternalLinkIcon`.

**Media:** `ImageGallery`, `LightboxDialog`, `VideoEmbed` (lazy).

**Forms:** `FieldText`, `FieldTextarea`, `FieldSelect`, `FieldFile` (if used), `FormLayout`.

---

## 29. Page template list

Templates map to routes under `src/pages/` (exact paths in architecture).

| Template ID | Description |
| --- | --- |
| `T_HOME` | Homepage (Section 7) |
| `T_GENERIC_CONTENT` | Standard institutional page with optional sidebar |
| `T_ABOUT_HUB` | About landing |
| `T_RESEARCH_HUB` | Research landing |
| `T_DEPARTMENTS_INDEX` | All departments |
| `T_DEPARTMENT_HOME` | Department landing (Section 11) |
| `T_DEPARTMENT_STAFF_LIST` | Staff directory |
| `T_DEPARTMENT_STAFF_PROFILE` | Individual profile |
| `T_DEPARTMENT_PROJECTS_LIST` / `T_PROJECT_DETAIL` | Projects |
| `T_DEPARTMENT_PUBLICATIONS_LIST` | Scoped publications |
| `T_DEPARTMENT_NEWS_LIST` | Scoped news |
| `T_DEPARTMENT_SERVICES_LIST` | Scoped services |
| `T_DEPARTMENT_CONTACT` | Optional dedicated contact |
| `T_SERVICES_HUB` | Services index |
| `T_SERVICE_DETAIL` | Clinic, DAU, and generic service |
| `T_PRODUCTS_HUB` | Product categories |
| `T_PRODUCT_CATEGORY` | Category listing |
| `T_PRODUCT_DETAIL` | Product detail |
| `T_NEWS_LIST` / `T_NEWS_DETAIL` | News |
| `T_ANNOUNCEMENTS_LIST` / `T_ANNOUNCEMENT_DETAIL` | Announcements |
| `T_EVENTS_LIST` / `T_EVENT_DETAIL` | Events |
| `T_MEDIA_GALLERY_INDEX` / `T_MEDIA_ALBUM` | Gallery |
| `T_RESOURCES_HUB` | Resources landing |
| `T_DOWNLOADS_HUB` | Document centre |
| `T_CAREERS_HUB` + job-like detail templates | Careers |
| `T_CONTACT` | Contact |
| `T_SEARCH_RESULTS` | Search |
| `T_404` / `T_ERROR` | Errors |

---

## 30. Handoff requirements for DESIGN.md and story-level validation

### 30.1 `DESIGN.md` (UI contract) — must specify after UX sign-off

Per `docs/03_architecture/06_project_context.md` §7:

- **Brand tokens:** primary/secondary/neutral palettes, semantic colours (success, warning, danger), **focus ring** colour.  
- **Typography:** font stacks, scale (step sizes), line heights, max measure.  
- **Spacing & radii:** grid base, card padding, section vertical rhythm.  
- **Elevation & borders:** when cards lift vs outline-only (calm institutional default likely outline).  
- **Components:** variants for `Button`, `Link`, `Card`, `Accordion`, `Table`, `Tabs`, `Tag`, `Stepper`, `AnnouncementStrip`, `QuickAccessTile`.  
- **Imagery rules:** aspect ratios, treatment of photography, **no** stock clichés.  
- **Motion:** durations/easings; reduced-motion alternate.  
- **Logo usage:** clear space, minimum sizes, mono treatments if any.

Until `DESIGN.md` replaces the placeholder, implementation stays **neutral scaffolding** aligned to this blueprint and PRD—no final marketing polish.

### 30.2 Story-level validation (acceptance hooks)

Each implementation story touching UI should reference:

- **Journey acceptance:** PRD §33 rows relevant to the page (e.g., Clinic one-click from home).  
- **Breakpoint acceptance:** Section 25 behaviours for changed templates.  
- **Accessibility acceptance:** Section 24 checklist subset (keyboard path, heading order, table mobile).  
- **Content governance:** no “final” institutional strings in components without `src/content` / `src/data` (constitution §6).  
- **Search/forms:** behaviours in Sections 21–22 once architecture selects vendors/patterns.

### 30.3 Traceability matrix (recommended)

| UX blueprint section | PRD sections | Architecture follow-ups |
| --- | --- | --- |
| 4–6 Nav models | §5 F1, §8 | Routing, mega menu component API, mobile drawer state |
| 7 Homepage | §8 | Content collections + homepage module schema |
| 10–14 Departments | §10 | Slug policy, relationship IDs, build-time joins |
| 16–17 Clinic/DAU | §§15–16 | Forms handling ADR, fee table schema |
| 21 Search | §23 | Index generation, chunking, language stemming |
| 22 Downloads | §22 | Asset pipeline, metadata fields, 404 guardrails |

---

*End of UX blueprint.*
