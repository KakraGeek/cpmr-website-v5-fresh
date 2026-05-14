# CPMR Content Architecture, CMS Strategy & Editorial Operating Model

**Project:** `cpmr-website-v5-fresh` — Centre for Plant Medicine Research (CPMR) institutional website  
**Document type:** Solution architecture — **content & CMS authority** (`3-solutioning`)  
**Status:** Authoritative (replaces prior stub). **Blocking deficiency resolved** when merged to the agreed mainline.  
**Version:** `1.0.0`  
**Date:** 2026-05-14  

**Authoritative inputs (read order for agents):**  
`docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`,  
`docs/01_planning/01_analysis.md`,  
`docs/01_planning/02_prd.md`,  
`docs/02_design/03_ux_blueprint.md`,  
`docs/02_design/DESIGN.md`,  
`docs/03_architecture/04_architecture.md`,  
`docs/03_architecture/06_project_context.md`,  
`docs/04_stories/05_story_map.md`,  
`src/content.config.ts`, `src/content/**`, `src/data/**`, `src/pages/**`, `astro.config.mjs`, `package.json`  

**Locked stack & delivery:** Astro + TypeScript + Tailwind CSS v4; `output: 'static'`; build emits **`dist/`**; **no Node.js, database, or runtime CMS** on the public host for MVP (`06_project_context.md`, `02_prd.md` §29, `04_architecture.md` ADR-001–003).  

**Conflict resolution:** If this document conflicts with `06_project_context.md` on static delivery, **the constitution wins** and this file must be amended. Visual/token conflicts defer to **`DESIGN.md`** for presentation; this document owns **content shape, relationships, governance, and build-time data contracts**.  

**Multi-role synthesis (BMAD correct-course):** This artifact integrates Analyst (evidence & gaps), PM (requirements traceability), UX (IA/templates), Architect (static feasibility, routing, loaders), Technical Writer (terminology & procedural clarity), QA/Test Architect (risks, validation, SR4), Developer (Astro 6 + `src/content.config.ts` feasibility), and DESIGN reviewer (token-bound UI data only — no raw styling here). **Architect interpretation is final** for technical contracts below.

---

## 1. Executive Summary

### 1.1 Why this artifact exists

CPMR is a **national research institution**, not a marketing microsite. The public product is a **static-first institutional portal** that must simultaneously support: deep department mini-sites, research credibility (projects, publications, people), regulated service delivery (Clinic, Drug Analysis Unit), responsible product communication, and durable governance (verified facts, review cadence, discoverability). That complexity **cannot** be safely implemented from scattered component strings or ad-hoc Markdown without a **single, explicit content architecture**.

This file is the **authoritative bridge** between stakeholder intent (`CPMR_Institutional_Website_Redesign_Brief.md`, `02_prd.md`), UX IA (`03_ux_blueprint.md`), technical architecture (`04_architecture.md`), and implementation (`src/content.config.ts`, routes under `src/pages/`).

### 1.2 Why it became critical (blocking deficiency)

Downstream BMAD agents and stories already reference **`05_content_architecture_and_cms_strategy.md`**. While `04_architecture.md` §5 sketches collections, **schemas, relationships, slug policy, search contracts, editorial lifecycle, and per-type routing** were not formally frozen. Implementation proceeded with **`home`** and **`_bootstrap`** collections only (`src/content.config.ts`), plus navigation seeds (`src/data/navigation.ts`). Without this document, teams risk:

- incompatible `departmentId` schemes across epics,
- non-indexable or silently omitted search coverage (PRD §23 **SR4**),
- hardcoded department pages (explicitly forbidden by program directive),
- metadata and relationship drift between Clinic/DAU truth and UI.

### 1.3 Why content architecture is foundational to CPMR

Institutional trust is a function of **consistency, traceability, and operational clarity**. Content architecture defines:

- **what** may be published (typed entities),
- **who** owns truth (editorial domains),
- **how** entities relate (foreign keys at build time),
- **where** users find them (routes + IA),
- **how** change is safe (review cadence + validation gates).

### 1.4 Relationship to Astro static architecture

All public HTML is generated at **`astro build`**. “CMS” in MVP means **governed files** in `src/content/` and aggregates in `src/data/` consumed by:

- `defineCollection` + **Zod** schemas in `src/content.config.ts` (Astro 6 top-level convention),
- **`getCollection` / `getEntry` / `getStaticPaths`** in pages,
- optional **build scripts** that emit JSON indexes into `dist/` or `src/data/generated/` (gitignored) before/after build per story.

**No per-request joins:** relationships resolve by **filtering collections in page modules** using stable string IDs.

### 1.5 Relationship to BMAD workflows

This artifact is a **3-solutioning gate input**: stories must cite the relevant **§4 content type** and **§16 mapping** when touching schemas or routes. Architect-gated changes (new collection, breaking schema, search swap, department subtree contract) follow `05_story_map.md` §5.

### 1.6 Relationship to future CMS extensibility

Every collection is defined as a **portable content model** (logical type, stable IDs, slug rules, SEO envelope, relationship keys). MVP storage is **Git-tracked files**. Phase 2+ may add **Decap CMS** or a **headless CMS → build** exporter that **materialises the same logical models** into `src/content/` or a build-time fetch — still emitting **static `dist/`** unless governance amends the constitution.

---

## 2. Content Architecture Philosophy

### 2.1 Institutional-content-first architecture

