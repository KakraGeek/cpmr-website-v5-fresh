// Content collections entry point.
// Authoritative references:
// - docs/03_architecture/04_architecture.md §5 — schemas live here; relationships use stable
//   string IDs resolved at build time; forward-compat with CMS / build-time ingestion.
// - docs/03_architecture/05_content_architecture_and_cms_strategy.md §4.1 — `settings`
//   singletons (`site`, `footer`, `contact`, `seo_defaults`) and global editorial/search fields.
// - docs/03_architecture/05_content_architecture_and_cms_strategy.md §19 — relationship
//   resolvers live in `src/lib/content/refs.ts` (REM-CARCH-006); smoke test runs at config load.
//
// Astro 6 convention: src/content.config.ts (top-level). Do not duplicate at src/content/config.ts.
// Constitution: docs/03_architecture/06_project_context.md — static output, no SSR.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { assertBuildTimeRefIntegritySmokeTest } from './lib/content/refs';

// `_bootstrap` is an intentionally trivial collection that proves the content config
// pipeline compiles and that Zod validation runs at build time. It MUST be replaced or
// supplemented by real collections (departments, staff, projects, publications, services,
// products, news, events, announcements, downloads, pages, settings) in later E0/E1+
// stories — see architecture §5.1 for the recommended split.
const _bootstrap = defineCollection({
  loader: glob({ base: './src/content/_bootstrap', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
  }),
});

/** E3-S01 — Homepage hero (DESIGN.md §13.7 `Hero`, §14.1 `home.hero`). */
const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: 'hero.md' }),
  schema: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    lede: z.string().optional(),
    /** At most one primary CTA (DESIGN.md §13.7, §14.1). */
    primary_action: z
      .object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
      .optional(),
    variant: z.enum(['centered', 'split']).default('centered'),
    surface: z.enum(['page', 'inverse']).default('page'),
    image: z
      .object({
        src: z.string().min(1),
        alt: z.string(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
  }),
});

/**
 * REM-CARCH-003 / 05 §4.1 — `settings` singletons (not routed; consumed via `getEntry`).
 * Frontmatter `settings_kind` must match the entry id stem (`site` | `footer` | `contact` |
 * `seo_defaults`) so Zod can discriminate shapes until per-id schema hooks exist.
 */
const settingsEditorialEnvelopeSchema = z.object({
  editorial_status: z.enum(['draft', 'in_review', 'approved', 'archived']),
  content_owner_role: z.enum(['super_admin', 'content_admin']),
  last_reviewed: z.string().optional(),
  last_updated: z.string().optional(),
});

const settingsSiteSchema = settingsEditorialEnvelopeSchema.merge(
  z.object({
    settings_kind: z.literal('site'),
    site_name: z.string().min(1),
    site_tagline: z.string().optional(),
    default_locale: z.literal('en').default('en'),
    organisation_legal_name: z.string().min(1),
    primary_phone: z.string().optional(),
    primary_email: z.string().email().optional(),
    postal_address_lines: z.array(z.string().min(1)).min(1),
    social_links: z
      .array(
        z.object({
          platform: z.string().min(1),
          href: z.string().url(),
          label: z.string().min(1),
        }),
      )
      .default([]),
    /** 05 §12.2 — production origin for `<link rel="canonical">` / `og:url` (no trailing slash). */
    public_site_url: z.string().url(),
    seo_title_suffix: z.string().default('| CPMR'),
    seo_default_description: z.string().min(1),
    /** 05 §156–162 — SEO envelope + search behaviour for governed authored types. */
    seo_title: z.string().min(1),
    seo_description: z.string().min(1),
    seo_canonical_path: z.string().optional(),
    og_image: z.string().optional(),
    index_behavior: z.literal('metadata_only'),
    search_note: z.string().optional(),
  }),
);

/** Footer singleton: editorial shell; institution contact lines surface from `contact` (REM-CARCH-004). */
const settingsFooterSchema = settingsEditorialEnvelopeSchema.merge(
  z.object({
    settings_kind: z.literal('footer'),
    index_behavior: z.literal('exclude'),
    search_note: z.string().optional(),
  }),
);

/** Contact singleton: optional operational lines; REM-CARCH-004/005 may extend consumers. */
const settingsContactSchema = settingsEditorialEnvelopeSchema.merge(
  z.object({
    settings_kind: z.literal('contact'),
    index_behavior: z.literal('exclude'),
    search_note: z.string().optional(),
    postal_address_lines: z.array(z.string().min(1)).optional(),
    primary_phone: z.string().optional(),
    primary_email: z.string().email().optional(),
  }),
);

/** Default SEO strings for layouts; REM-CARCH-005 will consume alongside `site`. */
const settingsSeoDefaultsSchema = settingsEditorialEnvelopeSchema.merge(
  z.object({
    settings_kind: z.literal('seo_defaults'),
    seo_title: z.string().min(1),
    seo_description: z.string().min(1),
    seo_title_suffix: z.string().default('| CPMR'),
    seo_default_description: z.string().min(1),
    index_behavior: z.literal('metadata_only'),
    search_note: z.string().optional(),
  }),
);

const settings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: '**/*.{md,mdx}' }),
  schema: z.discriminatedUnion('settings_kind', [
    settingsSiteSchema,
    settingsFooterSchema,
    settingsContactSchema,
    settingsSeoDefaultsSchema,
  ]),
});

export const collections = {
  _bootstrap,
  home,
  settings,
};

/** REM-CARCH-006 — exercises fail/warn matrix whenever Astro loads content config (build + dev). */
assertBuildTimeRefIntegritySmokeTest();
