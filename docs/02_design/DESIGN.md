# CPMR DESIGN.md — Strict Coding-Agent Design Contract

**Project:** Centre for Plant Medicine Research (CPMR) institutional website
**Repository:** `cpmr-website-v5-fresh`
**Document type:** Visual & component design contract (`docs/02_design/`)
**Status:** Authoritative — replaces the prior placeholder
**Locked stack:** Astro `^6.3.1` (`output: 'static'`), TypeScript, Tailwind CSS `^4.3.0` via `@tailwindcss/vite`
**Authoritative inputs:**
- `docs/00_source/CPMR_Institutional_Website_Redesign_Brief.md`
- `docs/01_planning/01_analysis.md`
- `docs/01_planning/02_prd.md`
- `docs/02_design/03_ux_blueprint.md`
- `docs/03_architecture/06_project_context.md`

**Date:** 2026-05-12
**Version:** `1.0.0`

---

## 0. How this document binds the coding agent

This file is the **UI contract**. Any UI work in this repository — components, page sections, layouts, utility classes — **must** resolve every visual decision through a **named token** declared in Section 1. Components without a contract in Sections 13–14 may not be created without first amending this document.

**Strict resolution order when an agent is uncertain:**

1. Token defined in Section 1 wins.
2. If no token applies, **stop and ask** — do not invent values.
3. If a rule in this document conflicts with `06_project_context.md` (the implementation constitution), the **constitution wins**, and this document must be updated to match.

**Forbidden everywhere in component code (zero-tolerance):**

- Raw hex colours (e.g. `#3E7B5C`) outside Section 1.
- Raw pixel values for spacing, radius, or shadow outside Section 1.
- Inline `style="…"` attributes for colour, spacing, typography, radius, shadow, or z-index.
- Tailwind arbitrary values like `bg-[#1F5D45]`, `p-[13px]`, `rounded-[7px]`, `shadow-[0_2px_4px_rgba(0,0,0,.1)]`, `z-[42]`.
- One-off CSS files per component.
- `outline: none` without a replacement focus style from `--ring-*` tokens.

---

## 1. Machine-readable token section

This block is the **source of truth**. Treat as YAML. Any coding agent that generates Tailwind v4 `@theme` mappings, Astro components, or CSS variables must read this block first.

```yaml
# ---------------------------------------------------------------------------
# CPMR Design Tokens v1.0.0
# Consumed at build time by Tailwind v4 @theme directive (see Section 20).
# Every value below is canonical. Do not duplicate, paraphrase, or hardcode.
# ---------------------------------------------------------------------------

meta:
  version: "1.0.0"
  units:
    color: "hex"            # all colours are sRGB hex strings
    space: "rem"            # rem-based, 1rem = 16px root
    radius: "rem"
    shadow: "css"           # css box-shadow string
    duration: "ms"
    zindex: "integer"
  root_font_size_px: 16

color:
  # ---- BRAND (medicinal-plant green) ----
  brand:
    "50":  "#F2F7F4"
    "100": "#E1ECE5"
    "200": "#C1D9C9"
    "300": "#94BCA2"
    "400": "#62997B"
    "500": "#3E7B5C"
    "600": "#2D5F47"   # primary
    "700": "#234C39"
    "800": "#1B3B2D"
    "900": "#142C22"
    "950": "#0B1A14"

  # ---- NEUTRAL (warm-cool slate) ----
  neutral:
    "0":   "#FFFFFF"
    "50":  "#F8F8F6"
    "100": "#EFEEEA"
    "200": "#DDDBD3"
    "300": "#C2BFB3"
    "400": "#9C998B"
    "500": "#757368"
    "600": "#585649"
    "700": "#403F35"
    "800": "#2A2924"
    "900": "#181816"
    "950": "#0E0E0D"

  # ---- ACCENT (warm terracotta — use sparingly per Brief §17.1) ----
  accent:
    "50":  "#FDF5F1"
    "100": "#FAE7DC"
    "200": "#F3CCB7"
    "300": "#E8A684"
    "400": "#DC7E51"
    "500": "#C5602F"   # accent
    "600": "#A14D24"
    "700": "#7E3D1D"

  # ---- SEMANTIC (foreground / background pairs verified ≥ AA contrast) ----
  semantic:
    success_fg: "#1B5E3C"
    success_bg: "#E5F1EA"
    warning_fg: "#7A4F00"
    warning_bg: "#FBF1DA"
    danger_fg:  "#8B1A1A"
    danger_bg:  "#FBE6E6"
    info_fg:    "#1F4B7A"
    info_bg:    "#E4EEF8"

  # ---- SURFACE & TEXT ROLES (resolve to brand/neutral above) ----
  surface:
    page:         "neutral.50"        # body background
    card:         "neutral.0"         # default card surface
    raised:       "neutral.0"
    sunken:       "neutral.100"
    inverse:      "brand.800"         # for inverted strips (footer top, hero overlay)
    overlay:      "rgba(20, 44, 34, 0.72)"  # modal/lightbox scrim, brand.900 @ .72

  text:
    primary:      "neutral.900"
    secondary:    "neutral.700"
    muted:        "neutral.500"
    inverse:      "neutral.50"        # text on dark/brand backgrounds
    link:         "brand.700"
    link_hover:   "brand.800"
    link_visited: "brand.800"
    on_brand:     "neutral.50"        # text placed on brand.600+
    on_accent:    "neutral.0"

  border:
    subtle:       "neutral.200"
    default:      "neutral.300"
    strong:       "neutral.500"
    brand:        "brand.600"
    focus_ring:   "brand.500"
    danger:       "#8B1A1A"

font_family:
  sans:    "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  serif:   "'Source Serif 4', 'Source Serif Pro', Georgia, 'Times New Roman', serif"
  mono:    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"

font_weight:
  regular:  400
  medium:   500
  semibold: 600
  bold:     700

font_size:                # type scale (modular, 1.200 minor third)
  xs:    "0.75rem"        # 12px
  sm:    "0.875rem"       # 14px
  base:  "1rem"           # 16px — body default
  md:    "1.125rem"       # 18px — lede
  lg:    "1.25rem"        # 20px — small headings
  xl:    "1.5rem"         # 24px — h4
  "2xl": "1.875rem"       # 30px — h3
  "3xl": "2.25rem"        # 36px — h2
  "4xl": "2.75rem"        # 44px — h1 default
  "5xl": "3.5rem"         # 56px — hero h1 (lg+ only)

line_height:
  tight:   "1.15"
  snug:    "1.25"
  normal:  "1.5"          # body default
  relaxed: "1.65"
  loose:   "1.8"

letter_spacing:
  tight:   "-0.015em"     # display headings
  normal:  "0"
  wide:    "0.04em"       # all-caps labels (eyebrows)

measure:                  # max line length
  prose: "70ch"
  short: "55ch"

space:                    # spacing scale; rem
  "0":   "0"
  "px":  "1px"
  "0.5": "0.125rem"       # 2px
  "1":   "0.25rem"        # 4px
  "2":   "0.5rem"         # 8px
  "3":   "0.75rem"        # 12px
  "4":   "1rem"           # 16px
  "5":   "1.25rem"        # 20px
  "6":   "1.5rem"         # 24px
  "8":   "2rem"           # 32px
  "10":  "2.5rem"         # 40px
  "12":  "3rem"           # 48px
  "16":  "4rem"           # 64px
  "20":  "5rem"           # 80px
  "24":  "6rem"           # 96px
  "32":  "8rem"           # 128px

layout_width:
  page_max:   "80rem"     # 1280px — overall page max
  content:    "72rem"     # 1152px — standard content width
  prose:      "44rem"     # 704px — long-form text
  narrow:     "36rem"     # 576px — forms, single-column reading
  gutter_x:   "1.5rem"    # mobile horizontal padding (24px)
  gutter_lg:  "2.5rem"    # desktop horizontal padding (40px)
  section_y:  "4rem"      # default vertical rhythm between sections (64px)
  section_y_lg: "6rem"    # large sections (lg+)

radius:
  none: "0"
  sm:   "0.125rem"        # 2px  — chips, small badges
  md:   "0.375rem"        # 6px  — buttons, inputs, cards
  lg:   "0.75rem"         # 12px — quick-access tiles, image frames
  xl:   "1.25rem"         # 20px — hero blocks
  pill: "9999px"          # tags, role chips

shadow:                   # elevation tokens
  e0: "none"
  e1: "0 1px 0 0 rgba(20, 44, 34, 0.06)"
  e2: "0 1px 2px 0 rgba(20, 44, 34, 0.06), 0 1px 3px 0 rgba(20, 44, 34, 0.08)"
  e3: "0 4px 6px -1px rgba(20, 44, 34, 0.08), 0 2px 4px -2px rgba(20, 44, 34, 0.06)"
  e4: "0 12px 24px -8px rgba(20, 44, 34, 0.18), 0 4px 8px -4px rgba(20, 44, 34, 0.10)"
  ring_focus: "0 0 0 3px rgba(62, 123, 92, 0.45)"   # brand.500 @ 45%

z_index:
  base:           0
  raised:         10
  sticky:         30
  header:         40
  mega_panel:     50
  dropdown:       55
  mobile_drawer:  60
  search_overlay: 70
  modal:          80
  toast:          90
  dev_debug:      100

motion:
  duration:
    instant: 0
    fast:    120
    base:    200
    slow:    320
  easing:
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    entrance: "cubic-bezier(0.0, 0.0, 0.2, 1)"
    exit:     "cubic-bezier(0.4, 0.0, 1, 1)"

breakpoint:               # mirrors Tailwind defaults — keep aligned
  sm:   "40rem"           # 640px
  md:   "48rem"           # 768px
  lg:   "64rem"           # 1024px
  xl:   "80rem"           # 1280px
  "2xl": "96rem"          # 1536px

icon:
  size:
    xs: "0.875rem"        # 14px
    sm: "1rem"            # 16px
    md: "1.25rem"         # 20px
    lg: "1.5rem"          # 24px
    xl: "2rem"            # 32px
  stroke_width: 1.75      # default for line icons
```

> **Agent rule (token integrity):** when generating CSS or Tailwind utilities, every literal value must be replaced by a reference into this block (e.g. `color.brand.600`, `space.6`, `radius.md`). If a needed value is not in this block, raise a design-change request — do not invent.

---

## 2. Brand principles

Six rules that govern every visual decision. They are the tie-breakers when the contract is silent.