**Principle:** Pages exist to discharge **institutional duties** (mandate, services, research transparency), not to optimise vanity engagement. Content models prioritise **clarity, auditability, and cross-linking** over novelty widgets.

**Implication:** “Marketing modules” (e.g. homepage hero) are still **governed editorial objects** with restricted CTA cardinality (see `DESIGN.md` hero rules; `home` collection).

### 2.2 Structured content principles

1. **Typed entities** over freeform HTML for repeating institutional patterns (staff, publication, service fee row).  
2. **Frontmatter is the contract**; body Markdown/MDX is narrative supplement, not a second database.  
3. **Explicit empties:** if data is missing, templates show **honest empty states** (`02_prd.md`, UX blueprint) — no lorem or placeholder leadership.

### 2.3 Reusable content principles

- **Compose, don’t duplicate:** fees, hours, disclaimers, and contact blocks should be referenced via **`settings` snippets** or service entry fields — not copy-pasted across Clinic/DAU/department pages.  
- **Single navigation graph:** `src/data/navigation.ts` remains the **mechanical nav emitter**; optional future **`nav` collection** must compile *into* the same typed export to avoid drift (see §15).

### 2.4 Content normalization strategy

| Dimension | Normalization rule |
| --- | --- |
| Identifiers | `departmentId`, `staffId`, `serviceId`, `projectId`, `publicationId`, `downloadId`, `productId`, `newsId`, `eventId`, `announcementId`, `mediaAlbumId` — all **`kebab-case` ASCII** matching filename stem unless noted |
| Dates | ISO-8601 `YYYY-MM-DD`; datetimes `YYYY-MM-DDTHH:mm:ss±HH:mm` |
| Phone/email | E.164 recommended for phone; lowercase email |
| Money | **Numeric minor units optional**; display strings in content tables must still pass accessibility review |
| Slugs | **unique per type**; see §12 |

### 2.5 Relationship-driven publishing

Relationships are **directed edges** stored as scalar IDs or arrays of IDs in frontmatter, resolved at build:

- `publication.authors: string[]` → `staff.id`  
- `publication.departments: string[]` → `departments.id`  
- `department.head_of_department_staff_id?: string` → `staff.id`  

**Rule:** no runtime graph DB; broken references **fail build** (§19) or **warn + omit link** only where explicitly allowed (development mode — production must fail closed for financial/legal surfaces).

### 2.6 Static-first content generation philosophy

**Generate everything expensive once:** listings, sitemaps, search indexes, aggregated JSON. Client-side behaviour **filters precomputed sets** (year facets, department tabs) rather than implying server queries.

### 2.7 Editorial governance philosophy

MVP “CMS” = **Git + documented roles + PR review + scheduled release** (`02_prd.md` §29). Governance is not optional tooling; it is **process + metadata** (`editorial_status`, `last_reviewed`, `content_owner_role`) enforced in schemas and CI/build checks where feasible.

---

## 3. CPMR Content Ecosystem Map

Each **domain** below maps to one or more **collections** (§4). Domains are user-mental-model groupings; collections are implementation units.

| Domain | Primary collection(s) | Notes |
| --- | --- | --- |
| **Pages** | `pages`, `settings` | Long-form institutional MD/MDX + singletons |
| **Departments** | `departments` | One entry per real department; drives mini-site |
| **Department sub-pages** | `department_sections` *(optional)* or embedded `sections[]` in `departments` | Prefer single `departments` doc with structured sections until scale forces split |
| **Research projects** | `projects` | Cross-links staff, departments, publications |
| **Publications** | `publications` | DOI URLs, PDF gating |
| **Researchers/staff** | `staff` | Leadership + researchers + admins as data allows |
| **Services** | `services` | Clinic & DAU are `service_type` values |
| **Products** | `products`, `product_categories` | Categories may be collection or enum — **§8** |
| **News** | `news` | Distinct from announcements |
| **Events** | `events` | Static-friendly calendars |
| **Media gallery** | `media_albums`, `media_assets` | Album + items pattern |
| **Downloads** | `downloads` | Canonical document centre rows |
| **Reports** | `downloads` (`doc_kind: report`) | Subtyped |
| **FAQs** | `faqs` or embedded `faqs[]` on `services` | Start embedded; extract when reused |
| **Announcements** | `announcements` | Time-bound, priority |
| **Policies** | `downloads` (`doc_kind: policy`) **or** `pages` | Prefer `downloads` when PDF-first |
| **Contact information** | `settings` + optional `contacts` | `settings` for site-wide; `contacts` for rows if complex |
| **Homepage modules** | `home` (+ query-driven slices) | `home` controls hero; other modules query collections |
| **Footer content** | `settings` + `src/data/footer.ts` | Until automated export, **data module compiles from approved graph** |
| **Partner/affiliation entities** | `partners` or `pages` stub | Prefer `partners` collection for structured logos/links |

**Taxonomy hubs (non-department):** `src/pages/departments/research/index.astro` etc. (as in `navigation.ts`) are **filter listings** driven by `departments.category` — **not** separate hardcoded department pages.

---

## 4. Complete Content Collection Architecture

**Global conventions (all types):**

