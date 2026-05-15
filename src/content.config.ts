// Content collections entry point.
// Authoritative references:
// - docs/03_architecture/04_architecture.md §5 — schemas live here; relationships use stable
//   string IDs resolved at build time; forward-compat with CMS / build-time ingestion.
// - docs/03_architecture/05_content_architecture_and_cms_strategy.md §4.1 — `settings`
//   singletons (`site`, `footer`, `contact`, `seo_defaults`) and global editorial/search fields.
// - docs/03_architecture/05_content_architecture_and_cms_strategy.md §19 — relationship
//   resolvers live in `src/lib/content/refs.ts` (REM-CARCH-006); smoke test runs at config load.
// - docs/03_architecture/04_architecture.md §5.4 — E5-S09 department FK walk via
//   `scripts/validate-department-relationships.ts` at config load.
//
// Astro 6 convention: src/content.config.ts (top-level). Do not duplicate at src/content/config.ts.
// Constitution: docs/03_architecture/06_project_context.md — static output, no SSR.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { assertBuildTimeRefIntegritySmokeTest } from './lib/content/refs';
import { assertDepartmentRelationshipIntegrity } from '../scripts/validate-department-relationships';

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

const quickAccessTileIcon = z.enum([
  'clinic',
  'dau',
  'departments',
  'publications',
  'products',
  'contact',
]);

/** E3-S01 — Homepage hero (DESIGN.md §13.7 `Hero`, §14.1 `home.hero`). */
const homeHeroSchema = z.object({
  kind: z.literal('hero'),
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
});

/** E3-S02 — Quick access grid (DESIGN.md §13.8 `QuickAccessCard`, UX Blueprint §7 H2). */
const homeQuickAccessSchema = z
  .object({
    kind: z.literal('quick_access'),
    section_title: z.string().min(1).default('Quick access'),
    tiles: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.string().min(1),
          helper: z.string().max(60).optional(),
          icon: quickAccessTileIcon,
          tone: z.enum(['neutral', 'brand']).default('neutral'),
        }),
      )
      .length(6),
  })
  .superRefine((data, ctx) => {
    const brandCount = data.tiles.filter((t) => t.tone === 'brand').length;
    if (brandCount > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At most one tile may use tone "brand" (DESIGN.md §13.8).',
        path: ['tiles'],
      });
    }
  });

const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: '**/*.md' }),
  schema: z.discriminatedUnion('kind', [homeHeroSchema, homeQuickAccessSchema]),
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

/** 05 §4 — shared editorial + SEO envelopes for authored public collections. */
const authoredEditorialEnvelopeSchema = z.object({
  editorial_status: z.enum(['draft', 'in_review', 'approved', 'archived']),
  content_owner_role: z.enum(['super_admin', 'content_admin']),
  last_reviewed: z.string().optional(),
  last_updated: z.string().optional(),
});

const authoredSeoEnvelopeSchema = z.object({
  seo_title: z.string().min(1),
  seo_description: z.string().min(1),
  seo_canonical_path: z.string().optional(),
  og_image: z.string().optional(),
  index_behavior: z.enum(['full', 'metadata_only', 'exclude']),
  search_note: z.string().optional(),
});

const departmentIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'department id must be kebab-case');

const departmentHeroSchema = z.object({
  headline: z.string().min(1),
  lede: z.string().optional(),
  image: z
    .object({
      src: z.string().min(1),
      alt: z.string(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
});

const departmentMiniSiteNavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

/** E5-S01 — `departments` collection (04_architecture.md §5–§6; 05 §4.3). */
const departmentEntrySchema = authoredEditorialEnvelopeSchema
  .merge(authoredSeoEnvelopeSchema)
  .merge(
    z.object({
      entry_type: z.literal('department'),
      id: departmentIdSchema,
      name: z.string().min(1),
      category: z.enum(['research', 'service', 'administrative']),
      /** UX Blueprint §10.4 — stakeholder-verified; omit from public index when false. */
      verified: z.boolean(),
      mandate_summary: z.string().min(1),
      hero: departmentHeroSchema,
      head_of_department_staff_id: z.string().optional(),
      mini_site_nav: z.array(departmentMiniSiteNavItemSchema).default([]),
      related_service_ids: z.array(z.string()).default([]),
      sort_order: z.number().int().optional(),
    }),
  )
  .superRefine((data, ctx) => {
    for (const item of data.mini_site_nav) {
      const expectedPrefix = `/departments/${data.id}/`;
      if (!item.href.startsWith(expectedPrefix)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `mini_site_nav href must start with ${expectedPrefix}`,
          path: ['mini_site_nav'],
        });
      }
    }
  });

/** Governed shell copy for `/departments/` — not listed as a department card. */
const departmentsIndexShellSchema = authoredEditorialEnvelopeSchema
  .merge(authoredSeoEnvelopeSchema)
  .merge(
    z.object({
      entry_type: z.literal('index_shell'),
      page_title: z.string().min(1),
      lede: z.string().min(1),
      intro_paragraphs: z.array(z.string().min(1)).min(1),
      listing_section_title: z.string().min(1).default('Our departments'),
      empty_state_title: z.string().min(1),
      empty_state_body: z.string().min(1),
    }),
  );

const departments = defineCollection({
  loader: glob({ base: './src/content/departments', pattern: '**/*.{md,mdx}' }),
  schema: z.discriminatedUnion('entry_type', [departmentEntrySchema, departmentsIndexShellSchema]),
});

export const collections = {
  _bootstrap,
  home,
  settings,
  departments,
};

/** REM-CARCH-006 — exercises fail/warn matrix whenever Astro loads content config (build + dev). */
assertBuildTimeRefIntegritySmokeTest();

/** E5-S09 — department `head_of_department_staff_id` / `related_service_ids` vs target indexes (§5.4). */
assertDepartmentRelationshipIntegrity();