| # | Principle | Concrete consequence for code |
|---|-----------|-------------------------------|
| BP1 | **Institutional, not promotional** | No gradient blobs, no animated splashes, no "Get started" SaaS language. Headlines are statements of fact. |
| BP2 | **Calm over loud** | Default surface is `surface.page`; cards are outlined first, shadowed only when lift is justified (elevation `e2` max for routine surfaces). |
| BP3 | **Greens & neutrals lead; warm accent is rare** | Accent palette appears on **≤ 1 element per screen** as a rule of thumb. Never colour body text in accent. |
| BP4 | **Readability beats decoration** | Body text ≥ `font_size.base` / line height ≥ `1.5`, measure capped at `measure.prose`. |
| BP5 | **Predictable hierarchy** | Heading levels follow document outline. Never style a `<div>` to look like an `<h2>`. |
| BP6 | **Honest empty states** | No placeholder photos, no Lorem Ipsum at launch. If content is missing, render an empty-state component (see `EmptyState` in §13). |

---

## 3. Color tokens

All colours come from `color.*` in §1. Components reference them by **role**, not by raw scale value, wherever a role exists.

### 3.1 Allowed role tokens (components must use these)

| Role | Resolves to |
|------|-------------|
| `text.primary` | `neutral.900` |
| `text.secondary` | `neutral.700` |
| `text.muted` | `neutral.500` |
| `text.inverse` | `neutral.50` |
| `text.link` | `brand.700` |
| `text.link_hover` | `brand.800` |
| `text.on_brand` | `neutral.50` |
| `text.on_accent` | `neutral.0` |
| `surface.page` | `neutral.50` |
| `surface.card` | `neutral.0` |
| `surface.sunken` | `neutral.100` |
| `surface.inverse` | `brand.800` |
| `surface.overlay` | scrim `rgba(20,44,34,0.72)` |
| `border.subtle` | `neutral.200` |
| `border.default` | `neutral.300` |
| `border.strong` | `neutral.500` |
| `border.brand` | `brand.600` |
| `border.focus_ring` | `brand.500` |

### 3.2 Direct scale tokens (allowed only for surfaces with no semantic role)

`brand.50`–`brand.950`, `neutral.0`–`neutral.950`, `accent.50`–`accent.700`, and the four `semantic.*` pairs are addressable for backgrounds of cards, badges, banners, charts, illustrations.

### 3.3 Forbidden colour usage

- Any hex literal not declared in §1.
- `accent.*` on body text or paragraph backgrounds.
- `brand.300` or lighter on white-equivalent backgrounds for body text (insufficient AA contrast).
- Gradients between unrelated palette families (e.g. brand → accent).
- Colour as the **sole** indicator of state (must pair with icon or text — §15).

### 3.4 Contrast guarantee

Every text-on-surface combination used by components in §13 must meet **WCAG 2.1 AA** (4.5:1 body, 3:1 large text). Approved pairings:

| Foreground | On surface | Status |
|------------|-----------|--------|
| `text.primary` (neutral.900) | `surface.page` (neutral.50) | AA |
| `text.primary` | `surface.card` (neutral.0) | AA |
| `text.secondary` (neutral.700) | `surface.page` | AA |
| `text.muted` (neutral.500) | `surface.page` | AA Large only — use for labels ≥ 18px |
| `text.inverse` (neutral.50) | `surface.inverse` (brand.800) | AA |
| `text.inverse` | `brand.700` | AA |
| `text.on_accent` (neutral.0) | `accent.500` | AA |
| `text.on_accent` | `accent.600` | AA |
| `semantic.success_fg` | `semantic.success_bg` | AA |
| `semantic.warning_fg` | `semantic.warning_bg` | AA |
| `semantic.danger_fg` | `semantic.danger_bg` | AA |
| `semantic.info_fg` | `semantic.info_bg` | AA |

---

## 4. Typography tokens

### 4.1 Font stacks

- **Body & UI:** `font_family.sans` (Inter + system fallbacks).
- **Display / scholarly headings (optional):** `font_family.serif` — only on `Hero` h1 and major institutional page heroes (`DepartmentHero`, About pages). Never below `font_size.xl`.
- **Inline code / data IDs / DOI strings:** `font_family.mono`.

### 4.2 Heading scale

| Token | Used for | Size | Line height | Weight | Letter spacing |
|-------|----------|------|-------------|--------|----------------|
| `h1.hero` | Homepage hero only | `5xl` (lg+) → `4xl` (<lg) | `tight` | `bold` | `tight` |
| `h1.page` | Page primary heading | `4xl` (lg+) → `3xl` | `tight` | `bold` | `tight` |
| `h2` | Section headings | `3xl` (lg+) → `2xl` | `snug` | `semibold` | `normal` |
| `h3` | Subsection headings | `2xl` (lg+) → `xl` | `snug` | `semibold` | `normal` |
| `h4` | Card titles, sub-sub | `xl` | `snug` | `semibold` | `normal` |
| `h5` | Minor groupings | `lg` | `snug` | `semibold` | `normal` |
| `h6` | Smallest formal heading | `base` | `snug` | `semibold` | `wide` (uppercase) |
| `eyebrow` | Pretitle / kicker | `xs` | `snug` | `medium` | `wide` (uppercase) |
| `body.lede` | First paragraph in articles | `md` | `relaxed` | `regular` | `normal` |
| `body` | Default body copy | `base` | `normal` | `regular` | `normal` |
| `body.small` | Captions, helper | `sm` | `normal` | `regular` | `normal` |
| `label` | Form labels, table headers | `sm` | `snug` | `semibold` | `normal` |
| `code.inline` | DOI, IDs | `sm` | `normal` | `regular` | `normal` |

### 4.3 Forbidden typographic patterns

- All-caps blocks longer than 4 words (use `eyebrow` style only on short labels).
- Italic body paragraphs.
- Letter-spaced body text.
- Heading skipping (`h2` → `h4` without `h3`).
- Underlines on non-link text.
- Headings styled with accent colour.

---

## 5. Spacing tokens

Components and layouts must use **only** values from `space.*` in §1. Inter-section vertical rhythm uses `layout_width.section_y` / `section_y_lg`. Inside a card, vertical rhythm steps in `space.4` → `space.6` → `space.8` intervals.

### 5.1 Canonical spacing slots

| Slot | Token | Notes |
|------|-------|-------|
| Card inner padding (mobile) | `space.5` | 20px |
| Card inner padding (lg+) | `space.6` | 24px |
| Section vertical (mobile) | `layout_width.section_y` | 64px |
| Section vertical (lg+) | `layout_width.section_y_lg` | 96px |
| Page horizontal gutter (mobile) | `layout_width.gutter_x` | 24px |
| Page horizontal gutter (lg+) | `layout_width.gutter_lg` | 40px |
| Heading → body gap | `space.3` | 12px |
| Form field vertical gap | `space.4` | 16px |
| Grid gap small (cards) | `space.4` | 16px |
| Grid gap medium (cards) | `space.6` | 24px |
| Grid gap large (hero rows) | `space.8` | 32px |

Forbidden: any spacing value not present in `space.*`, including `space.7`, `space.9`, `space.11` (the scale intentionally skips these to enforce consistency).

---

## 6. Layout width tokens

| Token | Value | Used for |
|-------|-------|----------|
| `layout_width.page_max` | 1280px | Body container max width |
| `layout_width.content` | 1152px | Default content container |
| `layout_width.prose` | 704px | Long-form articles, About pages |
| `layout_width.narrow` | 576px | Forms, single-column reading |

### 6.1 Container rule

Every top-level page section must wrap its content in **exactly one** of `content`, `prose`, or `narrow` containers. `page_max` is the absolute outer cap and is set on `<body>` / root layout — components must not re-declare it.

Forbidden: fixed-width containers in pixels, percentage-based widths above 96vw on lg+, content spanning the full viewport without a `content` wrapper (full-bleed strips like `AnnouncementBand` are explicitly exempted in §13).

---

## 7. Border radius tokens

| Token | Value | Allowed on |
|-------|-------|-----------|
| `radius.none` | 0 | Tables, fee tables, large hero images (when art-directed sharp) |
| `radius.sm` | 2px | `TagChip`, small badges |
| `radius.md` | 6px | `ButtonLink`, form fields, `Card`, `NewsCard`, `EventCard`, `ServiceCard`, `ProductCard`, `DownloadCard`, `SearchBox` |
| `radius.lg` | 12px | `QuickAccessCard`, image frames, `GalleryCard` |
| `radius.xl` | 20px | `Hero` background card, `DepartmentHero` panel |
| `radius.pill` | 9999px | Role chips, filter chips, avatar placeholders |

Forbidden: mixed radii on a single component (e.g. `rounded-tl-lg rounded-br-sm`), any other numeric radius, and `border-radius: 50%` on non-circular avatars.

---

## 8. Shadow / elevation tokens

Elevation is **rare and meaningful**. Default is outlined surfaces (`border.subtle`), not shadowed surfaces.

| Token | Value | Meaning | Allowed on |
|-------|-------|---------|-----------|
| `shadow.e0` | none | Flat | Default for cards, tables, body sections |
| `shadow.e1` | 1px hairline | Sticky header separator | `SiteHeader` when scrolled |
| `shadow.e2` | 2-layer subtle | Interactive lift on hover | Hover state for `Card`, `QuickAccessCard`, `NewsCard`, `EventCard`, `ServiceCard`, `ProductCard`, `DepartmentCard`, `GalleryCard` |
| `shadow.e3` | Floating element | Dropdown menus, popovers | `MegaNavigation` panel, search suggestions dropdown |
| `shadow.e4` | Modal / lightbox | `LightboxDialog`, `SearchPanel` overlay |
| `shadow.ring_focus` | Focus ring | Every interactive element on `:focus-visible` |

Forbidden: shadows on full-width strips (`AnnouncementBand`, `SiteFooter`), shadows on `Table` rows, shadows used purely decoratively on non-interactive elements.

---

## 9. Z-index tokens

Only the values declared in `z_index.*` may appear as `z-index` in styles. Increments outside this scale are forbidden so stacking order remains predictable.