- **Loader:** `glob({ base: './src/content/<folder>', pattern: '**/*.{md,mdx}' })` unless `json`/`yaml` loaders are introduced by story.  
- **SEO envelope (required on all public entries):** `seo_title: string`, `seo_description: string`, optional `seo_canonical_path?: string`, `og_image?: string` (path under `src/assets` or `public`).  
- **Editorial envelope (required on all authored types):** `content_owner_role: enum`, `editorial_status: enum('draft'|'in_review'|'approved'|'archived')`, `last_reviewed?: string` (ISO date), `last_updated?: string` (ISO date). **Production build MUST reject `draft`/`in_review`** except explicit preview pipeline (out of MVP host).  
- **Search (`index_behavior`):** `full` \| `metadata_only` \| `exclude` (must be justified in frontmatter `search_note` reviewed by QA).  
- **Relationships:** only `string` / `string[]` IDs referencing other collections.  
- **Image/media:** raster references use Astro asset paths **or** governed `public/` URLs; every non-decorative image requires `alt`.  

**Production build policy:** `npm run validate` → `astro build`. Schema violations **fail the build**. Relationship broken references: **fail** for financial/legal (`services`, `downloads` with `legal_sensitive: true`); **warn fail** for scholarly links — see §19.

### 4.1 `settings` (singletons)

| Attribute | Value |
| --- | --- |
| **Collection name** | `settings` |
| **Slug strategy** | Fixed filenames → entry ids: `site`, `footer`, `contact`, `seo_defaults` |
| **Location** | `src/content/settings/{site,footer,contact,seo_defaults}.md` (or `.yaml` if adopted) |
| **Routing** | Not directly routed; imported via `getEntry('settings','site')` inside layouts |
| **Ownership** | Super Admin + Content Administrator |
| **Lifecycle** | Slow cadence; changes require paired QA on nav/footer |

**Schema (Zod-shaped; implement in `src/content.config.ts`):**

```ts
// Pseudocode — implement literally in project Zod
z.object({
  site_name: z.string(),
  site_tagline: z.string().optional(),
  default_locale: z.literal('en').default('en'),
  organisation_legal_name: z.string(),
  // Contact blocks may duplicate footer for now but must converge in one generation story
  primary_phone: z.string().optional(),
  primary_email: z.string().email().optional(),
  postal_address_lines: z.array(z.string()).min(1),
  // Social links optional; mirror footer policy
  social_links: z.array(z.object({
    platform: z.string(),
    href: z.string().url(),
    label: z.string(),
  })).default([]),
  // SEO defaults
  seo_title_suffix: z.string().default('| CPMR'),
  seo_default_description: z.string(),
  // envelopes...
  editorial_status: z.enum(['draft','in_review','approved','archived']),
  content_owner_role: z.enum(['super_admin','content_admin']),
});
```

**Search:** `site`/`seo_defaults` → `metadata_only`; others `exclude`.

---

### 4.2 `pages` (generic institutional)

| Attribute | Value |
| --- | --- |
| **Collection name** | `pages` |
| **Slug strategy** | File path after `src/content/pages/` maps to **logical id**: `about/history` → id `about/history` (Astro id = relative path without ext) |
| **Location** | `src/content/pages/**/*.md` |
| **Routing** | Mirrors `src/pages/about/**/*.astro` templates — **template owns URL**; content id must match story mapping table |
| **Ownership** | Content Administrator + departmental reviewers for domain pages |

**Required fields:** `title`, `seo_title`, `seo_description`, `editorial_status`, `content_owner_role`, `template: z.enum(['generic','timeline','grid'])`  
**Optional:** `summary`, `hero_image`, `related_download_ids`, `related_department_ids`  
**Validation:** no `draft` in production; internal links start with `/` and match `navigation.ts` graph when `routeLive` enforcement is enabled.  
**Search:** `full` (body + title).  
**DESIGN:** must use `T_GENERIC_CONTENT` composition; no token values here.

---

### 4.3 `departments`

| Attribute | Value |
| --- | --- |
| **Collection name** | `departments` |
| **Slug strategy** | **Filename = public slug** `src/content/departments/{departmentId}.md` where `departmentId` is `kebab-case` and equals route `[slug]` |
| **Routing** | `/departments/[departmentId]/` |
| **Ownership** | Department Editor for that `departmentId`; Content Administrator gate for creation |

**Required fields:**

```ts
z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), // must equal basename
  name: z.string(),
  category: z.enum(['research','service','administrative']),
  mandate_summary: z.string(),
  hero: z.object({
    headline: z.string(),
    lede: z.string().optional(),
    image: z.object({ src: z.string(), alt: z.string(), width: z.number(), height: z.number() }).optional(),
  }),
  head_of_department_staff_id: z.string().optional(),
  // Local mini-site nav order
  mini_site_nav: z.array(z.object({
    label: z.string(),
    href: z.string(), // must start with `/departments/${id}/`
  })).default([]),
  related_service_ids: z.array(z.string()).default([]),
  // envelopes...
});
```

**Optional:** `functions_markdown`, `facilities_markdown`, `contact_markdown`, `expertise_tags: string[]`  
**Relationships:** → `staff`, `services`, `projects` (via reciprocal ids), `publications`, `news`, `downloads`, `media_albums`  
**Search:** `full`.  
**Lifecycle:** `archived` keeps URL but shows banner + suppresses from listings (template concern).

---

### 4.4 `staff`

| Attribute | Value |
| --- | --- |
| **Collection name** | `staff` |
| **Slug strategy** | `src/content/staff/{staffId}.md` |
| **Public URLs** | Global: `/research/staff/[staffId]/` (PRD IA); **also** surfaced under department routes via filters |
| **Ownership** | Department Editor + HR/Comms approval for bios |

