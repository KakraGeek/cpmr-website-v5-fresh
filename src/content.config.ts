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
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import {
  applyRefIntegrityResult,
  assertBuildTimeRefIntegritySmokeTest,
  indexCollectionIds,
  validatePlainIdsExist,
  type RefIntegrityResult,
} from './lib/content/refs';
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

const projectIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'project id must be kebab-case');

const projectStatusSchema = z.enum(['planned', 'active', 'completed']);

const projectTeamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  staff_id: z.string().optional(),
});

/** E6-S02 — `projects` collection (02_prd.md §11 R2; 05 §4.5). */
const projectEntrySchema = authoredEditorialEnvelopeSchema
  .merge(authoredSeoEnvelopeSchema)
  .merge(
    z.object({
      entry_type: z.literal('project'),
      id: projectIdSchema,
      title: z.string().min(1),
      /** PRD §11 R2 — therapeutic / research area. */
      research_area: z.string().min(1),
      summary: z.string().min(1),
      status: projectStatusSchema,
      department_ids: z.array(departmentIdSchema).min(1),
      background: z.string().min(1),
      objectives: z.array(z.string().min(1)).min(1),
      activities: z.array(z.string().min(1)).min(1),
      team: z.array(projectTeamMemberSchema).min(1),
      partners: z.array(z.string().min(1)).default([]),
      outputs: z.array(z.string().min(1)).default([]),
      publication_ids: z.array(z.string()).default([]),
      staff_lead_ids: z.array(z.string()).default([]),
      partner_orgs: z.array(z.string().min(1)).optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      funding_sources_markdown: z.string().optional(),
      contact: z
        .object({
          label: z.string().optional(),
          email: z.string().email().optional(),
          href: z.string().min(1).optional(),
        })
        .optional(),
    }),
  );

const projectsIndexShellSchema = authoredEditorialEnvelopeSchema
  .merge(authoredSeoEnvelopeSchema)
  .merge(
    z.object({
      entry_type: z.literal('index_shell'),
      page_title: z.string().min(1),
      lede: z.string().min(1),
      intro_paragraphs: z.array(z.string().min(1)).min(1),
      listing_section_title: z.string().min(1).default('All projects'),
      empty_state_title: z.string().min(1),
      empty_state_body: z.string().min(1),
    }),
  );

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.discriminatedUnion('entry_type', [projectEntrySchema, projectsIndexShellSchema]),
});

export const collections = {
  _bootstrap,
  home,
  settings,
  departments,
  projects,
};

function mergeRefIntegrityResults(results: readonly RefIntegrityResult[]): RefIntegrityResult {
  const issues = results.flatMap((r) => r.issues);
  const shouldFailBuild = results.some((r) => r.shouldFailBuild);
  return { issues, shouldFailBuild };
}

const KEBAB_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readFrontmatterBlock(filePath: string): string {
  const raw = readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`[cpmr-project-integrity] Missing frontmatter in ${filePath}`);
  }
  return match[1];
}