| Token | Value | Layer |
|-------|-------|-------|
| `z_index.base` | 0 | Default flow |
| `z_index.raised` | 10 | Hovered card lift |
| `z_index.sticky` | 30 | In-page sticky elements |
| `z_index.header` | 40 | `SiteHeader` and `UtilityNavigation` row |
| `z_index.mega_panel` | 50 | `MegaNavigation` open panel |
| `z_index.dropdown` | 55 | Inline dropdowns, search suggestions |
| `z_index.mobile_drawer` | 60 | `MobileNavigation` open drawer |
| `z_index.search_overlay` | 70 | Full-screen search overlay |
| `z_index.modal` | 80 | `LightboxDialog`, dialogs |
| `z_index.toast` | 90 | Reserved for Phase 2 |
| `z_index.dev_debug` | 100 | Reserved — never ship in production |

---

## 10. Iconography guidance

- **Library:** Lucide icons (line, 1.75px stroke). No other icon library may be added without amending this document.
- **Size:** Use `icon.size.*` tokens. Default in body text and buttons is `icon.size.md` (20px). Use `icon.size.sm` for chips and inline.
- **Colour:** Inherit from current text colour via `currentColor`. Never colour an icon `accent.*` unless paired with an `accent.*` background.
- **Accessibility:** Icons that are purely decorative require `aria-hidden="true"` and **must** be accompanied by visible text (no icon-only nav links in `UtilityNavigation` — labels are mandatory). Icon-only buttons must carry an `aria-label`.
- **Forbidden:** Emoji as UI icons, filled glyphs for institutional surfaces, animated icons, multi-colour icons (CPMR logo lockup is the only multi-colour mark allowed).

---

## 11. Image treatment guidance

- **Aspect ratios (canonical):**
  - Hero: `21 / 9` (lg+) and `4 / 3` (<lg).
  - Card thumbnails (news/event/research): `3 / 2`.
  - Department feature: `16 / 9`.
  - Staff portrait: `1 / 1`, cropped to head & shoulders.
  - Product: `4 / 5` portrait.
  - Gallery item: `1 / 1` in masonry grids, `3 / 2` in single rows.
- **Treatment:** Natural colour, calm contrast. No duotone overlays except a brand-tinted scrim on hero text overlays (`surface.overlay`).
- **Formats:** Astro's image pipeline outputs WebP/AVIF with JPEG fallback. Components consume `<Image>` (or equivalent) and **must** declare `width`, `height`, and `alt`.
- **Alt text:** Required and meaningful. Decorative images use `alt=""`. Placeholder portraits are forbidden — use the `StaffCard` `initialsFallback` variant instead (§13).
- **Forbidden:** Generic stock photography clichés (handshakes over globes, multicultural team huddles, scientist holding a beaker in a clean white lab) — institutional photography only. No CSS background-image text fills.

---

## 12. Motion and reduced-motion rules

- **Default durations:** UI state transitions use `motion.duration.base` (200ms) with `motion.easing.standard`.
- **Allowed transitions:** opacity, transform (translate ≤ 8px, scale ≤ 1.02), background-color, border-color, box-shadow.
- **Forbidden transitions:** width/height auto, top/left positional changes for layout, parallax scroll effects, animated SVG paths on institutional surfaces.
- **Hero / banner:** No autoplay video, no carousel auto-advance.
- **Reduced motion:** Every component that animates must wrap the rule in `@media (prefers-reduced-motion: reduce)` and reduce to either an instant transition (`duration.instant`) or a pure opacity fade ≤ `duration.fast`. Specifically:
  - Carousels in `DepartmentPreview` or `ResearchHighlightCard` rows: pause auto-advance entirely (the system has no auto-advance anyway — see §13).
  - `Hero` parallax or scale-on-load: disabled.
  - `Accordion` expand/collapse: instant open/close.

---

## 13. Component contracts

Every component listed below **must** be implemented exactly to its contract. Allowed variants are exhaustive — any new variant requires a documented amendment to this section.

Each contract has the same shape:

```
Purpose        — what user job it serves (from UX blueprint).
Anatomy        — required parts and their semantic HTML.
Props/API      — TypeScript-style contract for the Astro component.
Tokens used    — explicit token references.
Allowed variants     — exhaustive list.
Forbidden variants   — explicit no-go list.
Accessibility  — required behaviours and ARIA.
Notes          — content/data origin, breakpoint behaviour.
```

---

### 13.1 `SiteHeader`

**Purpose.** Persistent top chrome that exposes brand, primary navigation, utility navigation, and search affordance on every page.
**Anatomy.** `<header role="banner">` containing the logo lockup (`<a href="/">`), `UtilityNavigation` (lg+ only), `MegaNavigation` (lg+) or `MobileNavigation` trigger (<lg), `SearchBox` trigger.
**Props/API.**
```ts
interface SiteHeaderProps {
  currentPath: string;       // active route for aria-current
  variant?: 'default' | 'compact';   // 'compact' used post-scroll
  showUtility?: boolean;     // default true on lg+
}
```
**Tokens used.** `surface.card` (background), `border.subtle` (bottom border), `shadow.e1` on `variant=compact`, `z_index.header`, `space.4` vertical padding, `layout_width.content`.
**Allowed variants.** `default`, `compact` (sticky condensed state).
**Forbidden variants.** Transparent over hero (text-on-image issues), centred logo, search-inline-replacing-nav, dark-mode-only.
**Accessibility.** Single `<header>` per page; `<nav aria-label="Primary">` wraps mega nav; `<nav aria-label="Utility">` wraps utility row; logo is the first focusable item after the skip-link.
**Notes.** Component is consumed from `BaseLayout`. Logo asset and site name come from `src/data/site.yml`.

---

### 13.2 `UtilityNavigation`

**Purpose.** One-click access to high-frequency operational destinations (Clinic, DAU, Downloads, Publications, Contact, Search) — UX Blueprint §4.
**Anatomy.** `<nav aria-label="Utility">` containing a horizontal `<ul>` of `<a>` items plus a trailing search trigger button.
**Props/API.**
```ts
interface UtilityItem {
  label: string;       // mandatory visible label
  href: string;
  external?: boolean;
}
interface UtilityNavigationProps {
  items: UtilityItem[];
  currentPath: string;
}
```
**Tokens used.** `text.secondary` default, `text.primary` hover, `border.focus_ring` ring, `font_size.sm`, `space.4` item gap, `z_index.header`.
**Allowed variants.** `desktop-row` (lg+), `mobile-list` (used inside `MobileNavigation` drawer at the top — see §13.4).
**Forbidden variants.** Icon-only (no labels), hover-only dropdowns from utility items, marketing call-to-action button placed in utility (e.g. "Donate Now").
**Accessibility.** Current page indicator: `aria-current="page"` and visible underline. Search trigger uses `aria-haspopup="dialog"` and opens `SearchBox` overlay.
**Notes.** Item list lives in `src/data/navigation.yml` under `utility:`. Search item is hardcoded in the component because it triggers behaviour, not navigation.

---

### 13.3 `MegaNavigation`

**Purpose.** Reveal depth of CPMR's institutional structure to lg+ users — UX Blueprint §5.
**Anatomy.** Horizontal list of `<button>` triggers, each controlling a full-width `<div role="region">` panel positioned below the header. Panel contains 3–4 columns of grouped `<ul>` link lists. Each group has a non-link `<h3>` group title.
**Props/API.**
```ts
interface MegaGroup {
  title: string;
  links: { label: string; href: string }[];
  viewAllHref?: string;       // shown if links.length > 7
}
interface MegaSection {
  label: string;              // top-level item ("About CPMR")
  href: string;               // hub page
  groups: MegaGroup[];
}
interface MegaNavigationProps {
  sections: MegaSection[];
  currentPath: string;
}
```
**Tokens used.** `surface.card` panel background, `shadow.e3`, `radius.md` panel corners, `border.subtle`, `z_index.mega_panel`, `space.6` column gap, `space.4` link vertical gap, `font_size.sm` group title (semibold), `text.primary` links.
**Allowed variants.** `default` (3-column), `wide` (4-column for `Research` and `Departments` only).
**Forbidden variants.** Hover-only open (must support keyboard), nested flyouts (max 1 level of depth), animated icons inside panels, image tiles inside groups, dark panel on light page (would conflict with `text.primary` token).
**Accessibility.**
- Triggers are `<button aria-expanded="…" aria-controls="…">`.
- Open panel: only one panel may be open at a time. Closing happens on `Escape` and on focus leaving the panel.
- `Tab` cycles into the panel; `Shift+Tab` returns to the trigger.
- Group titles are real `<h3>` elements for screen-reader rotor navigation.
- Panel is rendered in DOM order immediately after its trigger.

**Notes.** Section data lives in `src/data/navigation.yml` under `mega:`. Component is **rendered only on `lg+`** via Tailwind responsive classes; below `lg`, `MobileNavigation` takes over (see §13.4).

---

### 13.4 `MobileNavigation`

**Purpose.** Provide complete primary + utility navigation on <lg viewports — UX Blueprint §6.
**Anatomy.**
1. Hamburger `<button aria-expanded aria-controls>` in `SiteHeader`.
2. Full-height drawer `<dialog>` (or modal `<div role="dialog" aria-modal="true">`) sliding from the right edge.
3. Inside drawer: utility list at top under heading "Quick links", then primary IA as `<details>` accordion sections.
**Props/API.**
```ts
interface MobileNavigationProps {
  utility: UtilityItem[];
  sections: MegaSection[];
  currentPath: string;
}
```
**Tokens used.** `surface.card` background, `surface.overlay` scrim, `z_index.mobile_drawer`, `space.5` item padding, `font_size.base` items.
**Allowed variants.** `right-slide` (default).
**Forbidden variants.** Full-screen takeover without a close button, push-content (shifting page horizontally), bottom-sheet (reserved for Phase 2).
**Accessibility.**
- `inert` applied to the rest of the page while open.
- Focus moves to the close button on open; trapped inside drawer; returns to trigger on close.
- Each accordion section is a real `<details>`/`<summary>` or `<button aria-expanded>` pattern.
- Minimum tap target 44×44px on every link.
- `prefers-reduced-motion`: instant open, no slide animation.
**Notes.** Render the drawer in DOM once; do not portal across multiple roots.

---

### 13.5 `SiteFooter`

