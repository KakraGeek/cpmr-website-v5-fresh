# CENTRE FOR PLANT MEDICINE RESEARCH (CPMR)

# Institutional Website Redesign Brief

## Greenfield Design Brief for BMAD Analysis, Architecture and PRD Generation

**Prepared for:** CPMR Website Development and BMAD Planning Workflow  
**Project type:** Greenfield institutional website build  
**Recommended stack direction:** Astro-first static/hybrid institutional website with CMS-managed content  
**Prepared:** May 2026  
**Classification:** Internal planning / stakeholder review / BMAD input document

---

## 1. Executive Context

The Centre for Plant Medicine Research (CPMR) website initiative must be treated as a greenfield institutional platform build, not a continuation of the partially successful migration attempt. The previous rebuild showed that visual modernization alone is not enough. The client has not yet supplied a full, verified package of text, images, leadership information, department content, service details, product information and research assets. The old website contains useful institutional depth, but that content is incomplete, uneven, outdated in parts and unsuitable for direct copy-and-paste migration without verification.

This brief therefore defines a new design direction that BMAD agents should use as the authoritative starting point for analysis, PRD generation, UX planning and architecture. The goal is to create a scalable institutional website that presents CPMR as Ghana's authoritative national plant medicine research institution while giving non-technical staff the ability to update text, images, news, events, departments, services, products, publications and downloads through a CMS.

The website should not be designed as a brochure, a generic corporate site or a product catalogue. It should be designed as an institutional knowledge, service and research portal.

---

## 2. Core Project Decision: Astro Instead of Next.js

The recommended frontend direction is Astro, not Next.js.

Astro is more appropriate for this project because CPMR's website is primarily an institutional publishing platform with structured content, public information, pages, resources, news, departments, services and media. The site does not require a heavy full-stack React application by default. Astro supports fast static output, strong content-driven architecture, island-based interactivity where needed and simpler deployment to hosting environments that may not support long-running Node.js applications reliably.

### 2.1 Why Astro Fits CPMR

Astro should be preferred because it supports:

- Static-first publishing for institutional pages.
- Fast page loads and strong mobile performance.
- Lower runtime complexity than a full Next.js application.
- Better suitability for shared hosting or static hosting if required.
- Component-driven development using Astro components and optional React islands.
- Markdown/MDX content support where appropriate.
- CMS-driven content workflows through API or Git-based content models.
- Easier progressive enhancement for search, forms, galleries and media.

### 2.2 Astro Design Principle

The site should be built as a content-first institutional portal, with interactivity added only where it improves user experience. Most pages should be statically generated or cached aggressively. Dynamic behavior should be limited to CMS preview, search, forms, filters, event listings, media galleries and administrative workflows handled through the CMS.

### 2.3 Recommended Technical Direction

The BMAD architecture phase should evaluate and specify:

- Astro frontend.
- TypeScript.
- Tailwind CSS.
- Component-driven design system.
- CMS integration for editable institutional content.
- Static or hybrid rendering strategy.
- Image optimization pipeline.
- Search indexing strategy.
- Form handling strategy.
- Deployment route suitable for static or low-runtime hosting.

---

## 3. Strategic Objectives

The redesigned website must:

1. Position CPMR as Ghana's authoritative national institution for plant medicine research.
2. Communicate scientific credibility, institutional mandate, public service relevance and research depth.
3. Present CPMR's full value chain: plant conservation, cultivation, scientific research, laboratory analysis, product development, clinical services, production, training, public education and partnerships.
4. Provide department sub-sites or mini-sites as a central architecture pattern.
5. Make high-demand services easy to find, especially the Clinic and Drug Analysis Unit.
6. Allow CPMR staff to update text, images, staff profiles, events, news, downloads, service details and media without developer intervention.
7. Preserve useful legacy content only after verification, rewriting and restructuring.
8. Support progressive content expansion after launch.
9. Improve accessibility, mobile responsiveness, search, SEO and content governance.
10. Avoid launching a modern-looking but institutionally thin website.

---

## 4. Non-Negotiable Requirements

The following requirements are mandatory for the BMAD PRD and architecture phases.

### 4.1 Astro-First Frontend

The site must be planned as an Astro implementation unless a later technical review proves that another architecture is necessary. The project should avoid Next.js as the default approach.

### 4.2 Department Mini-Sites