function readScalarField(frontmatter: string, key: string): string | undefined {
  const re = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm');
  const m = frontmatter.match(re);
  if (!m) return undefined;
  const value = m[1].trim();
  if (value === '' || value === '~' || value === 'null') return undefined;
  return value.replace(/^['"]|['"]$/g, '');
}

function readEntryType(frontmatter: string): string | undefined {
  return readScalarField(frontmatter, 'entry_type');
}

function readInlineStringArray(frontmatter: string, key: string): string[] {
  const re = new RegExp(`^${key}:\\s*(\\[[^\\]]*\\])\\s*$`, 'm');
  const m = frontmatter.match(re);
  if (!m) return [];
  const inner = m[1].slice(1, -1).trim();
  if (inner === '') return [];
  return inner
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter((s) => s.length > 0);
}

function indexDepartmentIdsFromContentDir(): ReadonlySet<string> {
  const dir = join(process.cwd(), 'src/content/departments');
  if (!existsSync(dir)) return new Set();

  const ids: string[] = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (!name.isFile()) continue;
    const ext = extname(name.name);
    if (ext !== '.md' && ext !== '.mdx') continue;
    const fm = readFrontmatterBlock(join(dir, name.name));
    if (readEntryType(fm) !== 'department') continue;
    const id = readScalarField(fm, 'id');
    if (id && KEBAB_ID.test(id)) ids.push(id);
  }
  return indexCollectionIds(ids.map((id) => ({ id })));
}

function indexIdsFromContentDir(dirRelativeToSrc: string, entryType: string): ReadonlySet<string> {
  const dir = join(process.cwd(), 'src/content', dirRelativeToSrc);
  if (!existsSync(dir)) return new Set();

  const ids: string[] = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (!name.isFile()) continue;
    const ext = extname(name.name);
    if (ext !== '.md' && ext !== '.mdx') continue;
    const fm = readFrontmatterBlock(join(dir, name.name));
    if (readEntryType(fm) !== entryType) continue;
    const id = readScalarField(fm, 'id');
    if (id && KEBAB_ID.test(id)) ids.push(id);
  }
  return indexCollectionIds(ids.map((id) => ({ id })));
}

/** E6-S02 — project `department_ids`, `staff_lead_ids`, `publication_ids` vs indexes (§5.4 scholarly warn). */
function assertProjectRelationshipIntegrity(): void {
  const projectDir = join(process.cwd(), 'src/content/projects');
  if (!existsSync(projectDir)) return;

  const departmentIndex = indexDepartmentIdsFromContentDir();
  const staffIndex = indexIdsFromContentDir('staff', 'staff');
  const publicationIndex = indexIdsFromContentDir('publications', 'publication');

  const parts: RefIntegrityResult[] = [];

  for (const name of readdirSync(projectDir, { withFileTypes: true })) {
    if (!name.isFile()) continue;
    const ext = extname(name.name);
    if (ext !== '.md' && ext !== '.mdx') continue;

    const sourceFile = join('src/content/projects', name.name);
    const fm = readFrontmatterBlock(join(projectDir, name.name));
    if (readEntryType(fm) !== 'project') continue;

    const projectId = readScalarField(fm, 'id');
    const stem = basename(name.name, ext);
    if (projectId && stem !== projectId) {
      throw new Error(
        `[cpmr-project-integrity] Project id "${projectId}" must match file stem "${stem}" (${name.name})`,
      );
    }

    const departmentIds = readInlineStringArray(fm, 'department_ids');
    if (departmentIds.length > 0) {
      parts.push(
        validatePlainIdsExist({
          ids: departmentIds,
          index: departmentIndex,
          relationship: `${sourceFile} department_ids → departments.id`,
          surface: 'scholarly_general',
        }),
      );
    }

    const staffLeadIds = readInlineStringArray(fm, 'staff_lead_ids');
    if (staffLeadIds.length > 0) {
      parts.push(
        validatePlainIdsExist({
          ids: staffLeadIds,
          index: staffIndex,
          relationship: `${sourceFile} staff_lead_ids → staff.id`,
          surface: 'scholarly_general',
        }),
      );
    }

    const publicationIds = readInlineStringArray(fm, 'publication_ids');
    if (publicationIds.length > 0) {
      parts.push(
        validatePlainIdsExist({
          ids: publicationIds,
          index: publicationIndex,
          relationship: `${sourceFile} publication_ids → publications.id`,
          surface: 'scholarly_general',
        }),
      );
    }
  }

  applyRefIntegrityResult(mergeRefIntegrityResults(parts));
}

/** REM-CARCH-006 — exercises fail/warn matrix whenever Astro loads content config (build + dev). */
assertBuildTimeRefIntegritySmokeTest();

/** E5-S09 — department `head_of_department_staff_id` / `related_service_ids` vs target indexes (§5.4). */
assertDepartmentRelationshipIntegrity();

/** E6-S02 — project cross-collection foreign keys (§5.4 scholarly warn). */
assertProjectRelationshipIntegrity();