**Purpose.** Deep institutional navigation, contact surfacing, legal/meta — UX Blueprint §23.
**Anatomy.** `<footer role="contentinfo">` with two zones: (1) deep multi-column nav grid (4–7 columns lg+, single-column accordion <md), (2) meta row with copyright, accessibility statement link, sitemap link.
**Props/API.**
```ts
interface FooterColumn {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}
interface FooterContact {
  address: string[];
  phone?: string;
  email?: string;
  mapHref?: string;
  hours?: string[];
}
interface SiteFooterProps {
  columns: FooterColumn[];       // 4–7 columns
  contact: FooterContact;
  socialLinks?: { platform: string; href: string }[]; // optional, omit row entirely if empty
  copyrightYear: number;
  metaLinks: { label: string; href: string }[];
}
```
**Tokens used.** `surface.inverse` (background `brand.800`), `text.inverse` text, `text.on_brand` links, `border.subtle` for divider, `space.10` top/bottom padding, `font_size.sm` for meta row.
**Allowed variants.** `default` (full deep footer). No `slim` variant in v1 — institutional footer is always deep.
**Forbidden variants.** Light footer (would not differentiate from page), social-icon-only rows without labels, footer with a newsletter signup form (MVP — see PRD §31), legal links repeated in deep columns.
**Accessibility.** Social icon links carry `aria-label`. Address is wrapped in `<address>`. Meta links are a `<nav aria-label="Footer meta">`.
**Notes.** Column data lives in `src/data/navigation.yml` under `footer:`; contact lives in `src/data/site.yml`.

---

### 13.6 `Breadcrumbs`

**Purpose.** Locate the user inside deep IA, especially department mini-sites and research sub-trees — UX Blueprint §9.3.
**Anatomy.** `<nav aria-label="Breadcrumb"><ol>` with `<li>` items, the last item is the current page (no link, `aria-current="page"`).
**Props/API.**
```ts
interface Crumb { label: string; href?: string; }
interface BreadcrumbsProps {
  items: Crumb[];   // minimum 2 (Home + current); current item omits href
  separator?: 'chevron' | 'slash';   // visual only
}
```
**Tokens used.** `font_size.sm`, `text.secondary` for links, `text.primary` for current, `space.2` between items.
**Allowed variants.** `chevron` (default), `slash`.
**Forbidden variants.** Dropdown breadcrumbs, icon-prefixed Home (decorative icons drift), wrap-to-multiple-lines without ellipsis (avoid mid-word wrap on mobile by abbreviating with `…` after 2 levels).
**Accessibility.** Home is always the first crumb. Current page has `aria-current="page"`.

---

### 13.7 `Hero`

**Purpose.** Homepage and major hub heroes — UX Blueprint §7 H1, §16.1, §17.1.
**Anatomy.** `<section>` containing optional `eyebrow`, an `h1`, an optional lede paragraph, an optional single `ButtonLink`, and an optional background image with `surface.overlay` scrim if text is laid over the image.
**Props/API.**
```ts
interface HeroProps {
  eyebrow?: string;
  title: string;            // becomes h1
  lede?: string;            // ≤ 2 sentences
  primaryAction?: { label: string; href: string };
  image?: { src: string; alt: string; width: number; height: number };
  variant?: 'centered' | 'split';
  surface?: 'page' | 'inverse';   // controls text colour mapping
}
```
**Tokens used.** `h1.hero` typography, `space.10`/`space.12` block padding, `radius.xl` if image is framed, `surface.overlay` scrim, `font_family.serif` allowed on title only.
**Allowed variants.** `centered` (text centred, optional image as background), `split` (text left, image right on lg+, stacked below `md`).
**Forbidden variants.** Multiple CTAs (max one — Brief §11 / PRD §8 H13), autoplay video background, animated typing/parallax, full-bleed accent-coloured backgrounds, hero spanning > 70vh.
**Accessibility.** Image with text overlay must pass AA contrast against `surface.overlay`; if image is decorative, `alt=""` and add an accessible name through the heading. No `<h1>` other than this on the page.

---

### 13.8 `QuickAccessCard`

**Purpose.** Single tile in homepage Quick Access grid (Clinic / DAU / Departments / Publications / Products / Contact) — UX Blueprint §7 H2.
**Anatomy.** `<a class="qac">` containing icon, `h3` label, short helper line, and a trailing arrow icon.
**Props/API.**
```ts
interface QuickAccessCardProps {
  label: string;
  helper?: string;          // ≤ 60 chars
  href: string;
  icon: IconName;           // from approved Lucide set
  tone?: 'neutral' | 'brand';
}
```
**Tokens used.** `surface.card` background (`tone=neutral`) or `brand.50` (`tone=brand`), `border.subtle` border, `radius.lg`, `space.6` padding, hover lift via `shadow.e2`, `text.primary` label, `text.secondary` helper.
**Allowed variants.** `tone=neutral` (default), `tone=brand` (used for the **single** highest-priority tile per row — usually Clinic on homepage).
**Forbidden variants.** Accent background, full-bleed photo card, two icons per card, label below 14px, more than one `tone=brand` card per grid (`brand` highlight loses meaning if reused).
**Accessibility.** Whole card is a single `<a>`; no nested interactive elements. `aria-label` falls back to label.

---

### 13.9 `AnnouncementBand`

**Purpose.** Homepage announcements strip and site-wide governance notices — UX Blueprint §7 H3, §19.2.
**Anatomy.** Full-bleed `<aside role="region" aria-label="Announcement">` strip with priority dot/icon, message text, optional inline link, optional dismiss button (only if `dismissible=true`).
**Props/API.**
```ts
interface AnnouncementBandProps {
  message: string;
  priority: 'info' | 'warning' | 'critical';
  link?: { label: string; href: string };
  dateRange?: { start: string; end: string };  // ISO dates; component hides itself outside range at build
  dismissible?: boolean;     // default false for 'critical'
}
```
**Tokens used.** Maps priority to semantic pair: `info`→`semantic.info_*`, `warning`→`semantic.warning_*`, `critical`→`semantic.danger_*`. `font_size.sm`, `space.3` vertical padding, `z_index.sticky` if used as a top strip.
**Allowed variants.** `priority` values listed above.
**Forbidden variants.** Promotional/marketing announcements ("Sale!" etc.), accent-coloured background, modal-style announcement, sticky-while-scrolling on critical (would obscure content — use sticky only on routine `info`).
**Accessibility.** Priority is conveyed by colour **and** by a leading icon and a screen-reader-only "Priority: warning" label. Dismiss button is a real `<button aria-label="Dismiss announcement">`.

---

### 13.10 `ResearchHighlightCard`

**Purpose.** Surface a research project or theme on the homepage research highlights row — UX Blueprint §7 H5, §9.2.
**Anatomy.** `<article>` with thumbnail image (`3 / 2`), `eyebrow` (research area), `h3` title, 2-line excerpt, `text.muted` department tag, footer with "Read project" `ButtonLink ghost`.
**Props/API.**
```ts
interface ResearchHighlightCardProps {
  href: string;
  title: string;
  area: string;             // therapeutic / research area
  excerpt: string;
  department?: { label: string; href: string };
  image?: { src: string; alt: string; width: number; height: number };
}
```
**Tokens used.** `surface.card`, `border.subtle`, `radius.md`, `space.5` padding, hover `shadow.e2`, `h4` title.
**Allowed variants.** `default` (with image), `imageless` (when image asset is unverified — uses a brand-tinted geometric fallback block).
**Forbidden variants.** Accent-coloured frame, animated reveal of excerpt, stat-counter overlay, image-only card (must have text).
**Accessibility.** Card-wide hit area is achieved via stretched-link on the title `<a>` — not by wrapping the whole `<article>` in an `<a>`. Department tag is a separate focusable link with its own focus ring.

---

### 13.11 `ServiceCard`

**Purpose.** Represent a single service (Clinic, DAU, etc.) in Services hub and homepage Services Preview — UX Blueprint §15.
**Anatomy.** `<article>` with icon (medical/lab-themed), `h3` title, 1-line description, "Hours today" inline (if service exposes structured hours), `ButtonLink primary` link.
**Props/API.**
```ts
interface ServiceCardProps {
  href: string;
  title: string;
  summary: string;
  icon: IconName;
  hoursToday?: string;      // pre-resolved at build from service.yml
  priority?: 'standard' | 'featured';
}
```
**Tokens used.** `surface.card` (`standard`) or `brand.50` (`featured`), `border.subtle` / `border.brand` (featured), `radius.md`, `space.6` padding, hover `shadow.e2`.
**Allowed variants.** `priority=standard`, `priority=featured` (Clinic and DAU only).
**Forbidden variants.** Three or more featured cards in one row, accent backgrounds, fee preview inline (use `Table` on the service page instead).
**Accessibility.** Icon is `aria-hidden`. Hours line uses `<time>` if datetime-machine-readable.

---

### 13.12 `ProductCard`

**Purpose.** Represent a product within a category page or homepage Products Preview — UX Blueprint §18.
**Anatomy.** `<article>` with `4 / 5` portrait image, `h3` product name, 1-line description, "Enquire" `ButtonLink ghost` (no "Add to cart" in MVP).
**Props/API.**
```ts
interface ProductCardProps {
  href: string;             // product detail page
  name: string;
  shortDescription: string;
  image: { src: string; alt: string; width: number; height: number };
  category: 'capsules' | 'decoctions' | 'ointments' | 'powders' | 'roots' | 'teas';
  enquiryHref: string;      // mailto: or contact form anchor — resolved at build
}
```
**Tokens used.** `surface.card`, `border.subtle`, `radius.md`, `space.5` padding, image radius `radius.md`.
**Allowed variants.** `default` only.
**Forbidden variants.** Price tag display (MVP — PRD §17), "Add to cart" button, sale-style accent ribbons, discount badges, rating stars.
**Accessibility.** Required disclaimer text appears once per **category page** (not per card) via `disclaimer.yml` content, so cards remain calm; the card itself must not visually shout health claims.

---

### 13.13 `NewsCard`

**Purpose.** News listing item and homepage news strip — UX Blueprint §19.1.
**Anatomy.** `<article>` with thumbnail (`3 / 2` optional), category chip, `h3` title (stretched link), date (`<time datetime>`), 2-line excerpt, optional related department chip.
**Props/API.**
```ts
interface NewsCardProps {
  href: string;
  title: string;
  date: string;             // ISO 8601
  category: string;
  excerpt: string;
  image?: { src: string; alt: string; width: number; height: number };
  department?: { label: string; href: string };
}
```
**Tokens used.** `surface.card`, `border.subtle`, `radius.md`, `space.5` padding, `text.muted` for date, `radius.pill` for category chip, `font_size.sm` for chip.
**Allowed variants.** `default` (with image), `compact` (text-only listing rows).
**Forbidden variants.** Auto-rotating featured-news carousel that hides items, social share buttons on the card (only on the article detail page).
**Accessibility.** Date is a real `<time>` element; the human-readable date string is the content.