**Required:** `id`, `full_name`, `role_title`, `department_ids: string[]`, `seo_*`, editorial envelope  
**Optional:** `photo`, `expertise_tags`, `orcid`, `email_public: z.boolean().default(false)`, `email?: string`  
**Validation:** if `email_public` false → strip email from rendered output even if present in file (QA test).  
**Relationships:** ↔ `departments`, `projects`, `publications`  
**Search:** `full` for approved bios; `metadata_only` for leadership-only stubs if bios withheld.

---

### 4.5 `projects`

| Attribute | Value |
| --- | --- |
| **Collection name** | `projects` |
| **Slug** | `src/content/projects/{projectId}.md` |
| **Routing** | `/research/projects/[projectId]/` **and** optional alias listing under department |

**Required:** `id`, `title`, `summary`, `status: z.enum(['planned','active','completed'])`, `department_ids`, `seo_*`, editorial envelope  
**Optional:** `staff_lead_ids`, `partner_orgs`, `start_date`, `end_date`, `funding_sources_markdown`  
**Relationships:** ↔ `publications`, `staff`, `departments`  
**Search:** `full`.

---

### 4.6 `publications`

| Attribute | Value |
| --- | --- |
| **Collection name** | `publications` |
| **Slug** | `src/content/publications/{publicationId}.md` — `publicationId` **not** DOI (DOI has `/`); use internal id |
| **Routing** | `/research/publications/[publicationId]/` |

**Required:** `id`, `title`, `year: z.number().int()`, `authors: z.array(z.string())` *(staffId or free string with `author_display_mode`)*, `abstract`, `seo_*`, editorial envelope  
**Optional:** `doi_url?: string`, `pdf_download_id?: string` (→ `downloads.id`), `journal`, `volume_issue`, `keywords: string[]`, `department_ids`, `project_ids`  
**Validation:** if `pdf_download_id` set → target download must `doc_kind` include `research_pdf` and `rights_verified: true`  
**Search:** `full` + inject keywords.  
**Citation metadata block** (optional frontmatter object): `csl_type`, `issn`, `pages`, `publisher`.

---

### 4.7 `services`

| Attribute | Value |
| --- | --- |
| **Collection name** | `services` |
| **Slug** | `clinic`, `drug-analysis-unit`, etc. — **fixed ids** for priority services to stabilise URLs `/services/[serviceId]/` |
| **Routing** | `/services/[serviceId]/` |

**Required:** `id`, `service_type: z.enum(['clinic','dau','laboratory','library','industry','other'])`, `title`, `summary`, `seo_*`, editorial envelope, `review_cycle: z.enum(['quarterly','semi_annual','annual'])`  
**Structured blocks (required for `clinic` + `dau`):**

```ts
hours: z.array(z.object({
  label: z.string(), // e.g. "Outpatient"
  schedule_lines: z.array(z.string()),
})),
fees: z.array(z.object({
  service_name: z.string(),
  amount_display: z.string(), // institutionally approved string
  notes: z.string().optional(),
})),
faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
procedure_steps: z.array(z.object({ title: z.string(), body: z.string() })),
download_ids: z.array(z.string()).default([]),
```

**Relationships:** ↔ `downloads`, `departments`, `staff` (`service_lead_staff_id`)  
**Search:** `full` but **never index unverified fee strings** until `editorial_status==='approved'` **and** `last_reviewed` present within policy window (enforced by build script optional).

---

### 4.8 `products` & `product_categories`

**MVP approach (Architect decision):** `product_categories` as **enum field** on `products.category` to reduce duplication; optional `src/content/products/categories.md` singleton for editorial blurbs per category.

| **products** |  |
| --- | --- |
| Location | `src/content/products/{productId}.md` |
| Route | `/products/[category]/[productId]/` **or** flat `/products/[productId]/` with `category` field — **pick one** in implementation; default **flat** `/products/[productId]/` + category filter pages at `/products/[category]/` generated from distinct `category` values |
| Required | `id`, `name`, `category: z.enum(['capsules','decoctions','ointments','powders','roots','teas'])`, `summary`, `disclaimer_required: z.literal(true)`, `disclaimer_text: z.string()`, `seo_*`, editorial envelope |
| Optional | `images: z.array(imageSchema)`, `enquiry_href: z.string()` (mailto or form URL), `related_download_ids` |
| Search | `metadata_only` for listings if disclaimers dominate body |

---

### 4.9 `news`

| Attribute | Value |
| --- | --- |
| **Collection** | `news` |
| **Slug** | `src/content/news/{yyyy}-{mm}-{dd}-{slug}.md` **or** `{newsId}.md` with date inside — Architect: prefer `{newsId}.md` + `published_on` required |
| **Route** | `/news/[newsId]/` |

**Required:** `id`, `title`, `published_on`, `excerpt`, `seo_*`, `editorial_status`, `content_owner_role`  
**Optional:** `featured_image`, `related_department_ids`, `related_project_ids`, `press_contact_staff_id`  
**Sanitization:** excerpt max 220 chars enforced Zod `.max(220)`; strip HTML in excerpt field (no HTML allowed in excerpt string).  
**Search:** `full`.

---

### 4.10 `events`

