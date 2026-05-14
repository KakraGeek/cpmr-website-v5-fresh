# Contributing to CPMR v5 (`cpmr-website-v5-fresh`)

This repository ships a **static** institutional site (Astro `output: 'static'`). Use the commands in `README.md` for install, build, and preview.

## Authoritative references (read before substantive PRs)

| Topic | Document |
| --- | --- |
| **Content shape, collections, relationships, search contracts, editorial governance** | [`docs/03_architecture/05_content_architecture_and_cms_strategy.md`](docs/03_architecture/05_content_architecture_and_cms_strategy.md) (**doc 05** — authoritative for what belongs in `src/content/`, how IDs and routes relate, and build-time contracts) |
| **UI tokens and forbidden styling patterns** | [`docs/02_design/DESIGN.md`](docs/02_design/DESIGN.md) |
| **Technical stack, routing, and solution architecture** | [`docs/03_architecture/04_architecture.md`](docs/03_architecture/04_architecture.md) |
| **Implementation constitution (static delivery, constraints)** | [`docs/03_architecture/06_project_context.md`](docs/03_architecture/06_project_context.md) |

Editorial and UI work must stay aligned with **doc 05** (content architecture) and **DESIGN.md** (presentation tokens). If guidance conflicts on static delivery, **`06_project_context.md` wins**; then **doc 05** and **DESIGN.md** must be updated to match.

---

## PR review — token compliance checklist (DESIGN.md §0)

Use this list when reviewing **components, layouts, pages, and global styles** (anything that affects Tailwind classes, CSS variables, or inline presentation). The canonical forbidden patterns are in **DESIGN.md §0 — “Forbidden everywhere in component code (zero-tolerance)”**; this section is the **reviewer checklist** tied to that source.

**Authoritative source:** [`docs/02_design/DESIGN.md`](docs/02_design/DESIGN.md) §0.

- [ ] **No raw hex colours** in component code outside DESIGN.md §1 (e.g. reject `#3E7B5C` in templates except where the design contract explicitly allows).
- [ ] **No raw pixel values** for spacing, radius, or shadow outside DESIGN.md §1.
- [ ] **No inline `style="…"`** for colour, spacing, typography, radius, shadow, or z-index.
- [ ] **No Tailwind arbitrary values** for those concerns (e.g. reject `bg-[#…]`, `p-[13px]`, `rounded-[7px]`, arbitrary shadows, `z-[…]`).
- [ ] **No one-off CSS file per component** (token-backed global/theme entry remains the norm per DESIGN.md).
- [ ] **No `outline: none`** without a replacement focus style using the documented `--ring-*` / focus tokens.

If a change needs a value that does not exist in **DESIGN.md §1**, **stop**: extend **DESIGN.md** and the theme mapping first — do not merge ad-hoc literals.

---

## PR review — content and data placement (doc 05)

Cross-check against **`docs/03_architecture/05_content_architecture_and_cms_strategy.md`** so long-lived institutional truth does not drift into presentation-only layers.

- [ ] **Governed prose and collection entries** live under `src/content/` with frontmatter matching the collection contract (see **doc 05 §4** and `src/content.config.ts`).
- [ ] **Structured site data** (navigation aggregates, footer link models, etc.) live under `src/data/` (or the documented compiler pattern), not as one-off strings scattered in unrelated components.
- [ ] **Identifiers** use the **kebab-case ASCII** conventions described in **doc 05** (e.g. `departmentId`, slugs) so future mini-sites, relationships, and search indexing stay consistent.
- [ ] **No new “shadow” content models** in PRs unless **doc 05** and the story map already define the collection or an architect-approved addendum exists.

---

## Merge gate (local)

From the repository root, before opening or updating a PR:

1. `npm run validate`
2. `npm run build`

Failures must be resolved or explicitly called out with programme agreement (do not silently widen scope).