---

### 13.14 `EventCard`

**Purpose.** Event in events listing and homepage news/events split — UX Blueprint §19.3.
**Anatomy.** `<article>` with date block (large day + month), `h3` title (stretched link), datetime via `<time datetime>`, venue, status chip ("Upcoming" / "Past" / "Cancelled"), optional registration link.
**Props/API.**
```ts
interface EventCardProps {
  href: string;
  title: string;
  startDateTime: string;    // ISO 8601 with timezone
  endDateTime?: string;
  venue: string;
  status: 'upcoming' | 'past' | 'cancelled';
  registration?: { label: string; href: string; external?: boolean };
  department?: { label: string; href: string };
}
```
**Tokens used.** `surface.card`, `border.subtle`, `radius.md`, status chip uses `semantic.info_*` / `text.muted` / `semantic.danger_*`.
**Allowed variants.** `default`, `featured` (slightly larger, used for the next major event on the homepage).
**Forbidden variants.** Countdown timers (PRD §31 — Phase 2 if at all), price/ticket badges (institutional events — not commercial), accent-coloured date blocks.
**Accessibility.** Status is communicated by chip text **and** by an `aria-label` on cancelled events; cancelled events visually use strikethrough on the title but not on the venue.

---

### 13.15 `DepartmentHero`

**Purpose.** Department landing page hero — UX Blueprint §11.1.
**Anatomy.** Two-column block on lg+ (stacked <md): left column has `eyebrow` "Department", `h1.page` department name, lede (1–2 sentences), `Head of Department` mini-card (photo, name, title); right column has primary actions list (`Contact`, `Downloads`, `Our staff`, `Our projects`) rendered as a vertical `ButtonLink ghost` stack.
**Props/API.**
```ts
interface DepartmentHeroProps {
  departmentName: string;
  lede: string;
  head?: { name: string; title: string; photo?: { src: string; alt: string; width: number; height: number } };
  primaryActions: { label: string; href: string }[];   // 2–4 items
}
```
**Tokens used.** `radius.xl` outer panel, `surface.card`, `border.subtle`, `space.8`/`space.10` padding, `font_family.serif` allowed on the department name (h1).
**Allowed variants.** `with-head` (default), `without-head` (used until photo/info is verified — falls back to initials block).
**Forbidden variants.** Full-bleed photo banner with overlaid text (loses calm tone), hero CTAs that scroll-spy to anchors (use real routes), accent background.
**Accessibility.** `<h1>` is the department name; the page must not declare another `<h1>` anywhere.

---

### 13.16 `DepartmentTabs`

**Purpose.** Local navigation inside a department mini-site (Home, Staff, Projects, Publications, Services, News, Contact) — UX Blueprint §10.2.
**Anatomy.** `<nav aria-label="Department sections">` containing horizontal `<a>` items styled as tabs. Current item carries `aria-current="page"`.
**Props/API.**
```ts
interface DepartmentTabItem { label: string; href: string; }
interface DepartmentTabsProps {
  departmentSlug: string;
  items: DepartmentTabItem[];     // 5–9 items, derived from data
  currentPath: string;
}
```
**Tokens used.** `border.default` bottom rail, `border.brand` underline for current, `font_size.sm`, `space.4` horizontal gap, sticky on lg+ at `z_index.sticky` after the department hero.
**Allowed variants.** `desktop-row` (default), `mobile-scroll` (horizontal scroll with visible left/right edge fade — used <md).
**Forbidden variants.** Hidden overflow menu (loses discoverability), dropdown-style tabs, accent-coloured current state.
**Accessibility.** These are **navigation links**, not WAI-ARIA tabs — do not apply `role="tab"`. Horizontal scroll on mobile must be keyboard-operable (focus moves the scroll position into view).

---

### 13.17 `StaffCard`

**Purpose.** Researcher or staff member in directory listings — UX Blueprint §12.
**Anatomy.** `<article>` with portrait (`1 / 1`), name (`h3`, stretched link), role/title, department tag, optional expertise chips (max 3 visible), "Profile" link.
**Props/API.**
```ts
interface StaffCardProps {
  href: string;
  name: string;
  title: string;
  department?: { label: string; href: string };
  photo?: { src: string; alt: string; width: number; height: number };
  expertise?: string[];     // first 3 shown, rest collapsed visually
  initialsFallback: string; // e.g. "A.B." — required for accessibility when no photo
}
```
**Tokens used.** `surface.card`, `border.subtle`, `radius.md`, portrait `radius.md`, expertise chips `radius.pill`, `space.5` padding.
**Allowed variants.** `with-photo` (default), `initials` (when photo is unverified — uses neutral-200 background and `brand.700` initials).
**Forbidden variants.** Stock-photo silhouettes, decorative ring frames around portraits, personal phone number display (institutional contact only), social media icons under names.
**Accessibility.** Initials placeholder must have `aria-hidden="true"` on the visual block and a screen-reader name from the card heading.

---

### 13.18 `PublicationItem`

**Purpose.** Single row in a publications list — UX Blueprint §12, §13.
**Anatomy.** `<article>` rendered as a list row (not a card): year on the left (large, `text.muted`), then title (`h3`, stretched link), authors (1 line, ellipsis), excerpt (1–2 lines optional), DOI/external link icon, optional PDF download `ButtonLink ghost-small`.
**Props/API.**
```ts
interface PublicationItemProps {
  title: string;
  authors: string[];
  year: number;
  href?: string;            // internal detail page if exists
  doi?: string;             // resolved to https://doi.org/{doi}
  externalUrl?: string;
  pdfUrl?: string;
  pdfBytes?: number;
  department?: { label: string; href: string };
  excerpt?: string;
}
```
**Tokens used.** `border.subtle` row divider, `space.4` vertical padding, `font_family.mono` for DOI, `text.secondary` authors, `text.muted` year.
**Allowed variants.** `default`, `compact` (homepage / department teaser — drops excerpt and DOI line).
**Forbidden variants.** Card-style boxed publications (lists scale better), star/like buttons, citation-export buttons in MVP (PRD §31).
**Accessibility.** External link icon has `aria-label="opens external site"`; PDF link declares file type and size in visible text.

---

### 13.19 `SearchBox`

**Purpose.** Site-wide search trigger and input — UX Blueprint §21.
**Anatomy.** Two presentations:
- **Trigger button** in `SiteHeader` / `UtilityNavigation`: `<button aria-haspopup="dialog" aria-label="Open search">`.
- **Overlay panel** when opened: `<div role="dialog" aria-modal="true" aria-label="Search the site">` containing a `<form>` with `<label class="sr-only">`, `<input type="search">`, submit button, optional live suggestions list.
**Props/API.**
```ts
interface SearchBoxProps {
  placeholder?: string;     // default: "Search CPMR…"
  endpoint?: string;        // default '/search/' (static results page)
  enableSuggestions?: boolean;  // requires prebuilt index in dist/
}
```
**Tokens used.** `surface.card` panel, `border.default` input border (focus → `border.brand` + `shadow.ring_focus`), `radius.md`, `surface.overlay` scrim, `z_index.search_overlay`, `space.5` padding.
**Allowed variants.** `header-trigger`, `inline` (used inside `MobileNavigation` drawer top), `results-page` (inline on `/search/` results page — visible without scrim).
**Forbidden variants.** Inline search bar permanently expanded in the desktop header (consumes nav real estate), search input without a `<label>`, voice-input toggle in MVP.
**Accessibility.** Focus moves to the input on open. `Escape` closes the overlay and returns focus to the trigger. Submit on `Enter` even if suggestions list is open.

---

### 13.20 `SearchResultCard`

**Purpose.** A single result on `/search/` — UX Blueprint §21.2.
**Anatomy.** `<article>` with content-type chip (`Page`, `Department`, `Staff`, etc.), breadcrumb path (text-only), `h3` title (stretched link), 1–2-line excerpt with matched terms highlighted via `<mark>`.
**Props/API.**
```ts
type SearchResultType = 'page' | 'department' | 'staff' | 'service' | 'publication' | 'project' | 'download' | 'product' | 'news' | 'event';
interface SearchResultCardProps {
  href: string;
  title: string;
  type: SearchResultType;
  breadcrumb: string[];     // e.g. ['Departments', 'Phytochemistry']
  excerpt: string;          // may contain <mark> tags from the index step — sanitized
}
```
**Tokens used.** `border.subtle` row divider (not a boxed card — list rhythm), `space.5` vertical padding, chip uses `surface.sunken` background + `text.secondary`, `<mark>` styles use `accent.100` background + `text.primary`.
**Allowed variants.** `default` only.
**Forbidden variants.** Boxed cards that break list scannability, scoring/relevance numbers (institutional, not Google), thumbnail-led results (varied content types make grids inconsistent).
**Accessibility.** `<mark>` requires no extra ARIA. Chip text is the accessible name of the content type.

---

### 13.21 `GalleryCard`

**Purpose.** Single album entry on the gallery index — UX Blueprint §20.1.
**Anatomy.** `<article>` with cover image (`1 / 1` or `3 / 2` depending on grid), title (`h3`), image count, date.
**Props/API.**
```ts
interface GalleryCardProps {
  href: string;
  title: string;
  cover: { src: string; alt: string; width: number; height: number };
  itemCount: number;
  date?: string;            // ISO 8601
  aspect?: '1/1' | '3/2';
}
```
**Tokens used.** `surface.card`, `border.subtle`, `radius.lg`, image radius `radius.lg`, hover `shadow.e2`, `text.muted` for count/date.
**Allowed variants.** `aspect=1/1`, `aspect=3/2`.
**Forbidden variants.** Auto-playing video preview on hover, overlay-text-on-image without scrim, multiple thumbnails stacked (use the album page).
**Accessibility.** Cover image alt should describe the album subject ("Field site, Aburi botanical gardens, March 2026") not the file (`IMG_2031.jpg`).

---

### 13.22 `DownloadCard`