Each major department must have its own structured sub-site or mini-site, not merely a small content block on a generic page. Department mini-sites are a central requirement of the redesign.

### 4.3 CMS-First Content Management

The CMS is a central pillar of the project. The client's staff must be able to update routine site content independently, including text, images, documents, news, events, product categories, service details and department information.

### 4.4 Content Governance

The website must include defined content roles, review workflows, publishing permissions and review intervals so the site does not become stale after handover.

### 4.5 Migration With Verification

Legacy website content should not be blindly migrated. It must be inventoried, rewritten, verified and assigned to structured CMS content types.

---

## 5. Institutional Positioning

The website should present CPMR as:

- Authoritative but approachable.
- Scientific but publicly accessible.
- Ghanaian in identity but internationally credible.
- Research-led but service-oriented.
- Evidence-based and transparent.
- A public institution with clear governance, leadership and operational pathways.

The tone should be formal, clear, calm and institutional. It should avoid exaggerated marketing language, unverified claims or overly commercial product positioning.

---

## 6. Target Audiences

The website must serve multiple public and institutional audiences.

| Audience | Primary Need | Required Website Response |
|---|---|---|
| Patients and general public | Clinic services, fees, hours, location, products and contact information | Clear service pages, quick access links, contact routes and clinic details |
| Herbal product manufacturers | Drug analysis requirements, fees, samples, timelines and submission process | A detailed Drug Analysis Unit page with forms, FAQs and service workflow |
| Researchers and academics | Departments, projects, publications, staff expertise and collaboration routes | Research hub, department mini-sites, publications repository and staff profiles |
| Government stakeholders | Mandate, governance, achievements, reports and institutional impact | Strong About section, governance pages, reports and news archive |
| International partners and NGOs | Research capacity, collaborations, institutional credibility and contact pathways | Partnership pages, research highlights, department profiles and official contacts |
| Media and public relations users | News, official statements, leadership bios, images and media contacts | Media centre, announcements, gallery and press resources |
| Students, interns and trainees | Training, attachment, internship, library and career information | Careers and opportunities section with clear instructions |
| CPMR staff editors | Simple content update process | CMS dashboard, editorial roles, structured forms and approval workflow |

---

## 7. Required User Journeys

### 7.1 Clinic Journey

Homepage -> Quick Access -> Clinic -> Fees / Hours / Services / Insurance / Contact

Users must be able to reach Clinic information from the homepage in one click. The page must provide operating hours, consultation information, laboratory services, payment/insurance notes, contact channels and visit instructions.

### 7.2 Drug Analysis Unit Journey

Homepage -> Quick Access or Services -> Drug Analysis Unit -> Requirements / Fees / Submission Process / FAQ

Herbal product manufacturers must understand what to submit, how analysis works, how long it takes, what fees apply and who to contact.

### 7.3 Research Discovery Journey

Homepage -> Research -> Departments -> Projects / Publications / Staff Profiles

Researchers must be able to move from institutional research overview to department mini-sites, then to projects, publications and expert profiles.

### 7.4 Department Mini-Site Journey

Homepage -> Research or About -> Department Index -> Department Mini-Site -> Mandate / Staff / Projects / Publications / Services / News / Contact

Each department must function as a self-contained institutional page group with related content automatically surfaced through CMS relationships.

### 7.5 Content Editor Journey

CMS Login -> Choose Content Type -> Create or Edit Draft -> Submit for Review -> Approve -> Publish -> Review Reminder

The client's staff must be able to update content without developer intervention while still protecting quality, accuracy and institutional approval standards.

---

## 8. Information Architecture

The recommended top-level sitemap is:

1. Home
2. About CPMR
3. Research
4. Departments
5. Services
6. Products
7. News & Events
8. Resources
9. Careers & Opportunities
10. Contact

### 8.1 Utility Navigation

A compact top utility navigation should include:

- Clinic
- Drug Analysis Unit
- Downloads
- Publications
- Contact
- Search

### 8.2 Main Navigation

The main navigation should use grouped menus suitable for a research institution.

#### About CPMR

- Overview
- History
- Mandate
- Vision & Mission
- Leadership
- Board Members
- Management Team
- Organisational Structure
- Awards & Recognition
- Partners & Affiliations

#### Research

- Research Overview
- Research Themes
- Research Projects
- Publications
- Researcher Profiles
- Research Facilities
- Collaboration