**Required:** `id`, `title`, `starts_at`, `ends_at`, `timezone: z.string()`, `venue`, `status: z.enum(['scheduled','postponed','cancelled','completed'])`, `seo_*`, editorial envelope  
**Optional:** `registration_url`, `related_department_ids`  
**Route:** `/events/[eventId]/` + archive index `/events/`  
**Search:** `metadata_only` for past events beyond N months (configurable) to reduce noise — **must be documented in release notes** (SR4 honesty: index scope).

---

### 4.11 `announcements`

**Required:** `id`, `title`, `priority: z.enum(['low','normal','high','critical'])`, `display_from`, `display_until`, `body_short`, `seo_noindex: z.boolean().default(true)`  
**Routing:** usually **no dedicated page**; if page exists `/announcements/[id]/` optional  
**Homepage:** `home_modules` query: `announcements` where now ∈ [from, until]  
**Search:** `metadata_only` or `exclude` for critical short-lived — default **`exclude`** to avoid clutter; **SR4:** if excluded, sitemap policy must still list if public page exists.

---

### 4.12 `media_albums` & `media_assets`

**Albums:** `src/content/media/albums/{albumId}.md`  
**Assets:** prefer **`src/content/media/assets/{assetId}.md`** with `album_id` foreign key (many-to-one).  
**Routes:** `/media/[albumId]/` ; videos hub `/media/videos/` lists assets with `kind:'video'`  
**Search:** captions/alt for assets `metadata_only`; album titles `full`.

---

### 4.13 `downloads`

**Required:** `id`, `title`, `doc_kind: z.enum(['form','report','policy','brochure','dataset','minutes','other'])`, `file: z.object({ path: z.string(), bytes: z.number().int(), mime: z.string() })`, `owner_unit: z.enum(['cpmr','clinic','dau','department','external'])`, `rights_verified: z.boolean()`, `seo_*`, editorial envelope  
**Optional:** `version`, `supersedes_download_id`, `related_department_ids`, `related_service_ids`  
**Routing:** primary discovery `/resources/downloads/`; detail `/resources/downloads/[downloadId]/` **optional** thin page for metadata + button  
**Search:** title + keywords `full`; PDF binary not indexed by Pagefind unless configured — provide HTML summary page alongside (recommended).

---

### 4.14 `partners`

**Required:** `id`, `name`, `href`, `logo`, `seo_*`  
**Route:** embedded in About/Partners page; optional `/about/partners/#partner-{id}`  
**Search:** `metadata_only`.

---

### 4.15 `home` (homepage modules)

Existing pattern (`src/content/home/hero.md`) preserved; extend with additional optional files: `src/content/home/{module}.md` **or** single `home.astro` data aggregator — Architect: prefer **multiple small files** for editorial merge conflict reduction.

**Hero schema (current):** as implemented in `src/content.config.ts` — do not regress.  
**Additional modules:** `quick_links.md`, `announcements_strip.yaml`, etc., each with Zod.

---

### 4.16 `contacts` (optional normalisation)

If contact matrix explodes, add:

`src/content/contacts/{contactId}.md` with `scope: global|department|service`, `department_id?`, `service_id?`, `phones[]`, `emails[]`, `office_hours_ref?`.

---

## 5. Department Mini-Site Data Architecture

### 5.1 Department data contract

Each department document **must** satisfy PRD §10 D2 **where content exists**; empty sections are allowed with UX empty states.

**Core contract fields:** `id`, `name`, `category`, `mandate_summary`, `hero`, `mini_site_nav`, `editorial envelope`.

### 5.2 Reusable mini-site engine

**Single Astro route family** reads `department` entry and composes:

- `DepartmentLayout.astro` — sets local tabs (`DESIGN.md` department tabs) from `mini_site_nav` + default tabs for sections with content detected (auto-hide empty tabs — UX).

**No hardcoded department components:** department-specific branding only via **content** (`hero.image`) and shared tokens.

### 5.3 Related-content relationships

| Related entity | Foreign keys | Resolution |
| --- | --- | --- |
| Staff | `staff.department_ids` includes `department.id` | `/departments/{id}/staff/` |
| Publications | `publication.department_ids` | listing + filters |
| News | `news.related_department_ids` | listing |
| Projects | `project.department_ids` | listing |
| Services | `department.related_service_ids` | cards |
| Gallery | `media_assets.related_department_ids` | tile strip |
| Downloads | `downloads.related_department_ids` | table |

### 5.4 Department navigation model

**Default tab order (auto-suppress if empty):** Overview → Staff → Projects → Publications → News → Services → Gallery → Downloads → Contact  
Labels and visibility **data-driven** from `mini_site_nav` + content detection helper.

### 5.5 Exact route behaviour (locked for implementation)

| Route | Behaviour |
| --- | --- |
| `/departments/[slug]/` | Department home (`T_DEPARTMENT_HOME`) |
| `/departments/[slug]/staff/` | `getCollection('staff').filter(d => d.data.department_ids.includes(slug))` sorted by `sort_order` then `full_name` |
| `/departments/[slug]/publications/` | Filter publications by department id; optional year facets client-side |
| `/departments/[slug]/news/` | Filter news |
| `/departments/[slug]/projects/` | Filter projects |

**Staff detail links:** prefer global canonical `/research/staff/[staffId]/` to avoid duplicate SEO; department pages show cards linking canonical.

---

## 6. Research & Publication Architecture

### 6.1 Publication schema (logical)

See §4.6. Additional rules:

- **DOI:** store **URL** in `doi_url` (`https://doi.org/...` normalized).  
- **Author relationships:** Store `authors: string[]` only. Each entry is either **`staff:{staffId}`** (internal reference) or a **plain string** (external name). Build step resolves `staff:{id}` to profile links; plain strings render as text — do not persist a separate `authors_resolved` field in source files.  
- **Department relationships:** `department_ids[]` drives filters.  
- **Project relationships:** `project_ids[]`.

### 6.2 Filtering strategy

- Build emits `src/data/generated/publications-index.json` grouping by `year`, `department_id`, `keyword` — **optional** performance path.  
- Client filters read JSON; progressive enhancement.

### 6.3 Archive strategy

Year sections on `/research/publications/`; stable per-publication routes; **no removal** — `archived` flag hides from default filters but keeps URL.

### 6.4 Search strategy

Pagefind indexes publication detail HTML; keywords duplicated in `<meta name="keywords">` **discouraged** — prefer visible abstract excerpt.

### 6.5 Citation metadata

Optional `citation` object for RIS/BibTeX export story (Phase 2); MVP renders structured HTML (`<cite>` patterns) from fields.

### 6.6 Featured publication behaviour

`publication.featured: boolean` max **3** globally — build fails if >3 approved `featured` true (validation).

---

## 7. Services Architecture

### 7.1 Clinic model

`services` entry `id:'clinic'`. Mandatory blocks: `hours`, `fees`, `faqs`, `procedure_steps`, `download_ids` (forms), `location_instructions`.  
**Operational truth cadence:** `review_cycle:'quarterly'` + `last_reviewed` enforced in QA checklist.

### 7.2 DAU model

`id:'drug-analysis-unit'`. Adds **submission packaging rules**, **rejection reasons FAQ**, **turnaround copy** with `editorial_status`.

### 7.3 Fee table structure

Stored as structured array (§4.7) — rendered with `Table` component per `DESIGN.md` accessibility. **Never** image-only fee tables.

### 7.4 FAQ architecture

Start embedded in `services`. Promote to `faqs` collection **only** when referenced by multiple services.

### 7.5 Operating hours model

Array of labelled schedules; each line plain text; no ambiguous “9-5” without timezone clarification for events (services use local wall time explicit).

### 7.6 Downloadable forms

`downloads.doc_kind='form'` linked via `download_ids`; each file has `version` and `supersedes_download_id` chain.

### 7.7 Structured procedures

`procedure_steps` ordered; each step title + body MD allowed; print stylesheet optional later.

### 7.8 Service metadata

`service_lead_staff_id`, `related_department_ids`, `enquiry_endpoints: z.array(z.object({ label, href, external boolean }))`

### 7.9 Discoverability

Utility nav links (`src/data/navigation.ts`) must flip `routeLive:true` only when **approved** `services` entry exists and `editorial_status==='approved'`.

---

## 8. Product Information Architecture

### 8.1 Categories

Enum enforced — expansion requires PRD change + migration story.

### 8.2 Dosage forms

Map 1:1 to category enum for MVP; if future granularity needed, add `dosage_form` sub-enum.

### 8.3 Safety disclaimers

`disclaimer_required: true` always for ingestible formats; `disclaimer_text` must be institutionally approved static string blocks; **no medical claims** beyond allowed copy — editorial gate.

### 8.4 Image handling

Max N gallery images default **6**; each with alt; hero image optional.

### 8.5 Categorisation & search

Category landing pages generated from distinct enum values. Search `metadata_only` + category facet field duplicated in Pagefind meta.

### 8.6 Relationships

Link to `downloads` (leaflets), `services` (enquiry), `publications` (evidence) via optional ids.

---

## 9. News / Events / Media Architecture

### 9.1 News categorisation

`news.category: z.enum(['institutional','research','services','partnerships','media'])`

### 9.2 Event categorisation

`events.kind: z.enum(['seminar','workshop','outreach','admin','other'])`

### 9.3 Media gallery structure

Album → many assets; asset types `image|video|audio`; video uses `provider: youtube|vimeo|file` with privacy review.

### 9.4 Featured image

`featured_image` optional; if absent, template uses neutral brand pattern (visuals in `DESIGN.md`).

### 9.5 Excerpt sanitization

Zod length + `remark` pipeline strip on build if MDX enabled.

### 9.6 Metadata cleanup rules

Strip double spaces; normalise smart quotes optional; dates must be valid calendar dates — Zod `.refine`.

### 9.7 Homepage integration

`home` modules pull latest `news` (3) and `events` (next 3 by `starts_at`).

### 9.8 Archive behaviour

News paginated static paths `/news/archive/[page].astro` generated from count.

---

## 10. Download & Resource Architecture

### 10.1 Kinds

See `doc_kind` enum §4.13.

### 10.2 File naming convention

**Storage path:** `public/documents/{yyyy}/{owner_unit}/{downloadId}-v{version}.pdf`  
**Display title** comes from frontmatter, not filename.

### 10.3 Versioning

Monotonic integer `version`; `supersedes_download_id` required when incrementing unless inaugural.

### 10.4 Metadata strategy

Each download has HTML detail page (thin) for Pagefind and accessibility summary.

### 10.5 Annual reports

`doc_kind:'report'` + `report_year: number` required.

### 10.6 Scientific materials

`rights_verified` gate mandatory true.

---

## 11. Search Architecture

### 11.1 Static search generation (ADR-004)