**Purpose.** Single document in the downloads centre and department downloads sections — UX Blueprint §22.2.
**Anatomy.** `<article>` rendered as a list row: file-type icon (PDF/DOC/XLS based on extension), title (`h3`, stretched link), short description, metadata row (type, size, date, owning unit), download `<a>` with explicit "Download" action label.
**Props/API.**
```ts
interface DownloadCardProps {
  href: string;             // direct file URL — must exist at build time
  title: string;
  description?: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'zip';
  bytes: number;
  date: string;             // ISO 8601 (last updated)
  owner?: { label: string; href?: string };
}
```
**Tokens used.** `border.subtle` row divider, `space.4` padding, `text.muted` metadata, `radius.sm` for file-type chip.
**Allowed variants.** `row` (default on listing pages), `compact` (used inside `DepartmentHero` right rail and FAQ pages).
**Forbidden variants.** Card-style boxed downloads in long lists, lock icons / paywalls, "click to copy" sharing buttons.
**Accessibility.** Visible text states file type and size: e.g. "Annual Report 2025 (PDF, 2.4 MB)". If the file is missing at build, the build must fail (see §15) — never render a broken download link.

---

### 13.23 `ButtonLink`

**Purpose.** All non-form actions: navigation, downloads, external links, anchor scrolls. (Form `<button type="submit">` styling follows the same tokens but is contractually a separate component to be added when forms land — PRD §29.)
**Anatomy.** Always renders as an `<a>` (since destinations are routes or files, not form submissions).
**Props/API.**
```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
interface ButtonLinkProps {
  href: string;
  label: string;            // visible text — required
  variant?: ButtonVariant;  // default 'primary'
  size?: ButtonSize;        // default 'md'
  iconLeading?: IconName;
  iconTrailing?: IconName;
  external?: boolean;       // adds external-link icon + rel="noopener noreferrer" + aria-label suffix
  fullWidth?: boolean;      // for mobile contexts only
}
```
**Tokens used.**
- `primary`: background `brand.600`, text `text.on_brand`, hover `brand.700`, focus `shadow.ring_focus`.
- `secondary`: background `surface.card`, border `border.brand`, text `text.link`, hover background `brand.50`.
- `ghost`: no background, text `text.link`, hover background `brand.50`.
- `link`: underlined text only, no padding, follows `text.link` / `text.link_hover`.
- Sizes use padding from `space.*`: `sm` → `space.2`/`space.3`, `md` → `space.3`/`space.5`, `lg` → `space.4`/`space.6`. Radius is always `radius.md` (or none for `link`).
**Allowed variants.** `primary`, `secondary`, `ghost`, `link`.
**Forbidden variants.** Accent-coloured primary buttons (the warm accent must never compete with the primary action affordance), gradient buttons, full-width on desktop (`fullWidth` is mobile-only), pill-shaped buttons (use `radius.md`), tertiary CTA stacks longer than two buttons.
**Accessibility.** External links: visible icon and `aria-label="{label} (opens external site)"`. Icon-only buttons are forbidden — every button must have visible text.

---

### 13.24 `SectionHeader`

**Purpose.** Consistent section heading block above page sections and listings — UX Blueprint §7, §9.
**Anatomy.** `<header>` inside the section containing optional `eyebrow`, `h2` (or `h3`), optional short description, optional "View all" `ButtonLink ghost` on the right (lg+) or below (<md).
**Props/API.**
```ts
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAll?: { label: string; href: string };
  level?: 2 | 3;            // default 2
  align?: 'start' | 'center'; // default 'start'
}
```
**Tokens used.** `h2`/`h3` typography, `eyebrow` style, `text.secondary` for description, `space.6` bottom margin to following content.
**Allowed variants.** `align=start` (default), `align=center` (only on the homepage hero-adjacent sections).
**Forbidden variants.** Two "View all" links, decorative dividers around the title, multi-line eyebrows, accent-coloured title.
**Accessibility.** Heading level must follow the document outline — never use `level=2` inside a `<section>` already nested under another `level=2` without an intervening section break.

---

### 13.25 `Card`

**Purpose.** Generic container for arbitrary content blocks. All specialised cards (Quick Access, News, Event, etc.) inherit this skeleton.
**Anatomy.** `<article>` or `<div>` with optional `media` slot (image/illustration), `body` slot (content), `footer` slot (actions).
**Props/API.**
```ts
type CardSurface = 'card' | 'sunken' | 'brand-soft';
type CardElevation = 'flat' | 'outline' | 'hover-lift';
interface CardProps {
  surface?: CardSurface;     // 'card' default
  elevation?: CardElevation; // 'outline' default
  padding?: '4' | '5' | '6' | '8';   // maps to space tokens
  radius?: 'md' | 'lg';      // default 'md'
  as?: 'article' | 'div';    // default 'article'
}
```
**Tokens used.** `surface.card` / `surface.sunken` / `brand.50` (`brand-soft`). Border via `border.subtle` when `elevation=outline`. Hover shadow `shadow.e2` when `elevation=hover-lift` and the card is wrapped by a stretched link.
**Allowed variants.** Combinations of the surfaces, elevations, paddings, and radii above.
**Forbidden variants.** `accent-soft` background (no accent for whole cards), `xl` radius (reserved for `Hero` / `DepartmentHero`), shadow `e3` or `e4` (reserved for floating UI), inset shadows, multi-coloured borders.
**Accessibility.** When a card is wholly clickable, use the stretched-link pattern on the title `<a>`. Do not nest interactive elements inside an `<a>`.

---

### 13.26 `Table`

**Purpose.** Tabular data — fees, hours, staff lists, sample types, etc. — UX Blueprint §15.3.
**Anatomy.** `<table>` with `<caption>` (visually shown or sr-only), `<thead>`, `<tbody>`, optional `<tfoot>`. Header cells use `<th scope>`. On <md, the component renders a **stacked** presentation (each row becomes a definition list of label→value) — implemented in CSS using `data-label` attributes on `<td>`.
**Props/API.**
```ts
interface TableColumn {
  key: string;
  header: string;
  align?: 'start' | 'end' | 'center';
  numeric?: boolean;        // right-aligns and uses tabular-nums
}
interface TableRow { [key: string]: string | number | { label: string; href: string } }
interface TableProps {
  caption: string;
  captionVisible?: boolean;   // default true
  columns: TableColumn[];
  rows: TableRow[];
  responsive?: 'stack' | 'scroll';  // default 'stack'
  lastUpdated?: string;       // ISO date — rendered as footer note
}
```
**Tokens used.** `border.subtle` row dividers, `space.3`/`space.4` cell padding, `text.secondary` for column headers, `font_size.sm`, `font.tabular-nums` for numeric columns, `radius.none` (tables are never rounded).
**Allowed variants.** `responsive=stack` (default — stacks below `md`), `responsive=scroll` (used only when columns ≥ 6 and stacking would lose meaning; first column sticks).
**Forbidden variants.** Zebra striping below 5 rows, sortable column headers in MVP (Phase 2 — PRD §31), images embedded in cells, nested tables, tables of contents styled as `Table`.
**Accessibility.** Caption is required. Numeric columns use `text-align: end` and `font-variant-numeric: tabular-nums`. The "Last updated" footer renders as `<tfoot>` containing a single full-width row.

---

### 13.27 `FAQAccordion`

**Purpose.** Frequently asked questions on service pages and the Resources hub — UX Blueprint §15.2 (block 7), §16.2.
**Anatomy.** `<section aria-labelledby="…">` containing repeated `<details>` elements, each with a `<summary>` (the question, behaves as a `<button>`) and answer body.
**Props/API.**
```ts
interface FAQItem { question: string; answer: string; /* answer is rendered HTML from content */ }
interface FAQAccordionProps {
  heading: string;
  items: FAQItem[];
  defaultOpenIndex?: number;   // none open by default; 0 to open first
}
```
**Tokens used.** `border.subtle` between items, `space.4`/`space.5` vertical padding, `radius.none` (clean list), chevron icon `icon.size.sm` rotated via transform.
**Allowed variants.** `default` (all collapsed), `single-open` (radio behaviour — only one open at a time; implemented with the `name` attribute on `<details>` per HTML spec).
**Forbidden variants.** Custom JS-only accordions when `<details>` suffices, nested accordions, accordions inside accordions, animations that overshoot the content height, accordions used as primary navigation.
**Accessibility.** Native `<details>`/`<summary>` provides keyboard and AT support; do not add `role="button"` to `<summary>`. Heading above the accordion is required for screen-reader landmarks.

---

## 14. Page section contracts

Page-level compositions of components. The Astro layouts must follow these structures.

### 14.1 Homepage section sequence

Order is fixed. Sections may be hidden via content flags but **must not** be reordered without amending this contract.

| Order | Section ID | Component(s) | Content origin |
|------|-----------|--------------|----------------|
| 1 | `home.hero` | `Hero` (variant `centered`) | `src/content/home/hero.md` |
| 2 | `home.quickAccess` | 6× `QuickAccessCard` in a 2×3 grid (md+) / 1×6 stack (<md) | `src/data/quick-access.yml` (max 6 items) |
| 3 | `home.announcement` | `AnnouncementBand` × 0–1 | `src/content/announcements/*.md` (max 1 surfaced) |
| 4 | `home.mandate` | `SectionHeader` + 2-column prose block | `src/content/home/mandate.md` |
| 5 | `home.research` | `SectionHeader` + 3× `ResearchHighlightCard` | `src/content/research/*.md` (curated) |
| 6 | `home.departments` | `SectionHeader` + `DepartmentPreview` grid (4–6 `Card` items linking to mini-sites) | `src/data/departments.yml` (`featured: true`) |
| 7 | `home.services` | `SectionHeader` + up to 4 `ServiceCard` | `src/data/services.yml` |
| 8 | `home.products` | `SectionHeader` + 6 product category tiles using `Card` `surface=card` | `src/data/products.yml` |
| 9 | `home.newsAndEvents` | `SectionHeader` + split layout: 3× `NewsCard` (left) and 2× `EventCard` (right) | `src/content/news/*.md`, `src/content/events/*.md` |
| 10 | `home.publications` | `SectionHeader` + 3× `PublicationItem compact` | `src/content/publications/*.md` (recent 3) |
| 11 | `home.partners` | `SectionHeader` + accessible logo strip (`<ul>` of `<img alt=…>`) | `src/data/partners.yml` |
| 12 | `home.footerHand-off` | `SiteFooter` | shared |

**Rules.**
- Section 1 (`hero`) is the only `<h1>`. Sections 4–11 use `level=2`.
- No more than **one** `AnnouncementBand` is rendered between hero and mandate. If two announcements are active, the higher-priority one renders and the second is queued (build picks deterministically by date).
- CTA discipline: hero contains ≤ 1 primary CTA; the only other prominent CTAs are the six `QuickAccessCard`s. No other "Apply now" or "Donate" buttons above the fold.

### 14.2 Generic content page (`T_GENERIC_CONTENT`)