#### Departments

- Department Index
- Research Departments
- Service Departments
- Administrative Departments
- Department Contacts

#### Services

- Clinic
- Drug Analysis Unit
- Animal Experimentation Unit
- Nursery / Seedlings
- Library
- Industry Services
- Service Fees
- FAQs

#### Products

- Product Overview
- Capsules
- Decoctions
- Ointments
- Powders
- Roots
- Teas
- Product Enquiries

#### News & Events

- Latest News
- Announcements
- Events Calendar
- Media Gallery
- Videos
- Press Resources

#### Resources

- Downloads
- Annual Reports
- Forms
- Brochures
- Policies
- FAQs
- Publications Archive

#### Careers & Opportunities

- Jobs
- Internships
- Attachments
- National Service
- Procurement / Tenders

#### Contact

- General Contact
- Department Contacts
- Clinic Contact
- Drug Analysis Unit Contact
- Location Map
- Office Hours

---

## 9. Department Mini-Site Requirement

Department mini-sites are a central design and content architecture requirement.

A department mini-site is not a separate system or separate domain. It is a structured section within the main website that gives each department a durable institutional presence and allows department-specific content to be maintained through the CMS.

### 9.1 Purpose of Department Mini-Sites

Department mini-sites should:

- Reflect CPMR's real institutional structure.
- Make departmental mandates and functions visible.
- Connect departments to staff, projects, publications, services and news.
- Support department-level content ownership.
- Improve research discoverability.
- Create scalable architecture for future departmental growth.

### 9.2 Minimum Department Mini-Site Structure

Each department mini-site should include:

1. Department homepage
2. Overview and mandate
3. Functions and service areas
4. Head of department
5. Staff profiles
6. Research areas or operational focus
7. Related projects
8. Related publications
9. Facilities or laboratories
10. News and updates related to the department
11. Downloads or forms where relevant
12. Contact information

### 9.3 Department Mini-Site URL Pattern

Recommended URL pattern:

```text
/departments/[department-slug]/
/departments/[department-slug]/staff/
/departments/[department-slug]/projects/
/departments/[department-slug]/publications/
/departments/[department-slug]/services/
/departments/[department-slug]/news/
```

### 9.4 Department Content Relationships

The CMS should allow each department to automatically display:

- Linked staff members.
- Linked projects.
- Linked publications.
- Linked services.
- Linked events.
- Linked news articles.
- Linked downloads.
- Linked media gallery items.

### 9.5 Priority Departments for Initial Rollout

The initial rollout should include structured pages for departments and units such as:

- Clinical Research
- Scientific and Technical Services
- Pharmacology and Toxicology
- Phytochemistry
- Microbiology
- Pharmaceutics
- Plant Development and Production
- Production-related units
- Administrative/support departments where applicable

The exact list must be verified with CPMR before launch.

---

## 10. CMS as a Central Pillar

The CMS must be treated as a core product requirement, not an optional admin add-on.

The primary reason is operational sustainability: CPMR staff must be able to update content, images and documents without relying on a developer for routine changes.

### 10.1 CMS Objectives

The CMS must allow authorized staff to manage:

- Homepage sections.
- Institutional pages.
- Department mini-sites.
- Staff profiles.
- Service pages.
- Service fees and operating hours.
- Product categories.
- Research projects.
- Publications.
- News.
- Events.
- Announcements.
- Downloads.
- Media galleries.
- Forms and brochures.
- Footer links and contact details.

### 10.2 Required CMS Capabilities

The selected CMS should support:

- Structured content collections.
- Media library management.
- Image alt text and captions.
- Role-based access control.
- Draft and publish workflow.
- Review and approval process.
- Revision history.
- Scheduled publishing.
- Slug management.
- SEO metadata.
- Content relationships.
- Reusable content blocks.
- Document uploads.
- Content status tracking.
- Last-reviewed date fields.

### 10.3 CMS Content Types

Recommended CMS collections include:

| Content Type | Purpose |
|---|---|
| Pages | General institutional pages |
| Departments | Department mini-site content |
| Staff Profiles | Leadership, researchers, management and department staff |
| Services | Clinic, Drug Analysis Unit and other service pages |
| Service Fees | Editable tables for fees, tests, analysis and consultation pricing |
| Research Projects | Project summaries, teams, outputs and contacts |
| Publications | Research output archive |
| Products | Product categories and product information |
| News | Institutional news and updates |
| Events | Events calendar and event archive |
| Announcements | Public notices and urgent updates |
| Downloads | Forms, reports, brochures, policies and documents |
| Media Library | Images, videos, galleries and captions |
| Site Settings | Navigation, footer, contact details and global settings |