**Primary:** [Pagefind](https://pagefind.app/) post-processing **`dist/`** after `astro build`.  
**Fallback:** `src/data/generated/search-index.json` + client fuzzy library — only if Pagefind blocked.

### 11.2 Indexed content types

Default MVP index: `pages` (approved), `departments`, `staff`, `services`, `projects`, `publications`, `products`, `news`, `events`, `downloads` (HTML shells), `media_albums`.  
**Announcements:** excluded by default (§4.11).  

### 11.3 Pipeline

`npm run build` → `npx pagefind --site dist` (exact flags in story) → optional upload verification.

### 11.4 Search metadata

Add `data-pagefind-meta` attributes for `type`, `department`, `year` as Pagefind supports — align with UX filter chips.

### 11.5 Filtering behaviour

Client-side filter chips read Pagefind results object; if absent, degrade to unfiltered list.

### 11.6 Keyword strategy

Controlled vocabulary optional `keywords: string[]` max 10 per entity.

### 11.7 Searchable fields

Title, summary, abstract, mandated headings for services; avoid indexing raw tables as only source — repeat plain-language fees summary paragraph for search where ethically appropriate.

### 11.8 Result rendering

Group by `type`; use DESIGN result card template `T_SEARCH_RESULTS`.

### 11.9 No-results behaviour

Institutional suggestions: Clinic, DAU, Departments, Contact — `03_ux_blueprint.md` §21.3.

### 11.10 SR4 honesty

Release notes must declare reduced indexer scope if any collection delayed.

---

## 12. URL & Slug Governance

### 12.1 Slug normalization

Lowercase ASCII `kebab-case`; no consecutive hyphens; max length 72 chars; must not equal reserved: `admin`, `api`, `assets`, `dist`, `search`, `404`.

### 12.2 Canonical URLs

Each template sets `<link rel="canonical" href="https://{PROD_HOST}{pathname}">` using `settings` base URL.  
**Trailing slash:** project-wide **on** (`06_project_context.md`).

### 12.3 Redirects

Legacy `/old` → `/new` via host `301` map; maintain `docs/ops/redirects.csv` (create when inventory exists).

### 12.4 Hierarchy rules

Department subtree always `/departments/{id}/...`. Services always `/services/{id}/`. Research corpus under `/research/...` except staff canonical.

### 12.5 SEO-safe routing

Avoid duplicate paths for same entity; department staff listing must not emit duplicate staff canonicals — use listing `noindex` if thin duplicate risk (Architect story decision).

---

## 13. Media & Image Governance

### 13.1 Library structure

- `src/assets/images/{domain}/{entityId}/...` optimised pipeline  
- `public/images/legacy/...` only until migrated

### 13.2 Folder strategy

Domain = `departments|staff|news|services|products|media`.

### 13.3 Naming

`{entityId}-{descriptor}-{width}w.{ext}` lowercase.

### 13.4 Alt text

Mandatory meaningful alt; decorative `alt=""` allowed only with `decorative: true` flag in schema.

### 13.5 Responsive rules

Use Astro `<Image />` widths from `DESIGN.md` image sizes.

### 13.6 Optimisation

`webp`/`avif` generation per Astro defaults; originals retained in repo only if licence allows.

### 13.7 Focal point

Optional `focal_point: {x:0-1,y:0-1}` for hero crops.

### 13.8 Allowed formats

Raster: `jpg|png|webp|avif|gif` (gif sparingly); Vector: `svg` allowed for logos only with sanitisation story; Documents: `pdf` primary.

---

## 14. Editorial Governance Model

### 14.1 Roles (from Brief; mapped to MVP)

| Role | Responsibilities |
| --- | --- |
| Super Admin | Schema changes, settings, release approval |
| Content Administrator | IA + cross-cutting pages + nav `routeLive` coordination |
| Department Editor | Department mini-site truth |
| Service Editor | Clinic/DAU/service operational copy |
| Media Editor | Assets, rights metadata |
| Reviewer | Read-only approval comment |
| Publisher | Merge to `main` / trigger deploy |

### 14.2 Review workflows

Feature branch → PR → Reviewer checklist (`CONTRIBUTING` when added) → merge → scheduled deploy.

### 14.3 Publishing workflows

No host preview: **`astro preview` locally** or CI artefact download.

### 14.4 Ownership boundaries

`content_owner_role` mandatory; mismatched edits require handoff PR comment.

### 14.5 Approval workflows

Two-person rule for `services` fee changes and `downloads` legal docs.

### 14.6 Update cadence

Mirror PRD §7 C5: fees/contact quarterly; departments semi-annual; static pages annual — tracked via `last_reviewed` + automated CI warning script (optional story).

### 14.7 Stale content management

Build warns if `last_reviewed` older than threshold for `clinic`/`dau`.

### 14.8 Archival

`editorial_status:'archived'` removes from listings, keeps page with banner.

---

## 15. Future CMS Integration Strategy

### 15.1 Decap CMS compatibility

Use folder collections matching `src/content/**` glob patterns; editorial writes Markdown with same frontmatter keys; branch protection prevents direct-to-main.

### 15.2 Headless CMS compatibility

Map CMS collection → exporter producing Markdown files OR JSON import build step; maintain **Zod as contract** — generate types from shared `schemas/` if duplication hurts.

### 15.3 Schema portability

Document logical models in this file; Zod mirrors logical; versioning field `schema_version: 1` on each entry optional during migrations.

### 15.4 Migration-readiness

Inventory spreadsheet must map legacy URL → new `id` + collection (`docs/00_source/content_inventory.md` — currently empty; blocking for migration claims).

### 15.5 API-readiness

Treat build as idempotent function `content_files + assets -> dist`. Future API feeds pre-build folder.

### 15.6 App-layer separation

Authenticated tools live off public origin per `04_architecture.md` §17.

---

## 16. Astro Implementation Mapping

| Concern | Location |
| --- | --- |
| Collections | `src/content.config.ts` — `defineCollection` per §4 |
| Content folders | `src/content/{settings,pages,departments,staff,projects,publications,services,products,news,events,announcements,media,downloads,partners,home}/**` |
| Aggregates / nav | `src/data/navigation.ts`, `src/data/footer.ts` |
| Generated indexes | `src/data/generated/*` (gitignored) via scripts |
| Layouts | `src/layouts/BaseLayout.astro` + templates per `DESIGN.md` |
| Routes | `src/pages/**` mirror IA; dynamic `[slug].astro` per entity |
| Data access | `getCollection`, `getEntry`, `getStaticPaths` |
| Build | `astro build` → `dist/`; Pagefind step appended in `validate` when story lands |

**Current repo snapshot (2026-05-14):** implemented collections: `_bootstrap`, `home` (hero). **All other collections in §4 are specified but not yet implemented** — stories must add them incrementally without violating this contract.

---

## 17. Build & Deployment Implications

1. **Static build** expands all dynamic routes from collections.  
2. **Large corpora** (publications) may require chunked archive listings — watch build time on CI.  
3. **Shared hosting / cPanel:** upload `dist/`; ensure `.htaccess` or equivalent for SPA-less static; configure MIME for `wasm` if Pagefind requires (verify host).  
4. **Search index** size: monitor; exclude large binary PDFs from index — use HTML shells.  
5. **Subdirectory deploy:** if `base` set, Pagefind and canonical URLs must include base — Architect story.

---

## 18. Risks & Failure Modes

| Risk | Mitigation |
| --- | --- |
| Content sprawl | Enforce enums, `doc_kind`, max array sizes |
| Broken relationships | Build-time validators §19 |
| Editorial inconsistency | `last_reviewed`, two-person review for fees/legal |
| Routing collisions | Slug reserved word list §12 |
| Metadata leakage | Separate `internal_notes` field never rendered |
| Scalability | Generated indexes, paginate archives |
| Governance failures | PR templates, role tags |
| Search fragmentation | Single indexer, documented scope |

---

## 19. Validation Rules

1. **Schema validation:** Zod in `content.config.ts` for every collection.  
2. **Required fields:** per §4 tables.  
3. **Relationship validation:** resolver utilities in `src/lib/content/refs.ts` (create during implementation) asserting targets exist.  
4. **Slug validation:** regex + reserved list.  
5. **Build validation:** `astro check` when enabled; `validate` includes search step once wired.  
6. **Search validation:** smoke test queries for Clinic, DAU, ≥1 department, ≥1 staff (`02_prd.md` §33).  

---

## 20. Handoff Requirements

| Consumer | Requirement |
| --- | --- |
| **Dev agents** | Implement collections/schemas exactly as §4–§5; no hardcoded department routes; use `navigation.ts` `routeLive` until content approved |
| **QA agents** | Build acceptance suites from §19 + SR4; fee/hour staleness checks |
| **Architect agents** | Maintain ADR alignment; gate breaking schema changes |
| **Story generation** | Each content-touching story cites §4 collection + §16 paths |
| **Backlog generation** | No `backlog.json` in repo at 2026-05-14 — use `docs/04_stories/05_story_map.md` as source until automation exports JSON |
| **Search implementation** | Pagefind per §11; document in E11 stories |
| **Future CMS integration** | Follow §15; constitution amendment if runtime introduced |

---

## Appendix A — Cross-artifact validation record (2026-05-14)

| Reference | Validation outcome |
| --- | --- |
| `02_prd.md` | Traceable: F2–F7, §8 homepage modules, §10 departments, §12–16 services, §18–23 publishing, §23 search, §29 CMS model |
| `03_ux_blueprint.md` | Utility nav targets align with service/download/publication/contact routes; search overlay + `/search/` supported |
| `04_architecture.md` | Static pillars, collections split, Pagefind ADR-004, department subtree ADR-003 preserved |
| `06_project_context.md` | Static-only, DESIGN token supremacy for UI, SR4 honoured |
| `DESIGN.md` | Templates (`T_*`) referenced semantically; no visual tokens invented here |
| Department mini-sites | Routes `/departments/[slug]/**` explicitly defined |
| Shared hosting | `dist/` only; optional Pagefind wasm/host MIME risk flagged |

---

## Appendix B — QA Architect explicit findings (must be tracked in stories)

1. **`downloads` + Pagefind:** require HTML detail pages — indexing PDFs alone is insufficient for accessibility and SR4.  
2. **`events` timezone:** enforce explicit IANA timezone strings in schema to avoid DST errors.  
3. **`authors` mixed strings:** build resolver must document precedence when same person exists as staff and string.  
4. **`navigation.ts` graph:** remains source of `routeLive` until `nav` collection exporter exists — risk of drift vs §4; add story to unify.  
5. **Featured publications cap:** enforce max 3 at build.  
6. **MVP honesty:** until collections populated, search smoke tests may be `@skipped` **only** with visible staging banner — production deploy must not claim full index.

---

*End of document `05_content_architecture_and_cms_strategy.md` v1.0.0.*