```
<BaseLayout>
  <SiteHeader />
  <Breadcrumbs />
  <PageHero (h1.page) />
  <main>
    <ProseBlock width="prose" />            <!-- wrapped in layout_width.prose -->
    <SidebarNav (lg+ only) />               <!-- optional, sibling of prose -->
  </main>
  <SiteFooter />
</BaseLayout>
```

### 14.3 Department mini-site landing (`T_DEPARTMENT_HOME`)

```
<BaseLayout>
  <SiteHeader />
  <Breadcrumbs />
  <DepartmentHero />
  <DepartmentTabs sticky="lg" />
  <main>
    <SectionHeader title="Mandate & functions" />
    <ProseBlock width="content" columns="2-lg" />

    <SectionHeader title="Featured projects" viewAll />
    <Grid cols="1 md:2 lg:3"><ResearchHighlightCard /> × 2-3</Grid>

    <SectionHeader title="Recent publications" viewAll />
    <List><PublicationItem compact /> × 3-5</List>

    <SectionHeader title="Services offered" />
    <Grid cols="1 md:2"><ServiceCard /> × 1-4</Grid>

    <SectionHeader title="Department news" viewAll />
    <Grid cols="1 md:3"><NewsCard /> × 3</Grid>
  </main>
  <SiteFooter />
</BaseLayout>
```

### 14.4 Service detail (`T_SERVICE_DETAIL`) — Clinic / DAU / Generic

Section order is **fixed** to enforce template consistency (PRD §14 SV1):

1. `Breadcrumbs`
2. `Hero` (variant `centered`, surface `page`) with H1 + reassurance lede + max one primary `ButtonLink`
3. `SectionHeader` "Who we serve" + `ProseBlock`
4. `SectionHeader` "How it works" + numbered steps using a `<ol>` styled list (or a `Stepper` if implemented in a later story)
5. `SectionHeader` "Fees" + `Table` (with `lastUpdated`)
6. `SectionHeader` "Hours" + small `Table` or `DefinitionList`
7. `SectionHeader` "Documents & forms" + `DownloadCard row` list
8. `SectionHeader` "FAQs" + `FAQAccordion`
9. `SectionHeader` "Contact" + contact block with address, phone (`tel:`), email (`mailto:`), map link

Sections 4–9 may be conditionally rendered based on content availability; if rendered, they keep this order. The section with no content must not render an empty `SectionHeader`.

### 14.5 News / Events / Announcements list pages

- `NewsCard` listings: grid of 1 / 2 / 3 columns at `sm` / `md` / `lg`.
- `EventCard` listings: vertical list, grouped by month with a sticky month label (`text.muted` `font_size.sm`).
- `AnnouncementBand` archives: vertical list, items rendered as `Card surface=card elevation=outline`.

### 14.6 Search results (`T_SEARCH_RESULTS`)

```
<Breadcrumbs />
<h1>Results for "{query}"</h1>
<FilterChips />                       <!-- one chip per content type present in build -->
<section aria-label="Results"><SearchResultCard /> × N</section>
<EmptyState />                        <!-- shown when results === 0 -->
```

---

## 15. Accessibility rules

These rules are non-negotiable. The build gate (`npm run validate`) and review checklists enforce them.

- **Target:** WCAG 2.1 AA design target. Section 4 ARIA-related rules are minimum behaviours.
- **Skip link:** First focusable element on every page is `<a href="#main">Skip to main content</a>`, visually hidden until focused, then revealed in the top-left corner using `surface.card` + `border.brand` + `shadow.e2`.
- **Landmarks:** Exactly one `<header>`, `<main id="main">`, `<footer>` per page. Navigation regions are `<nav aria-label="…">` with distinct labels.
- **Headings:** Exactly one `<h1>` per page. Levels are sequential — no skipping.
- **Focus visibility:** Every interactive element shows `shadow.ring_focus` (or equivalent outline) on `:focus-visible`. `:focus-visible` is preferred over `:focus`. `outline: none` is permitted **only** when replaced by `shadow.ring_focus`.
- **Colour as state:** Never the only signal. Pair colour with icon, text, or pattern.
- **Form fields:** `<label>` is required and visible. Helper text uses `aria-describedby`. Error summaries appear at the top of the form on submit, linking to the failing fields.
- **Tables:** `<caption>` is required. Header cells declare `scope`. Numeric columns use `tabular-nums`.
- **Images:** `alt` is required. Decorative images use `alt=""`. Logos use the institution's name as alt text. Icons inside buttons use `aria-hidden` while the button text provides the accessible name.
- **Motion:** Respects `prefers-reduced-motion` (see §12).
- **Touch targets:** Interactive elements on mobile are ≥ 44×44px (PRD §25 AC4).
- **Reading order:** Visual order must match DOM order. CSS `order` and `flex-direction: reverse` are forbidden where they change reading order.
- **Language:** `<html lang="en">` is required at the layout level.

Forbidden: `tabindex` values > 0, removing the focus outline without replacement, `<div onclick>` interactive patterns, ARIA roles applied where a native element exists (e.g. `role="button"` on `<div>` when `<button>` is available), `placeholder` text used as the only label, justified text in body content (irregular spacing harms readability).

---

## 16. Responsive behavior rules

Breakpoints come from `breakpoint.*` in §1 and mirror Tailwind defaults so utility class scanning stays predictable.

| Breakpoint | Width | Layout behaviour |
|------------|-------|------------------|
| `< sm` (xs) | <640px | Single column. `MobileNavigation`. `Table` stacks. `Hero` text-first. Buttons `fullWidth` allowed. |
| `sm` | ≥640px | Optional 2-column card grids. Still mobile navigation. |
| `md` | ≥768px | 2-column hero (`split` variant), 2-column news/events split, optional compact utility row. |
| `lg` | ≥1024px | `MegaNavigation` and `UtilityNavigation` row visible. `DepartmentTabs` sticky. Sidebar layouts allowed. |
| `xl` | ≥1280px | Content widens to `layout_width.content` (1152px), then `layout_width.page_max` caps body. |
| `2xl` | ≥1536px | No content expands beyond `page_max`. Whitespace grows; line length stays under `measure.prose`. |

Rules:
- The site is **mobile-first**: every utility class without a breakpoint targets the smallest screens, breakpoint utilities upgrade as viewports grow.
- No horizontal scrolling at any breakpoint **except** where explicitly allowed (`Table responsive=scroll`, `DepartmentTabs mobile-scroll`).
- Below `md`, the entire viewport is one column except for inline metadata pairs (date + chip) and 2-up product grids on `sm`.
- Above `xl`, content **does not** continue to widen — extra space becomes margin.

Forbidden: viewport-width units for typography (`vw` font sizes), `100vh` heights on heroes (mobile browser chrome bug), `position: fixed` elements that overlap the only menu trigger on mobile, container queries in v1 (re-evaluated in v1.x when Tailwind v4 syntax stabilises in this codebase).

---

## 17. Content density rules

The site is dense but **readable**. These rules prevent both wall-of-text and over-padded "marketing" feel.

- **Body paragraphs:** Maximum width `measure.prose` (70ch). Below `md` the natural mobile width wins.
- **Section vertical rhythm:** `layout_width.section_y` between page sections on mobile; `section_y_lg` on `lg+`.
- **Cards per row at `lg+`:**
  - `QuickAccessCard`: 3 columns.
  - `ResearchHighlightCard`: 3 columns.
  - `ServiceCard`: 3 columns (4 if there are exactly 4 services in MVP).
  - `NewsCard`: 3 columns or split with events.
  - `StaffCard`: 3 or 4 columns.
  - `ProductCard`: 3 or 4 columns.
- **Lists vs cards:** Long collections (publications, downloads, staff directories) use list rows (`PublicationItem`, `DownloadCard row`, `StaffCard initials` row variant when needed). Reserve cards for **discovery surfaces** (homepage, hub pages, previews).
- **Whitespace floor:** Every `Card` has at least `space.5` inner padding. Every section has at least `space.10` block padding.
- **Microcopy:** Eyebrows ≤ 4 words. Helper lines on `QuickAccessCard` ≤ 60 chars. Section descriptions ≤ 2 sentences.

Forbidden: tight 4-column-or-more card rows at `lg`, full-bleed banner photography between every section, two consecutive sections sharing the same background colour without a visible divider rule (`border.subtle`).

---

## 18. Do examples

These are the **right** patterns. A coding agent generating new code should match these shapes.

**Do — Use semantic tokens in Tailwind v4:**

```html
<article class="bg-surface-card border border-border-subtle rounded-md p-5 hover:shadow-e2">
  <h3 class="text-h4 text-text-primary">Drug Analysis Unit</h3>
  <p class="text-text-secondary mt-2">Submit herbal samples for laboratory analysis.</p>
  <a href="/services/drug-analysis-unit/" class="text-link mt-3 inline-flex items-center gap-2">
    Learn more <Icon name="arrow-right" class="size-md" aria-hidden="true" />
  </a>
</article>
```

**Do — Render an external link explicitly:**

```html
<a href="https://example.org/partner" rel="noopener noreferrer"
   aria-label="Visit Ministry of Health (opens external site)"
   class="text-link inline-flex items-center gap-1">
  Ministry of Health
  <Icon name="external-link" class="size-sm" aria-hidden="true" />
</a>
```

**Do — Reduce motion correctly:**

```css
.qac { transition: box-shadow var(--duration-base) var(--easing-standard); }
@media (prefers-reduced-motion: reduce) {
  .qac { transition: none; }
}
```

**Do — Source content from `src/content` / `src/data`:**

```astro
---
import { getEntry } from 'astro:content';
const mandate = await getEntry('home', 'mandate');
---
<section>
  <SectionHeader title={mandate.data.title} eyebrow={mandate.data.eyebrow} />
  <div class="prose-cpmr"><mandate.Content /></div>
</section>
```

---

## 19. Do-not examples

These are **anti-patterns**. A coding agent producing any of these must stop and ask.

**Do not — Arbitrary Tailwind values:**

```html
<!-- ❌ FORBIDDEN: raw hex and pixel arbitrary values -->
<div class="bg-[#2D5F47] p-[13px] rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,.1)]">…</div>
```

**Do not — Inline styles for colour or spacing:**

```html
<!-- ❌ FORBIDDEN -->
<button style="background:#3E7B5C; padding: 13px; border-radius: 7px;">Submit</button>
```

**Do not — Icon-only navigation:**