### 10.4 Recommended Editorial Roles

| Role | Responsibility |
|---|---|
| Super Admin | Technical owner with full CMS control |
| Content Administrator | Manages site-wide content, navigation, homepage and footer |
| Department Editor | Creates and updates department-specific drafts |
| Service Editor | Updates clinic, DAU and service information |
| Media Editor | Uploads and tags images, galleries and videos |
| Reviewer | Checks accuracy, tone, scientific claims and institutional compliance |
| Publisher | Final approval and publishing authority |

### 10.5 Publishing Workflow

1. Content owner creates or edits a draft.
2. Department or service reviewer checks factual accuracy.
3. Communications reviewer checks tone, formatting, accessibility and SEO.
4. Approver signs off sensitive content such as fees, leadership details, policies and official announcements.
5. Publisher releases the content.
6. CMS stores revision history.
7. CMS flags content for future review.

### 10.6 Review Intervals

- Fees and service details: every 3 months.
- Contact information: every 3 months.
- Department pages: every 6 months.
- Staff profiles: every 6 months.
- Publications: continuous update.
- Static institutional pages: every 12 months.
- Product information: every 6 months or as determined by CPMR.

---

## 11. Homepage Requirements

The homepage must immediately communicate what CPMR is, what it does and where users should go next.

Recommended homepage structure:

1. Hero section with institutional positioning.
2. Quick access cards for Clinic, Drug Analysis Unit, Departments, Publications, Products and Contact.
3. Announcement or notice strip.
4. About / mandate snapshot.
5. Research highlights.
6. Department preview.
7. Services preview.
8. Product category preview.
9. News and events section.
10. Publications or resources highlight.
11. Partners and affiliations.
12. Deep footer.

The homepage should not overuse calls to action. It should direct users clearly to priority pathways.

---

## 12. Service Page Requirements

Service pages must be operationally useful and CMS-managed.

### 12.1 Clinic Page

The Clinic page should include:

- Overview.
- Who the clinic serves.
- Operating hours.
- Consultation information.
- Fee tables.
- Laboratory services.
- Insurance information if applicable.
- Visit instructions.
- Contact details.
- FAQs.
- Related downloads.
- Location guidance.

### 12.2 Drug Analysis Unit Page

The Drug Analysis Unit page should include:

- Overview.
- Types of analysis offered.
- Sample submission requirements.
- Fees.
- Turnaround times.
- Step-by-step process.
- Relationship to regulatory or FDA registration context where applicable.
- Report collection process.
- FAQs.
- Contact details.
- Downloadable forms.

### 12.3 Other Service Pages

Other services should follow a consistent template:

- Overview.
- Eligibility or target users.
- Requirements.
- Procedure.
- Fees if applicable.
- Operating hours.
- FAQs.
- Documents/forms.
- Contact.

---

## 13. Research and Publications Requirements

The Research section should make CPMR's scientific work discoverable.

It should include:

- Research overview.
- Research themes.
- Department links.
- Project pages.
- Publications repository.
- Researcher profiles.
- Facilities and laboratories.
- Collaboration contact pathway.

### 13.1 Research Project Page Template

Each project page should include:

- Project title.
- Therapeutic or research area.
- Summary.
- Background.
- Objectives.
- Activities.
- Team members.
- Partners.
- Outputs.
- Publications.
- Status.
- Contact.

### 13.2 Publications Repository

The publications repository should support:

- Search.
- Filters by year, department, author and research area.
- Abstracts.
- DOI or external links.
- File uploads where permitted.
- Citation details.
- Related staff and department links.

---

## 14. Products Section Requirements

The Products section should present CPMR products responsibly and institutionally. It should not behave like a generic online shop unless CPMR explicitly approves e-commerce in a future phase.

Product categories should include:

- Capsules
- Decoctions
- Ointments
- Powders
- Roots
- Teas

Each product category page should include:

- Category description.
- Product listing.
- Product images.
- Responsible use/disclaimer note.
- Availability or enquiry route.
- Related contact information.