```html
<!-- ❌ FORBIDDEN: no visible label -->
<a href="/services/clinic/"><Icon name="hospital" /></a>
```

**Do not — Embedded marketing copy in components:**

```astro
---
// ❌ FORBIDDEN: institutional copy hardcoded in component
---
<section><h2>Ghana's Most Trusted Plant Medicine Centre Since 1975!</h2></section>
```

**Do not — Multiple competing CTAs in a hero:**

```html
<!-- ❌ FORBIDDEN: hero with two primary CTAs -->
<section class="hero">
  <h1>Welcome to CPMR</h1>
  <a class="btn-primary">Apply Now</a>
  <a class="btn-primary">Donate</a>
</section>
```

**Do not — Stack overflow z-index:**

```css
/* ❌ FORBIDDEN: z-index outside the declared scale */
.tooltip { z-index: 9999; }
```

**Do not — Accent for body content:**

```html
<!-- ❌ FORBIDDEN: warm accent used as background of a content section -->
<section class="bg-accent-500"><p class="text-on-accent">Read our latest report…</p></section>
```

---

## 20. Astro / Tailwind v4 implementation notes

### 20.1 Token plumbing into Tailwind v4

Tailwind v4 reads design tokens via the `@theme` directive in CSS. The repository's `src/styles/global.css` must expose tokens in §1 to Tailwind. The shape below is the canonical mapping; an agent generating CSS may transcribe values from §1 into this file 1-for-1 (and **only** into this file).

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* COLOR — brand */
  --color-brand-50:  #F2F7F4;
  --color-brand-100: #E1ECE5;
  --color-brand-200: #C1D9C9;
  --color-brand-300: #94BCA2;
  --color-brand-400: #62997B;
  --color-brand-500: #3E7B5C;
  --color-brand-600: #2D5F47;
  --color-brand-700: #234C39;
  --color-brand-800: #1B3B2D;
  --color-brand-900: #142C22;
  --color-brand-950: #0B1A14;

  /* COLOR — neutral */
  --color-neutral-0:   #FFFFFF;
  --color-neutral-50:  #F8F8F6;
  --color-neutral-100: #EFEEEA;
  --color-neutral-200: #DDDBD3;
  --color-neutral-300: #C2BFB3;
  --color-neutral-400: #9C998B;
  --color-neutral-500: #757368;
  --color-neutral-600: #585649;
  --color-neutral-700: #403F35;
  --color-neutral-800: #2A2924;
  --color-neutral-900: #181816;
  --color-neutral-950: #0E0E0D;

  /* COLOR — accent */
  --color-accent-50:  #FDF5F1;
  --color-accent-100: #FAE7DC;
  --color-accent-200: #F3CCB7;
  --color-accent-300: #E8A684;
  --color-accent-400: #DC7E51;
  --color-accent-500: #C5602F;
  --color-accent-600: #A14D24;
  --color-accent-700: #7E3D1D;

  /* COLOR — semantic */
  --color-success-fg: #1B5E3C; --color-success-bg: #E5F1EA;
  --color-warning-fg: #7A4F00; --color-warning-bg: #FBF1DA;
  --color-danger-fg:  #8B1A1A; --color-danger-bg:  #FBE6E6;
  --color-info-fg:    #1F4B7A; --color-info-bg:    #E4EEF8;

  /* SURFACES & ROLES (Tailwind utilities like bg-surface-card, text-text-primary) */
  --color-surface-page:    var(--color-neutral-50);
  --color-surface-card:    var(--color-neutral-0);
  --color-surface-sunken:  var(--color-neutral-100);
  --color-surface-inverse: var(--color-brand-800);
  --color-text-primary:    var(--color-neutral-900);
  --color-text-secondary:  var(--color-neutral-700);
  --color-text-muted:      var(--color-neutral-500);
  --color-text-inverse:    var(--color-neutral-50);
  --color-text-link:       var(--color-brand-700);
  --color-text-link-hover: var(--color-brand-800);
  --color-text-on-brand:   var(--color-neutral-50);
  --color-text-on-accent:  var(--color-neutral-0);
  --color-border-subtle:   var(--color-neutral-200);
  --color-border-default:  var(--color-neutral-300);
  --color-border-strong:   var(--color-neutral-500);
  --color-border-brand:    var(--color-brand-600);

  /* FONT FAMILIES */
  --font-sans:  'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Source Serif 4', 'Source Serif Pro', Georgia, 'Times New Roman', serif;
  --font-mono:  ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

  /* TYPE SCALE */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-md:   1.125rem;
  --text-lg:   1.25rem;
  --text-xl:   1.5rem;
  --text-2xl:  1.875rem;
  --text-3xl:  2.25rem;
  --text-4xl:  2.75rem;
  --text-5xl:  3.5rem;

  /* SPACING (only documented steps) */
  --spacing: 0.25rem; /* Tailwind v4 root spacing scale base — utilities like p-4 = 4 * --spacing */

  /* LAYOUT WIDTH */
  --container-prose:   44rem;
  --container-narrow:  36rem;
  --container-content: 72rem;
  --container-page:    80rem;

  /* RADIUS */
  --radius-none: 0;
  --radius-sm:   0.125rem;
  --radius-md:   0.375rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1.25rem;
  --radius-pill: 9999px;

  /* SHADOW */
  --shadow-e1: 0 1px 0 0 rgba(20, 44, 34, 0.06);
  --shadow-e2: 0 1px 2px 0 rgba(20, 44, 34, 0.06), 0 1px 3px 0 rgba(20, 44, 34, 0.08);
  --shadow-e3: 0 4px 6px -1px rgba(20, 44, 34, 0.08), 0 2px 4px -2px rgba(20, 44, 34, 0.06);
  --shadow-e4: 0 12px 24px -8px rgba(20, 44, 34, 0.18), 0 4px 8px -4px rgba(20, 44, 34, 0.10);
  --shadow-ring-focus: 0 0 0 3px rgba(62, 123, 92, 0.45);

  /* Z-INDEX (referenced via utilities z-header, z-mega, etc.) */
  --z-base: 0;
  --z-raised: 10;
  --z-sticky: 30;
  --z-header: 40;
  --z-mega: 50;
  --z-dropdown: 55;
  --z-mobile-drawer: 60;
  --z-search-overlay: 70;
  --z-modal: 80;

  /* MOTION */
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-entrance: cubic-bezier(0, 0, 0.2, 1);
  --easing-exit:     cubic-bezier(0.4, 0, 1, 1);
}

/* Skip link (visible on focus) */
.skip-to-content {
  position: absolute;
  left: -9999px;
}
.skip-to-content:focus-visible {
  left: var(--spacing) * 4;
  top:  var(--spacing) * 4;
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-e2);
  outline: 3px solid var(--color-brand-500);
  z-index: var(--z-modal);
}
```

### 20.2 Component file layout

- Components live under `src/components/` grouped by domain: `nav/`, `home/`, `cards/`, `department/`, `service/`, `search/`, `media/`, `forms/`, `primitives/`.
- Each component is an `.astro` file. Client-side islands are added **only** when stories require interactivity (mobile drawer, search overlay, lightbox).
- Component prop types live alongside the component as a TypeScript `interface` inside the frontmatter or imported from `src/types/`.

### 20.3 Astro static rules carried into design implementation

- All page templates use `output: 'static'` — no SSR-only props.
- Images use Astro's `<Image>` component for build-time optimisation.
- Markdown content under `src/content/` provides `<X.Content />` renderers; design components do not parse markdown themselves.
- No client-side fetch of CMS data at runtime (constitution §6, §11).

### 20.4 Tailwind utility usage rules

- Prefer semantic utilities: `bg-surface-card`, `text-text-secondary`, `border-border-subtle`, `shadow-e2`.
- Use raw scale utilities (`bg-brand-50`, `text-neutral-700`) only where no semantic role applies.
- Arbitrary values (`bg-[#…]`, `p-[13px]`) are forbidden by repo lint (a future story may enforce this via an ESLint rule or Stylelint plugin — record in `06_project_context.md` when added).
- `@apply` is permitted **only** inside `src/styles/global.css` for cross-component primitives (skip link, prose styles); component `.astro` files use utilities directly.

### 20.5 Build gate

The build is the contract enforcer. `npm run validate` runs `astro build` and must pass. Any change to this DESIGN.md that requires a token addition must update both §1 and §20.1 in the same commit so build remains consistent.

---

## 21. Change-control rule for future design updates

This document is versioned. **No agent or human may silently drift from the contract.**

1. **Versioning.** Top-of-document `Version:` field uses SemVer:
   - **Patch** (`1.0.x`) — typo fixes, clarifications, no token or component contract change.
   - **Minor** (`1.x.0`) — adding tokens, adding component variants, adding new components.
   - **Major** (`x.0.0`) — removing or repurposing tokens, removing components, changing default variant, breaking colour roles.
2. **Amendment procedure.** Any PR that touches `DESIGN.md`:
   - Bumps the version line.
   - Adds a row to the `Changelog` table below describing the change.
   - If the change is **minor** or **major**, links to (or creates) the corresponding implementation story in `docs/stories/` so the implementation lands behind the same review.
3. **Sync with Tailwind tokens.** Any change to §1 token values **must** be mirrored in §20.1 in the same commit. CI is expected to fail otherwise (story to add this lint is recommended in Phase 2).
4. **Conflict resolution with the constitution.** If `06_project_context.md` (the implementation constitution) contradicts this document, the constitution wins. The conflict is logged in the changelog and resolved by a follow-up update to this file.
5. **Component additions.** New components require a contract block matching the shape in §13 (Purpose, Anatomy, Props/API, Tokens used, Allowed variants, Forbidden variants, Accessibility, Notes). Pull requests without these fields are rejected.
6. **Removals & deprecations.** A component being removed is first marked **DEPRECATED** in this document for at least one minor release, with a pointer to the replacement, before the implementation is deleted.
7. **Out-of-scope assets.** Logo, brand mark, and final photography assets are governed alongside this document but stored separately under `src/assets/` and indexed in `src/data/site.yml`. Visual brand changes (logo lockup, photography treatment direction beyond §11) require a major version bump.

### Changelog

| Version | Date | Author | Summary |
|--------|------|--------|---------|
| `1.0.0` | 2026-05-12 | UX Designer (Sally) | Initial design contract: tokens, principles, 27 component contracts, page sections, accessibility/responsive/density rules, Astro/Tailwind v4 implementation notes, change control. |

---

*End of DESIGN.md v1.0.0 — authoritative.*