---

## 15. News, Events and Media Requirements

The site must separate news, announcements and events.

### 15.1 News

News should include:

- Title.
- Date.
- Category.
- Featured image.
- Clean excerpt.
- Body content.
- Related department/project.
- Author/editor where appropriate.

### 15.2 Events

Events should include:

- Event title.
- Date and time.
- Venue.
- Registration link where applicable.
- Event status.
- Description.
- Organiser.
- Related department.

### 15.3 Announcements

Announcements should support:

- Priority level.
- Date range.
- Audience.
- Homepage visibility toggle.
- CTA link.

### 15.4 Media Gallery

The media gallery should support:

- Albums.
- Captions.
- Alt text.
- Event relationships.
- Department relationships.
- Video embeds where appropriate.

---

## 16. Resources and Downloads

The Resources section should serve as the institutional document centre.

It should include:

- Annual reports.
- Forms.
- Brochures.
- Policies.
- Service documents.
- Publications archive.
- Media resources.
- FAQs.

Downloads should be filterable by category, date, owner and document type.

---

## 17. Design System Direction

The visual system should be restrained, credible and institutional.

### 17.1 Visual Principles

- Use medicinal plant-inspired greens and neutral backgrounds.
- Use warm accents sparingly.
- Prioritize readability over decoration.
- Use consistent cards and content blocks.
- Maintain strong spacing and hierarchy.
- Avoid excessive animation.
- Avoid generic stock images where possible.

### 17.2 Component System

The Astro implementation should include reusable components such as:

- Header and utility navigation.
- Mega menu.
- Breadcrumbs.
- Hero section.
- Quick access cards.
- Department cards.
- Service cards.
- Research project cards.
- Publication list item.
- Staff profile card.
- Event card.
- News card.
- Announcement banner.
- Download list.
- Fee table.
- FAQ accordion.
- Gallery block.
- CTA band.
- Footer.

---

## 18. Accessibility and Mobile Requirements

The platform must be built for inclusive public access.

Requirements include:

- Semantic HTML.
- Correct heading hierarchy.
- Keyboard navigation.
- Visible focus states.
- Alt text for images.
- Accessible forms.
- Sufficient colour contrast.
- Skip-to-content link.
- Reduced motion support.
- Readable tables on mobile.
- Large tap targets.
- Optimized mobile navigation.
- Performance testing on low-to-mid-range Android devices.

---

## 19. Search and Discovery

The website should include site-wide search because CPMR will have many content types.

Search should cover:

- Pages.
- Departments.
- Staff profiles.
- Services.
- Publications.
- Research projects.
- Downloads.
- Products.
- News.
- Events.

Search results should be filterable by content type and department.

---

## 20. Content Strategy and Migration Approach

Because client-supplied content is incomplete, the project must follow a structured content acquisition and migration process.

### 20.1 Content Inventory

Create an inventory of:

- Old website pages.
- Existing new-site pages.
- Client feedback documents.
- Available images.
- Available reports.
- Available forms.
- Product information.
- Department information.
- Leadership and governance content.

### 20.2 Content Status Categories

Each content item should be marked as:

- Migrate after rewrite.
- Verify with client.
- Archive.
- Create new.
- Pending media.
- Pending approval.

### 20.3 Content Priorities

Highest priority:

- Clinic.
- Drug Analysis Unit.
- Contact.
- Leadership.
- Departments.
- Research projects.
- Products.
- Vision and mission.
- Footer.

Medium priority:

- News.
- Events.
- Media gallery.
- Publications archive.
- Downloads.

Future priority:

- Advanced research dashboards.
- Multilingual content.
- Interactive maps.
- Newsletter.
- Chatbot or enquiry assistant.

---

## 21. Implementation Roadmap

### Phase 1: Discovery and Content Inventory

- Confirm greenfield scope.
- Audit old and partial new sites.
- Inventory available content and images.
- Identify gaps requiring client confirmation.
- Confirm department list.
- Confirm service list.
- Confirm CMS editorial roles.

### Phase 2: UX and Information Architecture

- Define sitemap.
- Define department mini-site structure.
- Define user journeys.
- Define page templates.
- Define homepage architecture.
- Define navigation and footer structure.

### Phase 3: CMS Architecture

- Select CMS.
- Define content types.
- Define relationships.
- Define roles and permissions.
- Define publishing workflow.
- Define media library rules.
- Define review intervals.

### Phase 4: Astro Design System and Frontend Foundation

- Set up Astro project.
- Configure TypeScript and Tailwind.
- Build layout system.
- Build core components.
- Build page templates.
- Integrate CMS data.
- Implement responsive behavior.

### Phase 5: Critical Content Buildout

- Build About pages.
- Build Clinic page.
- Build Drug Analysis Unit page.
- Build department mini-sites.
- Build research projects.
- Build products section.
- Build contact and footer.

### Phase 6: Search, Resources and Media

- Implement site search.
- Build downloads centre.
- Build publications repository.
- Build news/events system.
- Build media gallery.

### Phase 7: QA, Training and Handover

- Test accessibility.
- Test responsiveness.
- Test CMS workflows.
- Test forms.
- Test search.
- Train client staff.
- Document editorial workflow.
- Hand over maintenance guide.

---

## 22. MoSCoW Prioritization

### Must Have

- Astro frontend.
- CMS-managed core content.
- Department mini-sites.
- Clinic page.
- Drug Analysis Unit page.
- Leadership and governance pages.
- Research project pages.
- Product category pages.
- Contact page.
- Deep footer.
- Mobile responsive design.
- Accessibility basics.
- CMS roles and publishing workflow.

### Should Have

- Site-wide search.
- Publications repository.
- Downloads centre.
- Events calendar.
- Announcements.
- Staff directory.
- Media gallery.
- Partner/affiliation section.
- Analytics.

### Could Have

- Newsletter signup.
- Multilingual support.
- Interactive maps.
- Advanced research dashboards.
- Chatbot/enquiry assistant.
- Public API.

### Should Not Do Now

- Full e-commerce system.
- Excessive animations.
- Unverified health claims.
- Public placeholder pages.
- Hardcoded operational content.
- Copying another institution's brand identity.
- Next.js-first implementation unless later justified.

---

## 23. Definition of Done

The website is stakeholder-ready when:

- Astro frontend foundation is implemented.
- CMS supports all required content types.
- Department mini-sites are live for priority departments.
- Clinic and Drug Analysis Unit pages are complete and verified.
- Leadership, governance and institutional pages are complete.
- Products and research project pages are populated.
- Search, downloads and publications are functional or clearly scoped for launch phase.
- Homepage communicates CPMR's mandate, services, research and public value clearly.
- Footer supports deep institutional navigation.
- No public placeholder pages exist.
- Accessibility and mobile responsiveness have been tested.
- Staff can update text, images, downloads, news and events through CMS.
- Editorial workflow and content governance rules are documented.
- Handover training has been completed.

---

## 24. BMAD Agent Instructions

BMAD agents should treat this brief as the project initiation input for a greenfield institutional website.

The Analyst should:

- Validate institutional goals.
- Identify stakeholders and user groups.
- Clarify content gaps.
- Analyze department mini-site requirements.
- Confirm CMS-first assumptions.

The Product Manager should:

- Generate a PRD that treats CMS and department mini-sites as core requirements.
- Avoid framing the project as a simple redesign.
- Prioritize content governance and maintainability.

The UX Designer should:

- Design institutional user journeys.
- Define page templates.
- Model department mini-site UX.
- Ensure accessible and mobile-first layouts.

The Architect should:

- Specify Astro-first architecture.
- Define CMS integration.
- Define content models and relationships.
- Define deployment strategy.
- Define search, forms, media and performance architecture.

The Scrum Master should:

- Convert the PRD and architecture into implementable epics and stories.
- Ensure department mini-sites and CMS workflows are represented in the backlog.

The Developer should:

- Implement Astro components, templates, CMS integration and structured content rendering.
- Avoid hardcoding operational content that belongs in the CMS.

The QA role should:

- Validate accessibility, responsiveness, content completeness, CMS workflows, search and editorial permissions.

---

## 25. Final Strategic Direction

The CPMR website must become a durable institutional publishing and service platform. Its success depends less on visual polish alone and more on structured content, department mini-sites, CMS maintainability, service clarity, research discoverability and governance.

The new build should therefore begin with institutional architecture, content modelling and CMS workflow design before detailed visual implementation. Astro should provide the frontend foundation, while the CMS should provide the operational backbone that allows CPMR staff to maintain the platform long after developer handover.
